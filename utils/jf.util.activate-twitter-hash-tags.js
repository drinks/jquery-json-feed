(function($){
    $.extend($.fn.JSONFeed.utils, {
        /**
         * Turn Twitter #hashtags into links to twitter searches
         */
         activateTwitterHashTags: function(str){
             return str.replace(/\s#([\w]+)/gmi, function($0, $1){
                 return ' ' + ('#'+$1).link('http://twitter.com/search/%23' + $1);
             });
         }
     });
})(jQuery);