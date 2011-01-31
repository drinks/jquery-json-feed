(function($, window, undefined){
    $.fn.JSONFeed = function(opts){

        var defaults = {
            url: 'http://projects.washingtonpost.com/moderation/twitter-feed/washington-post-tweets/recent.json',
            jsonp: 'callback',
            jsonpCallback: '?',
            iterator: function(data){ return data; },
            num: 5,
            spinner: '<span>Loading...</span>',
            template: '<p style="color:#a00">You haven&apos;t set a template for this feed!</p>',
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
            var ajaxOpts = {
                url: options.url,
                dataType: (options.jsonpCallback) ? 'jsonp': 'json',
                success: function(data, status){
                    $(self).find('.jf-spinner').remove();
                    $.each(options.iterator(data), function(idx, item){
                        if(idx<options.num){
                            $(self).append(render(item));
                        }else{
                            return false;
                        }
                    });
                    $(self).each(options.appendCallback);
                }
            }
            if(options.jsonpCallback){
                if(options.jsonpCallback != '?'){
                    ajaxOpts.jsonpCallback = options.jsonpCallback;
                    ajaxOpts.jsonp = options.jsonp;
                }else{
                    var frags = ajaxOpts.url.split('?');
                    if(frags.length > 1){
                        ajaxOpts.url += '&' + options.jsonp + '=' + options.jsonpCallback;
                    }else{
                        ajaxOpts.url += '?' + options.jsonp + '=' + options.jsonpCallback;
                    }
                }
            }
            $(self).append($(options.spinner).addClass('jf-spinner'));
            if(ajaxOpts.url){
                $.ajax(ajaxOpts);
            }else{
                ajaxOpts.success([], 'skipped');
            }

        });
    }
    $.fn.JSONFeed.docsURL = 'http://github.com/dandrinkard/jquery-json-feed/';
    $.fn.JSONFeed.presets = {};
    $.fn.JSONFeed.utils = {};
})(jQuery, window);