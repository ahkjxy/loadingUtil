/**
 * Created on 2016/3/24.
 * By ahkjxy
 */
;(function (root, factory) {
    if (typeof module == 'object' && module.exports) {
        module.exports = factory(); // CommonJS
    }
    else if (typeof define == 'function' && define.amd) {
        define(factory); // AMD module
    } else {
        root.Loading = factory(); // Browser global
    }
}
(this, function () {

    'use strict';

    /**
     * some uitl for the factory
     */
    var util = {
        /**
         * Fills in default values.
         */
        merge: function(obj) {
            for (var i = 1; i < arguments.length; i++) {
                var def = arguments[i];
                for (var n in def) {
                    if (obj[n] === undefined) obj[n] = def[n];
                }
            }
            return obj;
        }
    }

    // Built-in defaults
    var defaults = {
        image: 'img/01.gif',    // Loading image src
        width: 30,      // Loading image width
        height: 30,      // Loading image height
        zIndex: 1e3,          // Use a high z-index by default
        wrapClass: 'loadingWrap', // CSS class to assign to the loading wrap
        mask: true,           // Opacity of the mask
        maskClass: 'loadingMask', //  CSS class to assign to the mask
        bgOpacity: .6         // Opacity of the mask
    };

    /** The constructor */
    function Loading(o) {
        this.settings = util.merge(o || {}, Loading.defaults, defaults);
    }

    // Global defaults that override the built-ins:
    Loading.defaults = {};

    util.merge(Loading.prototype, {
        /**
         * Render loading templates to Dom
         */
        render: function () {
            this._renderMask();
            this._renderImg();
        },
        show: function() {
            if (this.isLoading) return;
            var self = this;
            var opts = self.settings;
            this.render();
            this._setDisableScroll();
            this.isLoading = true;
        },
        hide: function() {
            this._distroy();
            this._setEnableScroll();
        },
        _renderImg: function() {
            var self = this;
            var opts = self.settings;
            var img = $('<img />').attr({'src': opts.image}).css({
                width: opts.width,
                height: opts.height
            });
            $(document.body).append(
                $('<div />')
                    .attr('class', opts.wrapClass)
                    .css({
                        'z-index': opts.zIndex,
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        'margin-left': '-40px',
                        'margin-top': '-25px',
                        padding: '8px 25px',
                        'background-color': 'rgba(0, 0, 0, .6)',
                        'border-radius': '5px'
                    })
                );
            $(img).appendTo($('.' + opts.wrapClass));
        },
        _renderMask: function() {
            var self = this;
            var opts = self.settings;
            if(opts.mask) {
                var MASK = '<div class="' + opts.maskClass + '">';
                $(document.body).append(MASK);
                $('.' + opts.maskClass).css({
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#000',
                    zIndex: opts.zIndex - 1,
                    opacity: opts.bgOpacity
                })
            }
        },
        _setDisableScroll: function() {
            var html = $('html');
            html.css('overflow-y', 'hidden');
            document.ontouchmove = function(e) {
                e.preventDefault();
            };
        },
        _setEnableScroll: function() {
            var html = $('html');
            html.css('overflow-y', 'auto');
            document.ontouchmove = function(e) {
                return true;
            };
        },
        _distroy: function() {
            var self = this;
            var opts = self.settings;
            if(opts.mask) {
                $('.' + opts.maskClass).remove();
            }
            $('.' + opts.wrapClass).remove();
            this.isLoading = false;
        }
    });
    return Loading;
    exports.Loading = Loading;
    exports.version = '0.0.1';
}));
