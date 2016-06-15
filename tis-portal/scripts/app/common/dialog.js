define(['globalConfig', 'jquery', 'mustache'], function (globalConfig, $, Mustache) {
	var notAllowBuyList = ['sgmw'];
	
    var dialog = {
        init: function () {
            var self = this;
            self.buildElement();
            self.bindEvent();
        },
        buildElement: function () {
            var self = this;
            self.$dialogBg = $('#dialog-bg');
            self.$dialogBox = $('#dialog-box');
            self.$btnClose = $('#dialog-btn-close');
            self.$btnAction = $('#dialog-btn-action');
            self.$btnCancel = $('#dialog-btn-cancel');
        },
        buildTemplate: function () {
            var self = this;
            self.htm = $('#dialog-template').html();
        },
        bindEvent: function () {
            var self = this;
            self.$btnClose.on('click', function () {
            	if (self.isAutoJump) {
            		clearInterval(self.interId);
            	}
                self.$dialogBg.remove();
                self.$dialogBox.remove();
            });
            self.$btnAction.on('click', function () {
                var $temp = $(this);
                var url = $temp.data('url');
                
                if (url.indexOf('login') > -1 || !self.isNotAllowBuy(globalConfig.context.oemCode)) {
                    self.$dialogBg.remove();
                    self.$dialogBox.remove();
                    window.location.href = url;
                }
            });
            self.$btnCancel.on('click', function () {
                self.$dialogBg.remove();
                self.$dialogBox.remove();
            });
            if (self.isAutoJump) {
            	self.$autoJumpLine = $('#dialog-jump-line');
            	self.$autoTimeBox = $('#dialog-auto-time');
            	self.$autoLink = $('#dialog-auto-link');
            	if (self.$autoJumpLine.length) {
                	self.interId = setInterval(function () {
                		var curVal = parseInt(self.$autoTimeBox.html());
                		if (curVal > 1) {
                			self.$autoTimeBox.html(curVal - 1);
                		} else {
                			window.location.href = self.$autoTimeBox.data('href');
                			//window.open(self.$autoTimeBox.data('href'));
                			//clearInterval(self.interId);
                            //self.$dialogBg.remove();
                            //self.$dialogBox.remove();
                		}            		            		
                	}, 1000);
                	self.$autoLink.on('click', function () {
            			window.open(self.$autoTimeBox.data('href'));
            			clearInterval(self.interId);
                        self.$dialogBg.remove();
                        self.$dialogBox.remove();
                	});
            	}
            }
        },
        isNotAllowBuy: function (code) {
        	for (var i = 0; i < notAllowBuyList.length; i++) {
        		if (notAllowBuyList[i] === code) {
        			return true;
        		}
        	}
        	
        	return false;
        },
        loginView: {
            title: '登录提醒',
            info: '您还没有登录，请登录后再使用该功能！',
            btnText1: '立刻登录',
            btnText2: '取消',
            text1: '还没有账号请',
            text2: '免费注册',
            actionUrl: globalConfig.context.loginUrl,
            isShow: true,
            isNotAuto: true
        },
        loginViewEn: {
            title: 'Please login',
            info: 'please login to use this feature',
            btnText1: 'Login',
            btnText2: 'Cancel',
            text1: 'No account please',
            text2: 'Rigister',
            actionUrl: globalConfig.context.loginUrl,
            isShow: true,
            isNotAuto: true
        },
        buyView: {
            title: '购买提醒',
            info: '该功能为收费功能，请购买后使用！<span>（如果已经购买，请重新登录！）</span>',
            btnText1: '立刻购买',
            btnText2: '取消',
            actionUrl: globalConfig.context.purcharseUrl,
            isShow: false,
            isNotAuto: true
        },
        buyViewEn: {
            title: 'Friendly reminder',
            info: 'The function is for charging, please buy and use',
            btnText1: 'Buy now',
            btnText2: 'Cancel',
            actionUrl: globalConfig.context.purcharseUrl,
            isShow: false,
            isNotAuto: true
        },
        show: function (model, $element) {
            var self = dialog;            
            self.isAutoJump = false;
            self.autoJumpList = ['sgmw'];
            for (var i = 0; i < self.autoJumpList.length; i++) {
            	if (globalConfig.context.oemCode === self.autoJumpList[i]) {
            		self.isAutoJump = true;
            	}            	
            }            
            if (model === 'login') {
                if (globalConfig.userState.isEnglish) {
                    $(document.body).append(Mustache.render(self.htm, self.loginViewEn));
                } else {
                    $(document.body).append(Mustache.render(self.htm, self.loginView));
                }
            } else if (model === 'buy') {
            	if (self.isAutoJump) {
            		self.buyViewEn.isNotAuto = false;
            		self.buyView.isNotAuto = false;
            	}
                if (globalConfig.userState.isEnglish) {
//                	if ($element && $element.is('.diagnostic-upgrade')) {
//                		
//                	}
                    $(document.body).append(Mustache.render(self.htm, self.buyViewEn));
                } else {
                	if ($element && $element.is('.diagnostic-upgrade')) {
                		self.buyView.info = '您还未购买诊断工具升级程序下载服务，请先购买！';
                	} else {
                		self.buyView.info = '该功能为收费功能，请购买后使用！<span>（如果已经购买，请重新登录！）</span>';
                	}
                    $(document.body).append(Mustache.render(self.htm, self.buyView));
                }
            }
            self.init();
        }
    };

    dialog.buildTemplate();

    return {
        show: dialog.show
    };
});