require([ 'globalConfig', 'jquery', 'banner', 'mustache' ], function(
		globalConfig, $, banner, Mustache) {

	var home = {
			
		init : function() {
			var self = this;

			self.initComponent();
		},
		
		initComponent : function() {
			var self = this;

			banner.init();
		}
	};

	home.init();
});