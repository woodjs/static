/*!
 * jQuery promptUI plugin
 */

;
(function() {
    "use strict";

    function setup($, tpl) {

        var promptUI = {

            init: function(options) {
                var self = this;

                self.opts = $.extend({}, $.promptUI.defaults, options || {});

                self.buildPromptUI();
                self.buildEl();
                self.initEvents();
                self.setTitle();
                self.setContent();
                self.open();
            },

            buildPromptUI: function() {
                var self = this,
                    type = self.opts.type || 'wran';

                self.$promptUI = $(tpl).filter('[data-itemId=' + type + ']');
            },

            buildEl: function() {
                var self = this,
                    type = self.opts.type;

                self.$close = self.$promptUI.find('[data-itemId=close]');

                if (type === "prompt") {
                    self.$confirm = self.$promptUI.find('[data-itemId=confirm]');
                    self.$cancel = self.$promptUI.find('[data-itemId=cancel]');
                }
                if (type === "ok"){
                	 self.$confirm = self.$promptUI.find('[data-itemId=confirm]');
                }
            },

            initEvents: function() {
                var self = this,
                    type = self.opts.type;

                self.$promptUI.on("keyup", function(event) {
                    if (event.keyCode === 27) {
                        self.close();
                    }
                    event.stopPropagation();
                });

                self.$close.on("click", function() {
                    self.close();
                });

                if (type === "prompt") {
                    self.$confirm.on("click", function() {
                        self.close();
                        if (typeof self.opts.onConfirm === "function") {
                            self.opts.onConfirm.apply(self, []);
                        }
                    });
                    self.$cancel.on("click", function() {
                        self.close();
                    });
                }
                if(type === "ok"){
                	self.$confirm.on("click", function() {
                        self.close();
                        if (typeof self.opts.onConfirm === "function") {
                            self.opts.onConfirm.apply(self, []);
                        }
                    });
                }
            },

            open: function() {
                var self = this,
                    width = 402,
                    type = self.opts.type,
                    height = 156,
                    left = ($(window).width() - width) / 2,
                    top = ($(window).height() - height) / 2,
                    blockUIOpts = {
                        message: self.$promptUI,
                        css: {
                            width: width,
                            height: height,
                            top: top,
                            left: left,
                            cursor: 'default',
                            textAlign: 'left'
                        },
                        focusInput: false
                    };

                if (self.opts.parentUI) {
                    self.opts.parentUI.block(blockUIOpts)
                } else {
                    $.blockUI(blockUIOpts);
                }
                if (self.opts.type === 'success') {
                    self.setAutoClose();
                    self.setLinkHref();
                }
                self.$promptUI.focus();
            },

            setAutoClose: function() {
                var self = this,
                    maxCount = 5,
                    $timer = self.$promptUI.find("[data-itemId=timer]"),
                    $count = self.$promptUI.find("[data-itemId=count]");

                $timer.show();

                if (self.timer) {
                    window.clearInterval(self.timer);
                }
                self.timer = window.setInterval(function() {
                    maxCount--;
                    $count.text(maxCount);
                    if (maxCount < 2) {
                        self.close();
                    }
                }, 1000);
            },

            setLinkHref: function() {
                var self = this,
                    $viewCart = self.$promptUI.find("[data-itemId=view-cart]");

                if(self.opts.viewCartUrl) {
                	$viewCart.show();
                	$viewCart.prop("href", self.opts.viewCartUrl);
                    $viewCart.prop("target", '_blank');
                } else {
                	$viewCart.hide();
                }
            },

            close: function() {
                var self = this;

                if (typeof self.opts.onClose === "function") {
                    self.opts.onClose.apply(self, []);
                }
                if (self.opts.parentUI) {
                    self.opts.parentUI.unblock();
                } else {
                    $.unblockUI();
                }
                if (self.timer) {
                    window.clearInterval(self.timer);
                }
            },

            setTitle: function() {
                var self = this,
                    title = self.opts.title || "提示";

                self.$promptUI.find('[data-itemId=title]').text(title);
            },

            setContent: function() {
                var self = this,
                    content = self.opts.content || "";

                self.$promptUI.find('[data-itemId=content]').text(content);
            }
        };

        $.promptUI = function(options) {
            promptUI.init(options);
        };

        $.promptUI.defaults = {
            type: null,
            title: null,
            content: null,
            autoClose: false,

            // callback
            onClose: null,
            onConfirm: null
        };
    }

    /*global define:true */
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        var basePath = (function() {
            var splittedPath,
                config = require.s.contexts._.config,
                path = config.paths["promptUI"];

            if (typeof path !== "undefined") {
                splittedPath = path.split(/\/+/g);
                return splittedPath.slice(0, splittedPath.length - 2).join("/") + "/";
            } else {
                alert("require config paths 'promptUI' key not exist");
            }
        })();

        define(['jquery', 'text!' + basePath + 'tpl/prompt.htm'], setup);
    } else {
        setup(jQuery);
    }

})();