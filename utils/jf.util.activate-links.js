(function($){
    $.extend($.fn.JSONFeed.utils, {
        /**
         * Activate plain text urls
         */
         activateLinks: function(str){
             return str.replace(/\s(https?\:\/\/[^\s\<]+)/gmi, function($0, $1){
                 return ' ' + $1.link($1)
             });
         }
     });
})(jQuery);