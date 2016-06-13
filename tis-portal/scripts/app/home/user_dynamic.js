define(['globalConfig', 'ajax', 'jquery', 'mustache'], function(globalConfig, ajax, $, Mustache) {

	var UserDynamic = function() {

		this.init();
	};

	UserDynamic.prototype = {
		init: function() {
			var self = this;

			self.buildEl();
			self.buildTpl();
			self.load();

			window.setInterval(function() {
				self.load();
			}, 1000 * 60 * 30); // 半小时获取一次用户动态
		},

		buildEl: function() {
			var self = this;

			self.$userDynamicWrap = $('#user-dynamic-list');
			self.$userDynamicTpl = $("#user-dynamic-tpl");
		},

		buildTpl: function() {
			var self = this;

			self.tpl = self.$userDynamicTpl.html();
		},

		load: function() {
			var self = this;
			//ajax.invoke({
			//	url: globalConfig.context.path + '',
			//	cache: false,
			//	success: function(root) {
			//		self.render(root.result || {});
			//	}
			//});
		},

		render: function(result) {
			var self = this,
				tpl = self.tpl,
				html = Mustache.render(tpl, {
					list: result
				});

			self.$userDynamicWrap.html(html);
		}
	};

	return UserDynamic;
});