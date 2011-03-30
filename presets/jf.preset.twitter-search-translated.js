(function($){
    $.extend($.fn.JSONFeed.presets, {
        'twitterSearchTranslated': {
            /**
             * Twitter Search Feed
             * @requires twttr.anywhere <http://dev.twitter.com/anywhere>
             * @requires utils.activateLinks
             */
             template: '<div class="jf-tweet">\
                             <a href="http://twitter.com/{{from_user}}"><img src="{{profile_image_url}}" alt="{{from_user}}" width="{%avatar_width%}" height="{%avatar_height%}" /></a>\
                             <p class="jf-meta">\
                                 <a class="anywhere-username" href="http://twitter.com/{{from_user}}">{{from_user}}</a> - \
                                 <a class="jf-timestamp" href="http://twitter.com/{{from_user}}/status/{{id_str}}">{{created_at}}</a></p>\
                             <p class="jf-tweet">{{text}}</p>\
                         </div>',
             iterator: function(data){ return data.results; }
             renderCallback: function(str){
                 var str = $(this).JSONFeed.utils.activateLinks(str);
                 return $(this).JSONFeed.utils.activateTwitterHashTags(str);
                 return str;
             },
             appendCallback: function(){
                 var language = $(this).attr('data-language') || 'es';
                 $(this).JSONFeed.utils.googleTranslate(this, language, 'div.jf-tweet');
             }
        }
    });
})(jQuery);