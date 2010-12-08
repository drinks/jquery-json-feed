(function($){
    $.extend($.fn.JSONFeed.utils, {
        /**
         * Activate hovercards on an element.
         * @requires twttr.anywhere <http://dev.twitter.com/anywhere>
         */
        hovercardsWithUsernames: function(el){
            var el = $(el),
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
})(jQuery);