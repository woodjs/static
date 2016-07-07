/*!
 * jQuery form validate
 * Version 1.0-2015.7.18
 * @requires jQuery v1.4 or later
 */

(function($) {

	function setup() {

		var formValidate = {

			init: function(target) {
				var self = this;

				self.$form = $(target);
				self.opts = $.data(target, "formValidate").options;
				self.buildEl();
				self.initEvents();
			},

			buildEl: function() {
				var self = this;

				self.$validateItems = self.$form.find('[data-validate=true]');
			},

			initEvents: function() {
				var self = this;

				self.$validateItems.on({
					focus: function() {
						var $target = $(this);
						$target.removeClass('error');
						self.resetTip($target);
					},
					blur: function() {
						self.validateSingle($(this), 'single');
					}
				});
			},

			validate: function() {
				var self = this,
					i = 0,
					isValid = true;

				self.clearTips();

				self.$validateItems.each(function() {
					var $item = $(this);

					if (!self.validateSingle($item)) {
						isValid = false;
					}
				});

				return isValid;
			},

			validateSingle: function($item, type) {
				var self = this,
					isValid = true,
					val = $item.val(),
					required = $item.data('required'),
					pattern = $item.data('pattern'),
					errorMsg = $item.data('message');

				// 必填验证
				if (required && type !== 'single') {
					if ($.trim(val).length === 0) {
						$item.addClass('error');
						self.showTips($item, 'error', '必填项,不能为空');
						isValid = false;
					}
				}

				// 格式验证
				if (pattern) {
					var reg = new RegExp(pattern);
					if ($.trim(val).length > 0 && !reg.test(val)) {
						$item.addClass('error');
						self.showTips($item, 'error', errorMsg);
						isValid = false;
					}
				}

				return isValid;
			},

			clearTips: function() {
				var self = this;

				self.$validateItems.each(function() {
					self.hideTips($(this));
					$(this).removeClass('error');
				});
			},

			showTips: function($input, type, msg) {
				var self = this,
					$tip = self.getTips($input);

				self.clearTipType($tip);

				$tip.removeClass('hide');
				$tip.addClass(type);
				$tip.find('[class*=text]').text(msg);

				if (type == 'error') {
					$tip.closest('.form-item').find('input').addClass('error');
				}
			},

			hideTips: function($input) {
				var self = this,
					$tip = self.getTips($input);

				self.clearTipType($tip);
				$tip.addClass('hide');
			},

			resetTip: function($input) {
				var self = this,
					$tip = self.getTips($input),
					tipText = $tip.attr('data-defaultText'),
					tipType = $tip.attr('data-defaultType');

				if (tipType && tipText) {
					self.showTips($tip, tipType, tipText);
				} else {
					self.hideTips($tip);
				}

				$tip.closest('.form-item').find('input').removeClass('error');
			},

			clearTipType: function($input) {
				var self = this,
					i = 0,
					$tip = self.getTips($input),
					types = ['ok', 'info', 'error', 'warn'];

				for (; i < types.length; i++) {
					$tip.removeClass(types[i]);
				}

				$tip.closest('.form-item').find('input').removeClass('error');
			},

			getTips: function($input) {
				var self = this;

				return $input.parent().find('.page-tips');
			}
		};

		$.fn.formValidate = function(options, params) {
			var self = this;

			if (typeof options === "string") {
				return $.fn.formValidate.methods[options](self, params);
			}

			return self.each(function() {

				$.data(this, 'formValidate', {
					options: $.extend({}, $.fn.formValidate.defaults, options || {})
				});

				this.formValidate = $.extend({}, formValidate, {});
				this.formValidate.init(this);
			});
		};

		$.fn.formValidate.methods = {
			validate: function(jq) {
				return jq.get(0).formValidate.validate();
			},

			clearTips: function(jq) {
				jq.each(function() {
					this.formValidate.clearTips();
				});
			}
		};
	}

	/* Using require js AMD standard */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {

		define([], setup);

	}
})(jQuery)