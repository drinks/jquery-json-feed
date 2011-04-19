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
             template: '<div class="jf-tweet">\
                             <a href="http://twitter.com/{{user.screen_name}}"><img src="{{user.profile_image_url}}" alt="{{user.screen_name}}" width="{%avatar_width%}" height="{%avatar_height%}" /></a>\
                             <p class="jf-meta">\
                                 <a class="anywhere-username" href="http://twitter.com/{{user.screen_name}}">{{user.screen_name}}</a> - \
                                 <a class="jf-timestamp" href="http://twitter.com/{{user.screen_name}}/status/{{id_str}}">{{created_at}}</a></p>\
                             <p class="jf-tweet">{{text}}</p>\
                         </div>',
             iterator: function(data){ return data; },
             renderCallback: function(str){
                 var str = $(this).JSONFeed.utils.activateLinks(str);
                 return $(this).JSONFeed.utils.activateTwitterHashTags(str);
                 return str;
             },
             appendCallback: function(){
                 $(this).JSONFeed.utils.hovercardsWithUsernames(this);
                 $(this).find('a').embedly();
             }
        }
    });
})(jQuery);