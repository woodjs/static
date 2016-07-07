/*!
 * jQuery numbox
 * Version 1.0-2015.6.26
 * @requires jQuery v1.4 or later
 */

(function($) {

	function setup() {

		var numbox = {

			init: function(target) {
				var self = this,
					step, minVal, maxVal;

				self.$numbox = $(target);
				self.opts = $.data(target, "numbox").options;
				self.buildEl();
				self.initEvents();

				step = self.$numbox.attr('data-step') || 0;
				minVal = self.$numbox.attr('data-min') || 0;
				maxVal = self.$numbox.attr('data-max') || 0;

				self.step = parseInt(step) || self.opts.step;
				self.minVal = parseInt(minVal) || self.opts.minVal;
				self.maxVal = parseInt(maxVal) || self.opts.maxVal;
				
				self.controlBtnStatus();
			},

			buildEl: function() {
				var self = this;

				self.$box = self.$numbox.find('.qty-input');
				self.$btnReduce = self.$numbox.find('[data-action=reduce]');
				self.$btnIncrease = self.$numbox.find('[data-action=increase]');
			},

			initEvents: function() {
				var self = this;

				self.$btnReduce.on('click', function() {
					if (!$(this).hasClass('disabled')) {
						self.reduce();
					}
				});

				self.$btnIncrease.on('click', function() {
					if (!$(this).hasClass('disabled')) {
						self.increase();
					}
				});

				self.$box.on('blur', function() {
					var pattern = /^[1-9][\d]*$/,
						val = $(this).val(),
						minVal = self.minVal,
						maxVal = self.maxVal;

					if (!val.match(pattern)) {
						$(this).val(minVal);
					} else {
						if (parseInt(val) < minVal || parseInt(val) > maxVal) {
							$(this).val(minVal);
						}
					}
					self.change();
					self.controlBtnStatus();
				})
			},

			setMinVal: function(minVal) {
				var self = this;

				self.opts.minVal = minVal;
				self.$box.val(minVal);
				self.controlBtnStatus();
			},

			setMaxVal: function(maxVal) {
				var self = this;

				self.opts.maxVal = maxVal;
			},

			getVal: function() {
				var self = this;

				return parseInt(self.$box.val());
			},

			reduce: function() {
				var self = this,
					val = self.getVal() - 1;

				if (self.minVal <= val) {
					self.$box.val(val);
					self.change();
				}
				self.controlBtnStatus();
			},

			increase: function() {
				var self = this,
					val = self.getVal() + 1;

				if (val <= self.maxVal) {
					self.$box.val(val);
					self.change();
				}
				self.controlBtnStatus();
			},

			controlBtnStatus: function() {
				var self = this,
					val = parseInt(self.$box.val());

				if (val > self.minVal) {
					self.$btnReduce.removeClass('disabled');
				} else {
					self.$btnReduce.addClass('disabled');
				}
				if (val < self.maxVal) {
					self.$btnIncrease.removeClass('disabled');
				} else {
					self.$btnIncrease.addClass('disabled');
				}
			},

			change: function() {
				var self = this,
					val = self.getVal();

				if (typeof self.opts.onchange === 'function') {
					self.opts.onchange.apply(self, [val]);
				}
			},

			reset: function() {
				var self = this;

				self.$box.val('');
			}
		};

		$.fn.numbox = function(options, params) {
			var self = this;

			if (typeof options === "string") {
				return $.fn.numbox.methods[options](self, params);
			}

			return self.each(function() {

				$.data(this, 'numbox', {
					options: $.extend({}, $.fn.numbox.defaults, options || {})
				});

				this.numbox = $.extend({}, numbox, {});
				this.numbox.init(this);
			});
		};

		$.fn.numbox.methods = {
			getVal: function(jq) {
				return jq.get(0).numbox.getVal();
			},
			setMinVal: function(jq, val) {
				jq.each(function(){
					this.numbox.setMinVal(val);
				});
			},
			reset: function(jq) {
				jq.each(function() {
					this.numbox.reset();
				});
			}
		};

		$.fn.numbox.defaults = {
			step: 1,
			minVal: 1,
			maxVal: 100,
			onchange: null
		};
	}

	/* Using require js AMD standard */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {

		define([], setup);

	}
})(jQuery)