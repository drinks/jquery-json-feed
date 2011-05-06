(function($){
    $.extend($.fn.JSONFeed.utils, {
        /**
         * Activate plain text urls
         * Supported in IE8+, Gecko, Webkit
         */
         activateLinks: function(str){
             return str.replace(/(\s|^)(https?:\/\/[\w-%&=\?#\.\/~\+@!]+)/gmi, function($0, $1, $2){
                 return ($1 || '') + $2.link($2)
             });
         }
     });
})(jQuery);