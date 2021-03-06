/**
 * jquery-json-feed
 * ================
 * JSONP -> html with recursive parsing, source polling and pagination
 * Copyright (c) 2011 Dan Drinkard
 * MIT License.
 *
 * Usage:
 * ------
 * -- *HTML* --
 * <div class="my-feed" data-url="myfeed.json"></div>
 *
 * -- *JavaScript* --
 * $('.myfeed).JSONFeed();
 *
 * Class attributes (Set via function options {}):
 * --------------------------------------------
 * `@string url`: The url to fetch, globally settable
 * `@string jsonp`: The name of the callback parameter
 * `@string jsonpCallback`: The value of the callback parameter
 * `@function iterator`: Callback function that returns a list of data objects to render
 * `@int num`: Number of results to render per page
 * `@int poll`: Number of seconds between content refreshes; 0 disables
 * `@function pollUrlGenerator`: Callback function that returns the next url for the poller
 * `                            (handy for setting since_id, etc)
 * `@bool paginate`: Whether or not to show a 'Show more' button
 * `@function paginationUrlGenerator`: Callback function that returns the next url for the paginator
 * `@string spinner`: HTML markup for a spinner element to display while results are loading
 * `@string template`: HTML markup for an individual result item
 * `@regexp jsonVarP`: Pattern to match/capture variable references in the template
 * `@regexp optionP`: Pattern to match/capture option references in the template
 * `@function renderCallback`: Function that returns a modified rendered template
 * `@function appendCallback`: Function called after a page of items are appended to the container
 *
 * Instance attributes (Set via data-\<attr\>):
 * -----------------------------------------
 * `@string url`: Overrides the global url
 * `@int num`: Overrides the number of results to show
 * `@int poll`: Overrides the global poll interval
 * `@bool paginate`: Overrides the global paginate var
 *
 * Instance private attrs (data('_key')):
 * --------------------------------------
 * `@object _poll`:
 *   `lastUrl`
 *   `lastTime`
 *   `interval`
 *   `count`
 *   `page`
 *   `data`
 *
 * `@object _page`:
 *   `lastUrl`
 *   `page`
 *   `data`
 *
 */
