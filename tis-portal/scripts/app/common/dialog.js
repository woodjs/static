define(['globalConfig', 'jquery', 'mustache', 'domReady!'], function (globalConfig, $, Mustache) {

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
        self.$dialogBg.remove();
        self.$dialogBox.remove();
      });
      self.$btnAction.on('click', function () {
        var $temp = $(this);
        var url = $temp.data('url');
        self.$dialogBg.remove();
        self.$dialogBox.remove();
        window.location.href = url;
      });
      self.$btnCancel.on('click', function () {
        self.$dialogBg.remove();
        self.$dialogBox.remove();
      });
    },
    loginView: {
      title: '登录提醒',
      info: '您还没有登录，请登录后再使用该功能！',
      btnText1: '立刻登录',
      btnText2: '取消',
      text1: '还没有账号请',
      text2: '免费注册',
      actionUrl: globalConfig.context.loginUrl,
      isShow: true
    },
    loginViewEn: {
      title: 'Please login',
      info: 'please login to use this feature',
      btnText1: 'Login',
      btnText2: 'Cancel',
      text1: 'No account please',
      text2: 'Rigister',
      actionUrl: globalConfig.context.loginUrl,
      isShow: true
    },
    buyView: {
      title: '购买提醒',
      info: '该功能为收费功能，请购买后使用！<span>（如果已经购买，请重新登录！）</span>',
      btnText1: '立刻购买',
      btnText2: '取消',
      actionUrl: globalConfig.context.purcharseUrl,
      isShow: false
    },
    buyViewEn: {
      title: 'Friendly reminder',
      info: 'The function is for charging, please buy and use',
      btnText1: 'Buy now',
      btnText2: 'Cancel',
      actionUrl: globalConfig.context.purcharseUrl,
      isShow: false
    },
    show: function (model) {
      var self = dialog;
      if (model === 'login') {
        if (globalConfig.userState.isEnglish) {
          $(document.body).append(Mustache.render(self.htm, self.loginViewEn));
        } else {
          $(document.body).append(Mustache.render(self.htm, self.loginView));
        }
      } else if (model === 'buy') {
        if (globalConfig.userState.isEnglish) {
          $(document.body).append(Mustache.render(self.htm, self.buyViewEn));
        } else {
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