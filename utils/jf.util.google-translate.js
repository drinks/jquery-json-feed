(function($){
    $.extend($.fn.JSONFeed.utils, {
        /**
         * Translate text into a given language.
         * @requires google.language.translate <http://code.google.com/apis/language/translate/v1/getting_started.html>
         */
        googleTranslate: function(el, lang, selector){
            var el = $(el);
            el.find(selector).each(function(idx, el){
                var node = $(this),
                text = node.html();
                if(typeof google.language != 'undefined'){
                    google.language.translate(text, '', lang, function(res){
                        if(res.translation){
                            node.html(res.translation);
                        }
                    });
                }
            });
        }
    });
})(jQuery);