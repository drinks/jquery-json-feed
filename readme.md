jQuery JSONFeed
===============

$.JSONFeed is an abstraction layer &amp; basic template engine built on top of $.getJSON
designed to make consuming and displaying JSONP feeds trivial and fun.

Usage:
------
*HTML:*

    <div class="my-feed" data-url="myfeed.json"></div>

*JavaScript:*

    $('.myfeed).JSONFeed();

Class attributes (Set via function options {}):
--------------------------------------------
* @string url: The url to fetch, globally settable
* @string jsonp: The name of the callback parameter
* @string jsonpCallback: The value of the callback parameter
* @function iterator: Callback function that returns a list of data objects to render
* @int num: Number of results to render per page
* @int poll: Number of seconds between content refreshes; 0 disables
* @function pollUrlGenerator: Callback function that returns the next url for the poller
                              (handy for setting since_id, etc)
* @bool paginate: Whether or not to show a 'Show more' button
* @function paginationUrlGenerator: Callback function that returns the next url for the paginator
* @string spinner: HTML markup for a spinner element to display while results are loading
* @string template: HTML markup for an individual result item
* @regexp jsonVarP: Pattern to match/capture variable references in the template
* @regexp optionP: Pattern to match/capture option references in the template
* @function renderCallback: Function that returns a modified rendered template
* @function appendCallback: Function called after a page of items are appended to the container

Instance attributes (Set via data-<attr>):
-----------------------------------------
* @string url: Overrides the global url
* @int num: Overrides the number of results to show
* @int poll: Overrides the global poll interval
* @bool paginate: Overrides the global paginate var

Instance private attrs (data('_key')):
--------------------------------------
* @object _poll:
* * lastUrl
* * lastTime
* * interval
* * count
* * page
* * data

* @object _page:
* * lastUrl
* * page
* * data

Using presets / utils:
----------------------
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <title>Test Page</title>
        <script type="text/javascript" src="http://platform.twitter.com/anywhere.js?id=PoUnNSPzXcVYKflGP02Hag&amp;v=1"></script>
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
        <script type="text/javascript" src="https://github.com/dandrinkard/jquery-json-feed/raw/master/jquery.json-feed.js"></script>
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
        <script type="text/javascript" src="https://github.com/dandrinkard/jquery-json-feed/raw/master/jquery.json-feed.js"></script>
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