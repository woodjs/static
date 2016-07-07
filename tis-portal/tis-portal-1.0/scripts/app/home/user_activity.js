define(['globalConfig', 'ajax', 'jquery', 'mustache'], function(globalConfig, ajax, $, Mustache) {

	var UserActivity = function() {

		this.init();
	};

	UserActivity.prototype = {
		init: function() {
			var self = this;

			self.buildEl();
			self.buildTpl();
			self.load();

			window.setInterval(function() {
				self.load();
			}, 1000 * 30); // 半分钟获取一次用户动态
		},

		buildEl: function() {
			var self = this;

			self.$userActivityWrap = $('#user-dynamic-list');
			self.$userActivityTpl = $("#user-dynamic-tpl");
		},

		buildTpl: function() {
			var self = this;

			self.tpl = self.$userActivityTpl.html();
		},

		load: function() {
			var self = this;
			ajax.invoke({
				url: globalConfig.context.userActivityPath,
				type: 'get',
				dataType: 'json',
				success: function(root) {
					self.render(root || {});
				},
				error: function (err) {
					console.log(err);
				}
			});
		},

		render: function(result) {
			var self = this,
				tpl = self.tpl,
				html = Mustache.render(tpl, {
					list: result
				});

			self.$userActivityWrap.html(html);
		}
	};

	return UserActivity;
});