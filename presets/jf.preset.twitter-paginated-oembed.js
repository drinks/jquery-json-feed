(function($){
    $.extend($.fn.JSONFeed.presets, {
        'twitterPaginatedOembed': {
            /**
            * Twitter User Feed, oEmbed via embedly
            * @requires twttr.anywhere <http://dev.twitter.com/anywhere>
            * @requires embedly-jquery <https://github.com/embedly/embedly-jquery>
            * @requires utils.activateLinks
            * @requires utils.hoverCardsWithUsernames
            */
            template: '<div class="jf-tweet" id="tweet-{{id_str}}">\
            <a href="http://twitter.com/{{user.screen_name}}"><img src="{{user.profile_image_url}}" alt="{{user.screen_name}}" width="{%avatar_width%}" height="{%avatar_height%}" /></a>\
            <p class="jf-meta">\
            <a class="anywhere-username" href="http://twitter.com/{{user.screen_name}}">{{user.screen_name}}</a> - \
            <a class="jf-timestamp" href="http://twitter.com/{{user.screen_name}}/status/{{id_str}}" title="{{created_at}}"></a></p>\
            <p class="jf-tweet">{{text}}</p>\
            </div>',
            iterator: function(data){ return data; },
            pollUrlGenerator: function(url, data, options){
                var objs = options.iterator(data);
                if(objs && objs.length){
                    var since_id = objs[0].id_str;
                    if(url.match('since_id') !== null){
                        url = url.replace(/since_id=[0-9]+/, 'since_id=' + since_id);
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
                    var max_id = objs[objs.length-1].id_str;
                    if(url.match('max_id') !== null){
                        url = url.replace(/max_id=[0-9]+/, 'max_id=' + max_id);
                    }else{
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
                return str;
            },
            appendCallback: function(){
                $(this).parent().find('.jf-timestamp').each(function() {
                    var date = new Date(Date.parse($(this).attr('title')));
                    $(this).text(date.toUTCString()).relativeDate();
                });
                $(this).JSONFeed.utils.hovercardsWithUsernames(this);
                $(this).find('p.jf-tweet a').embedly();
            }
        }
    });
})(jQuery);