(function($, window){
    $.fn.JSONFeed = function(opts){
        var defaults = {
            url: 'http://api.twitter.com/1/statuses/public_timeline.json',
            jsonp: 'callback',
            jsonpCallback: '?',
            iterator: function(data){ return data; },
            num: 5,
            avatar_width: 48,
            avatar_height: 48,
            poll: 0,
            pollUrlGenerator: function(prev_url, prev_response, options){
              return prev_url;
            },
            paginate: false,
            paginationUrlGenerator: function(prev_url, prev_response, options){
              return prev_url;
            },
            spinner: '<span class="jf-loading">Loading...</span>',
            newContentMessage: '<a href="#">Click to show new tweets.</a>',
            paginationButton: '<a href="#">Load more...</a>',
            template: '<p style="color:#a00">You haven&apos;t set a template for this feed!</p>',
            jsonVarP: /\{\{([^\}]+)\}\}/gm,
            optionP: /\{%([^%]+)%\}/gm,
            renderCallback: function(str){return str;},
            appendCallback: function(){}
        }, is_unique, request, render, pageFactory, poll, paginate;
        // confirms uniqueness of generated element for pagination & polling
        is_unique = function(el){
            if($(el).attr('id')){
                return !$('#'+$(el).attr('id')).length;
            }else{
                // always unique if no ids
                return true;
            }
        };
        // gets a resource and fires a success callback
        request = function(url, ctx, options){
            var self = $(ctx),
                action = ((self.attr('class') || '').match(/page-/)!== null ? 'poll': 'page'),
                num = self.parent().attr('data-num') || options.num,
                ajaxOpts = {
                    url: url || options.url,
                    dataType: (options.jsonpCallback) ? 'jsonp': 'json',
                    success: function(data, status){
                        self.find('.jf-spinner').remove();
                        var objs = options.iterator(data);
                        $.each(objs, function(idx, item){
                            // exempt from limit if this is a polling request
                            if(idx<num || action==='poll'){
                                var el = $(render(item, options));
                                if(is_unique(el)){
                                    self.append(el);
                                }
                            }else{
                                return false;
                            }
                        });
                        // handle empty
                        if(!options.paginate && objs.length === 0 && typeof options.empty !== 'undefined'){
                            self.append(options.empty);
                        }
                        // handle buttons & data cache
                        if(action === 'poll'){
                            if(self.children().length && self.is(':hidden')){
                                var showBtn = self.siblings('.jf-show-new');
                                if(showBtn.length){
                                    self.before(showBtn);
                                }else{
                                    self.before(options.newContentMessage).prev().addClass('jf-show-new')
                                        .hide().slideDown();
                                }
                            }
                            var _poll = self.parent().data('_poll');
                            _poll['data'] = data;
                            self.parent().data('_poll', _poll);
                        }else{ // this is pagination or first call
                            if(objs.length === 0){ // last page
                                self.siblings('.jf-show-more').remove();
                            }else{
                                self.siblings('.jf-show-more').removeClass('disabled');
                                var _page = self.parent().data('_page');
                                if(_page){
                                    _page['data'] = data;
                                    self.parent().data('_page', _page);
                                }
                            }
                        }
                        self.each(options.appendCallback);
                    }
                };

            if(options.jsonpCallback){
                if(options.jsonpCallback !== '?'){
                    ajaxOpts.jsonpCallback = options.jsonpCallback;
                    ajaxOpts.jsonp = options.jsonp;
                }else{
                    var frags = ajaxOpts.url.split('?');
                    ajaxOpts.url += ((frags.length > 1) ? '&' : '?') + options.jsonp + '=' + options.jsonpCallback;
                }
            }
            $(self).append($(options.spinner).addClass('jf-spinner'));
            if(ajaxOpts.url){
                $.ajax(ajaxOpts);
            }else{
                ajaxOpts.success([], 'skipped');
            }
        };
        // renders a feed item against the template
        render = function(data, options){
            // data
            var str = options.template.replace(options.jsonVarP, function($0,$1){
                    var keys = $1.split('.'),
                        response = data;
                    $.each(keys, function(idx, key){
                        if(typeof response[key] !== 'undefined'){
                            response = response[key];
                        }else{ response=''; }
                    });
                    return response;
                })
                // options
                .replace(options.optionP, function($0,$1){
                    var keys = $1.split('.'),
                        response = options;
                    $.each(keys, function(idx, key){
                        if(typeof options[key] !== 'undefined'){
                            response = response[key];
                        }else{ response = ''; }
                    });
                    return response;
                });
            return options.renderCallback(str);
        };
        // returns a page div
        pageFactory = function(num){
            return '<div class="jf-page page'+num+'"></div>';
        };
        // generates a request for new content
        poll = function(ctx, options){
            console.log(ctx, options);
            var self = $(ctx),
                locals = self.data('_poll');
            locals.count += 1;
            var page = self.find('.jf-page').eq(0);
            // if the last page isn't empty, create a new one
            // otherwise reuse it
            if(page.children().length > 0){
                locals.page += 1;
                page = self.prepend(pageFactory(locals.page*-1)).find('.page-'+locals.page).eq(0).hide();
            }
            locals.lastUrl = options.pollUrlGenerator(locals.lastUrl, locals['data'], options);
            self.data('_poll', locals);
            request(locals.lastUrl, page, options);
            window.setTimeout(function(){poll(self, options);}, locals.interval*1000);
        };
        // generates a request for old content
        paginate = function(ctx, options){
            var self = $(ctx),
                locals = self.data('_page');
            locals.page += 1;
            var page = self.find('.jf-page').eq(-1).after(pageFactory(locals.page)).next();
            locals.lastUrl = options.paginationUrlGenerator(locals.lastUrl, locals['data'], options);
            self.data('_page', locals);
            request(locals.lastUrl, page, options);
        };
        // plugin constructor/closure
        return $(this).each(function(){
            var self = $(this),
                options = $.extend({}, defaults, opts, {
                    url: self.attr('data-url') || opts.url,
                    poll: self.attr('data-poll') || opts.poll,
                    paginate: self.attr('data-paginate') || opts.paginate
                }),
                page = self.append(pageFactory(0)).find('.page0').eq(0);
            request(options.url, page, options);
            $(this).delegate('a.jf-show-new', 'click', function(e){
                e.preventDefault();
                e.stopPropagation();
                $(this).nextAll('.jf-page').filter(':hidden').show();
                $(this).remove();
            });
            if(options.poll > 0){
                self.data('_poll', {
                    lastUrl: options.url,
                    lastTime: new Date(),
                    interval: options.poll,
                    count: 0,
                    page:0
                });
                window.setTimeout(function(){poll(self, options);}, options.poll*1000);
            }
            if(options.paginate === 'true'){
                self.data('_page', {
                    lastUrl: options.url,
                    page: 0
                });
                self.append($(options.paginationButton).addClass('jf-show-more').click(function(e){
                    e.preventDefault();
                    if(!$(this).hasClass('disabled')){
                        $(this).addClass('disabled');
                        paginate(self, options);
                    }
                }));
            }
        });
    };
    $.fn.JSONFeed.docsURL = 'http://github.com/dandrinkard/jquery-json-feed/';
    $.fn.JSONFeed.presets = $.fn.JSONFeed.presets || {};
    $.fn.JSONFeed.utils = $.fn.JSONFeed.utils || {};
})(jQuery, window);
