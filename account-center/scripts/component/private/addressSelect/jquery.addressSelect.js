/*!
 * jQuery address select
 * Version 1.0-2015.7.11
 * @requires jQuery v1.4 or later
 */
;
(function($) {

	function setup(globalConfig, ajax, Mustache) {

		var addressSelect = {

			init: function(target) {
				var self = this;

				self.$addressSelect = $(target);
				self.opts = $.data(target, 'addressSelect').options;
				self.buildEl();
				self.initEvents();
				self.loadProvince();
			},

			buildEl: function() {
				var self = this;

				self.$province = self.$addressSelect.find('[data-itemId=province]');
				self.$city = self.$addressSelect.find('[data-itemId=city]');
				self.$area = self.$addressSelect.find('[data-itemId=area]');
			},

			initEvents: function() {
				var self = this;

				// 省份改变
				self.$province.on('evtChange', function() {
					var proviceCode = self.getSelectValue(self.$province);

					self.resetCity();
					self.resetArea();
					self.loadCity(proviceCode);
				});

				// 地级市改变
				self.$city.on('evtChange', function() {
					var cityCode = self.getSelectValue(self.$city);

					self.resetArea();
					self.loadArea(cityCode);
				});
			},

			loadProvince: function() {
				var self = this;

				ajax.invoke({
					url: self.opts.loadProvinceUrl,
					success: function(root) {
						self.province = root.result || [];
						self.buildSelectOption(self.$province, self.province);

						if (typeof self.opts.onLoadProvinceFinish === 'function') {
							self.opts.onLoadProvinceFinish.apply(self, []);
						}
					}
				});
			},

			loadCity: function(provinceCode, callback) {
				var self = this;

				return ajax.invoke({
					url: self.opts.loadCityUrl.replace('{provinceCode}', provinceCode),
					success: function(root) {
						self.city = root.result || [];
						self.buildSelectOption(self.$city, self.city);
					}
				});
			},

			loadArea: function(areaCode, callback) {
				var self = this;

				return ajax.invoke({
					url: self.opts.loadAreaUrl.replace('{cityCode}', areaCode),
					success: function(root) {
						self.area = root.result || [];
						self.buildSelectOption(self.$area, self.area);
					}
				});
			},

			buildSelectOption: function($target, result) {
				var self = this,
					tpl = '{{#records}}' +
					'<li class="form-select-option" data-value="{{code}}" title="{{name}}">{{name}}</li>{{/records}}',
					html = Mustache.render(tpl, {
						records: result
					});

				$target.find("ul").html(html)
			},

			resetAll: function() {
				var self = this;

				self.resetProvince();
				self.resetCity();
				self.resetArea();
			},

			resetProvince: function() {
				var self = this;

				self.setSelectValue(self.$province, '');
				self.setSelectText(self.$province, '请选择');
				self.clearOptions(self.$province);
			},

			resetCity: function() {
				var self = this;

				self.setSelectValue(self.$city, '');
				self.setSelectText(self.$city, '请选择');
				self.clearOptions(self.$city);
			},

			resetArea: function() {
				var self = this;

				self.setSelectValue(self.$area, '');
				self.setSelectText(self.$area, '请选择');
				self.clearOptions(self.$area);
			},

			getText: function(type, code) {
				var self = this,
					i = 0,
					list = self[type] || [];

				for (; i < list.length; i++) {
					if (list[i].code === code) {
						return list[i].name;
					}
				}

				return '';
			},

			getSelectValue: function($target) {
				var self = this;

				return $target.find("input").val();
			},

			setSelectValue: function($target, code) {
				var self = this;

				$target.find('input').val(code);
			},

			setSelectText: function($target, text) {
				var self = this;

				$target.find('.form-select-text').text(text).attr('title', text);
			},

			clearOptions: function($target) {
				var self = this;

				$target.find('ul').html('');
			},

			setAddressValue: function(params) {
				var self = this,
					provinceText = self.getText('province', params.provinceCode);

				// 设置省默认值
				self.setSelectValue(self.$province, params.provinceCode);
				self.setSelectText(self.$province, provinceText);

				// 加载地级市
				self.loadCity(params.provinceCode)
					.then(function() {
						var cityText = self.getText('city', params.cityCode);
						self.setSelectValue(self.$city, params.cityCode);
						self.setSelectText(self.$city, cityText);
						return self.loadArea(params.cityCode)
					}).done(function() {
						var areaText = self.getText('area', params.areaCode);
						self.setSelectValue(self.$area, params.areaCode);
						self.setSelectText(self.$area, areaText);
					});
			},

			getAddressValue: function() {
				var self = this,
					provinceCode = self.getSelectValue(self.$province),
					cityCode = self.getSelectValue(self.$city),
					areaCode = self.getSelectValue(self.$area);

				return {
					provinceCode: provinceCode,
					cityCode: cityCode,
					areaCode: areaCode
				};
			},

			addError: function(type) {
				var self = this;

				switch (type) {
					case 'province':
						self.$province.addClass("error");
						break;
					case 'city':
						self.$city.addClass('error');
						break;
					case 'area':
						self.$area.addClass("error");
						break;
					default:
						break;
				}

			}
		};

		$.fn.addressSelect = function(options, params) {
			var jqEls = this;

			if (typeof options === "string") {
				return $.fn.addressSelect.methods[options](jqEls, params);
			}

			return jqEls.each(function() {

				$.data(this, 'addressSelect', {
					options: $.extend({}, $.fn.addressSelect.defaults, options || {})
				});

				this.addressSelect = $.extend({}, addressSelect, {});
				this.addressSelect.init(this);
			});
		};

		$.fn.addressSelect.methods = {

			resetAll: function(jqEls) {
				jqEls.each(function() {
					this.addressSelect.resetAll();
				});
			},

			loadProvince: function(jqEls) {
				jqEls.each(function() {
					this.addressSelect.loadProvince();
				});
			},

			setAddressValue: function(jqEls, params) {
				jqEls.each(function() {
					this.addressSelect.setAddressValue(params);
				});
			},

			getAddressValue: function(jqEls) {
				return jqEls.get(0).addressSelect.getAddressValue();
			},

			addError: function(jqEls, params) {
				jqEls.each(function() {
					this.addressSelect.addError(params);
				});
			}
		};

		var path = globalConfig.context.path;

		$.fn.addressSelect.defaults = {
			// config
			loadProvinceUrl: path + "/base-data/country/province",
			loadCityUrl: path + '/base-data/country/province/{provinceCode}/city',
			loadAreaUrl: path + '/base-data/country/province/city/{cityCode}/area',

			// callback
			onchange: null,
			onLoadProvinceFinish: null
		};
	}

	/* Using require js AMD standard */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {

		define(['globalConfig', 'ajax', 'mustache'], setup);
	}
})(jQuery)