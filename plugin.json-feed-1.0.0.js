(function($, window, undefined){
    $.fn.JSONFeed = function(opts){
        
        var presets = $(this).JSONFeed.presets,
        defaults = {
            url: 'http://projects.washingtonpost.com/moderation/twitter-feed/washington-post-tweets/recent.json',
            iterator: function(data){ return data; },
            num: 5,
            spinner: '<img class="jf-loading" src="http://media.washingtonpost.com/wp-srv/wpost/images/loading.gif" alt="loading..." />',
            template: presets.moderation.template,
            jsonVarP: /\{\{([^\}]+)\}\}/gm,
            optionP: /\{%([^%]+)%\}/gm,
            renderCallback: presets.moderation.renderCallback,
            appendCallback: presets.moderation.appendCallback,
        },
        options = $.extend({}, defaults, opts),
        render = function(data){
            var str = options.template.replace(options.jsonVarP, function($0,$1){return data[$1] || ''})
                .replace(options.optionP, function($0,$1){return options[$1] || ''});
            return options.renderCallback(str);
        };
        
        return $(this).each(function(){
            var self = this;
            $(self).append(options.spinner);
            $.getJSON(options.url, 'callback=?', function(data, status){
                $(self).find('.' + $(options.spinner).attr('className')).remove();
                $.each(options.iterator(data), function(idx, item){
                    if(idx<options.num){
                        $(self).append(render(item));
                    }else{
                        return false;
                    }
                });
                $(self).each(options.appendCallback);
            });
        });
    }
    
})(jQuery, window);