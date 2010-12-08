jQuery JSONFeed
===============

$.JSONFeed is an abstraction layer &amp; basic template engine built on top of $.getJSON
designed to make consuming and displaying JSONP feeds trivial and fun.

Sample implementation (docs forthcoming)
----------------------------------------
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
                $('#test').JSONFeed($.extend({}, $().JSONFeed.presets.twpDjangoModeration, {
                    url: 'http://projects.washingtonpost.com/moderation/twitter-feed/washington-post-tweets/recent.json',
                }));
            });
        })(jQuery);
    </script>

    </body>
    </html>