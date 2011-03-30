(function($){
    $.extend($.fn.JSONFeed.utils, {
        /**
         * Turn Twitter #hashtags into links to twitter searches
         * Supported in IE8+, Gecko, Webkit
         */
         activateTwitterHashTags: function(str){
             return str.replace(/(^|\s)?#([\w]+)/gmi, function($0, $1, $2){
                 return ($1 || '') + ('#'+$2).link('http://twitter.com/search/%23' + $2);
             });
         }
     });
})(jQuery);