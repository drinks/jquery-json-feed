(function($, window, undefined){
    $.fn.JSONFeed = function(opts){
        
        var presets = $(this).JSONFeed.presets,
        defaults = {
            url: 'http://search.twitter.com/search.json?q=jQuery',
            iterator: function(data){ return data; },
            num: 5,
            spinner: '<span>Loading..</span>',
            template: '<p style="color:#a00">You haven\'t set a template for this feed! see the <a href="'+$(this).JSONFeed.docsURL+'"docs</a>.</p>',
            jsonVarP: /\{\{([^\}]+)\}\}/gm,
            optionP: /\{%([^%]+)%\}/gm,
            renderCallback: function(str){return str},
            appendCallback: function(){},
        },
        options = $.extend({}, defaults, opts),
        render = function(data){
            var str = options.template.replace(options.jsonVarP, function($0,$1){return data[$1] || ''})
                .replace(options.optionP, function($0,$1){return options[$1] || ''});
            return options.renderCallback(str);
        };
        
        return $(this).each(function(){
            var self = this;
            $(self).append($(options.spinner).addClass('jf-spinner'));
            $.getJSON(options.url, 'callback=?', function(data, status){
                $(self).find('.jf-spinner').remove();
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
    $.fn.JSONFeed.docsURL = 'http://github.com/dandrinkard/jquery-json-feed/';
})(jQuery, window);