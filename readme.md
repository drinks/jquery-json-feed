jQuery JSONFeed
===============

$.JSONFeed is an abstraction layer &amp; basic template engine built on top of $.getJSON
designed to make consuming and displaying JSONP feeds trivial and fun.

Docs are coming soon, here are some usage examples

Using presets / utils:
----------------------
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <title>Test Page</title>
        <script type="text/javascript" src="http://platform.twitter.com/anywhere.js?id=PoUnNSPzXcVYKflGP02Hag&amp;v=1"></script>
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
        <script type="text/javascript" src="https://github.com/dandrinkard/jquery-json-feed/raw/master/jquery.json-feed-1.0.0.js"></script>
        <script type="text/javascript" src="https://github.com/dandrinkard/jquery-json-feed/raw/master/utils/jf.util.hovercards-with-usernames.js"></script>
        <script type="text/javascript" src="https://github.com/dandrinkard/jquery-json-feed/raw/master/presets/jf.preset.twp-django-moderation.js"></script>
    </head>
    <body>
    <div id="test"></div>
    <script type="text/javascript" charset="utf-8">
    (function($){
        $(function(){
            // using a preset
            $('#test').JSONFeed($.extend({}, $().JSONFeed.presets.twpDjangoModeration, {
                url: 'http://projects.washingtonpost.com/moderation/twitter-feed/washington-post-tweets/recent.json',
            }));
        });
    })(jQuery);
    </script>
    </body>
    </html>

Advanced options, the verbose way:
----------------------------------
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <title>Test Page</title>
        <script type="text/javascript" src="http://platform.twitter.com/anywhere.js?id=PoUnNSPzXcVYKflGP02Hag&amp;v=1"></script>
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
        <script type="text/javascript" src="https://github.com/dandrinkard/jquery-json-feed/raw/master/jquery.json-feed-1.0.0.js"></script>
    </head>
    <body>
    <div id="test"></div>
    <script type="text/javascript" charset="utf-8">
    (function($){
        $(function(){
            // advanced options, the verbose way
            $('#test').JSONFeed({
                url: 'http://search.twitter.com/search.json?q=jQuery',
                num:10,
                avatar_width: 32,
                avatar_height: 32,
                template: '<div class="jf-tweet">\
                                <a href="http://twitter.com/{{from_user}}"><img src="{{profile_image_url}}" alt="{{from_user}}" width="{%avatar_width%}" height="{%avatar_height%}" /></a>\
                                <p class="jf-meta">\
                                    <a class="anywhere-username" href="http://twitter.com/{{from_user}}">{{from_user}}</a> - \
                                    <a class="jf-timestamp" href="http://twitter.com/{{from_user}}/status/{{id_str}}">{{created_at}}</a></p>\
                                <p class="jf-tweet">{{text}}</p>\
                            </div>',
                iterator: function(data){
                    return data.results;
                },
                renderCallback: function(str){
                    // activate links
                    return str.replace(/\s(https?\:\/\/[^\s\<]+)/gmi, function($0, $1){
                        return ' ' + $1.link($1)
                    });
                },
                appendCallback: function(){
                    // do hovercards
                    var el = $(this),
                    selector = el.attr('tagName').toLowerCase();
                    if($(el).attr('id')){
                        selector += '#'+el.attr('id')
                    }
                    if(el.attr('className')){
                        selector+= '.'+el.attr('className');
                    }
                    twttr.anywhere(function(T){
                        T(selector).hovercards();
                        T(selector + ' .anywhere-username').hovercards({
                            username: function(el){
                                return el.innerHTML;
                            }
                        })
                    });
                }
            });
        });
    })(jQuery);
    </script>
    </body>
    </html>