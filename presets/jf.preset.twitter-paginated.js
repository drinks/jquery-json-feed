(function($){
    $.extend($.fn.JSONFeed.presets, {
        'twitterPaginated': {
            /**
            * Twitter User Feed
            * @requires utils.activateLinks
            * @requires utils.hoverCardsWithUsernames
            */
            template: '<div class="jf-tweet clearfix" id="tweet-{{id_str}}">\
            <a class="jf-avatar" href="http://twitter.com/intent/user?screen_name={{user.screen_name}}"><img src="{{user.profile_image_url}}" alt="{{user.screen_name}}" width="{%avatar_width%}" height="{%avatar_height%}" /></a>\
            <p class="jf-tweet"><a class="anywhere-username" href="http://twitter.com/intent/user?screen_name={{user.screen_name}}">{{user.screen_name}}</a> - <span class="tweet-text">{{text}}</span></p>\
            <p class="jf-meta"><a class="jf-timestamp tweet-permalink" href="http://twitter.com/{{user.screen_name}}/status/{{id_str}}" title="{{created_at}}"></a>\
            <a class="twitter-intent tweet-reply" href="http://twitter.com/intent/tweet?in_reply_to={{id_str}}"><span class="icon"></span> Reply</a>\
            <a class="twitter-intent tweet-retweet" href="http://twitter.com/intent/retweet?tweet_id={{id_str}}"><span class="icon"></span> Retweet</a>\
            <a class="twitter-intent tweet-favorite" href="http://twitter.com/intent/favorite?tweet_id={{id_str}}"><span class="icon"></span> Favorite</a></p>\
            </div>',
            iterator: function(data){ return data; },
            pollUrlGenerator: function(url, data, options){
                var objs = options.iterator(data);
                if(objs && objs.length){
                    var since_id = objs[0].id_str;
                    if(url.match('since_id') !== null){
                        url = url.replace(/since_id=[\d]+/g, 'since_id=' + since_id);
                    }else{
                        if(url.match(/\?/) !== null){
                            url += '&since_id=' + since_id;
                        }else{
                            url += '?since_id=' + since_id;
                        }
                    }
                }
                window.console && console.log && console.log('polling:', url);
                return url;
            },
            paginationUrlGenerator: function(url, data, options){
                var objs = options.iterator(data);
                if(objs && objs.length){
                    var max_id = objs[objs.length - 1].id_str;
                    if(url.match('max_id') !== null){
                        url = url.replace(/(&|\?)max_id=([\d]+)/g, function($0, $1, $2){return $1+'max_id='+max_id});
                    }else{
                        max_id = objs[objs.length - 1].id_str;
                        if(url.match(/\?/) !== null){
                            url += '&max_id=' + max_id;
                        }else{
                            url += '?max_id=' + max_id;
                        }
                    }
                }
                window.console && console.log && console.log('paginating:', url);
                return url;
            },
            renderCallback: function(str){
                var str = $(this).JSONFeed.utils.activateLinks(str);
                return $(this).JSONFeed.utils.activateTwitterHashTags(str);
            },
            appendCallback: function(){
                $(this).parent().find('.jf-timestamp').each(function() {
                    var date = new Date($(this).attr('title').replace('+0000', 'GMT'));
                    $(this).text(date.toUTCString()).relativeDate();
                });
            }
        }
    });
})(jQuery);