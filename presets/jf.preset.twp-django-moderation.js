(function($){
    $.extend($.fn.JSONFeed.presets, {
        'twpDjangoModeration': {
            /**
             * WaPo Django Moderation Queue (tweets)
             * @requires twttr.anywhere <http://dev.twitter.com/anywhere>
             */
            spinner: '<img src="http://media.washingtonpost.com/wp-srv/wpost/images/loading.gif" alt="loading..." />',
            template: '<div class="wp-jf-tweet">\
                            <a href="http://twitter.com/{{twitter_user_name}}"><img src="{{twitter_image}}" alt="{{twitter_user_name}}" width="{%avatar_width%}" height="{%avatar_height%}" /></a>\
                            <p class="wp-jf-meta">\
                                <a class="anywhere-username" href="http://twitter.com/{{twitter_user_name}}">{{twitter_user_name}}</a> - \
                                <a class="wp-jf-timestamp" href="{{twitter_url}}">{{updated}}</a></p>\
                            <p class="wp-jf-tweet">{{message}}</p>\
                        </div>',
            renderCallback: function(str){
                return str;
            },
            appendCallback: function(){
                $(this).JSONFeed.utils.hovercardsWithUsernames(this);
            }
        }
    });
})(jQuery);