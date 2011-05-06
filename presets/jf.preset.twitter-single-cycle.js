(function($){
    $.extend($.fn.JSONFeed.presets, {
        'twitterSingleCycle': {
            /**
             * Single-tweet cycle module for WaPo
             * @requires jQuery.cycle <http://jquery.malsup.com/cycle>
             * @requires relative-date <http://github.com/dandrinkard/jquery-relative-date>
             * @requires Twitter Intents <http://platform.twitter.com/widgets.js>
             */
            spinner: '<img src="http://media.washingtonpost.com/wp-srv/wpost/images/loading.gif" alt="loading..." />',
            template: '<div class="story jf-tweet">\
                            <a href="http://twitter.com/intent/user?screen_name={{user.screen_name}}"><img class="left" src="{{user.profile_image_url}}" alt="{{twitter_user_name}}" width="{%avatar_width%}" height="{%avatar_height%}" /></a>\
                            <div class="margin-left-55">\
                                <h3><a href="http://twitter.com/intent/user?screen_name={{user.screen_name}}">{{user.screen_name}}</a> ({{user.name}})</h3>\
                                <p>{{text}}</p>\
                            </div>\
                            <p class="byline jf-meta">\
                                <a class="jf-timestamp tweet-permalink" href="http://twitter.com/{{user.screen_name}}/status/{{id_str}}" title="{{created_at}}"></a>\
                                <a class="twitter-intent tweet-reply" href="http://twitter.com/intent/tweet?in_reply_to={{id_str}}"><span class="icon"></span> Reply</a>\
                                <a class="twitter-intent tweet-retweet" href="http://twitter.com/intent/retweet?tweet_id={{id_str}}"><span class="icon"></span> Retweet</a>\
                                <a class="twitter-intent tweet-favorite" href="http://twitter.com/intent/favorite?tweet_id={{id_str}}"><span class="icon"></span> Favorite</a>\
                            </p>\
                            <div class="clear"></div>\
                        </div>',
            renderCallback: function(str){
                var str = $(this).JSONFeed.utils.activateLinks(str);
                return $(this).JSONFeed.utils.activateTwitterHashTags(str);
            },
            appendCallback: function(){
                $(this).parent().find('.jf-timestamp').each(function() {
                    var date = new Date(Date.parse($(this).attr('title')));
                    $(this).text(date.toUTCString()).relativeDate();
                });
                var module = $(this).parents('.module');
                $(this).cycle({
                    speedOut:150,
                    speedIn:150,
                    sync: false,
                    timeout: 8000,
                    prev: module.find('.carousel-control-prev'),
                    next: module.find('.carousel-control-next'),
                    pager: module.find('ul.cycle-controls'),
                    pause: true,
                    pagerAnchorBuilder: function(idx, el){
                        return '<li class="carousel-page-control"><a href="#"></a></li>';
                    },
                    updateActivePagerLink: function(pager, currSlide){
                        pager.children('.carousel-page-control').removeClass('on').eq(currSlide).addClass('on');

                    }
                });
            }
        }
    });
})(jQuery);