require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {

  var path = globalConfig.context.path;
  var errorIcon = '<i class="iconfont icon-error"></i>';

  var login = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$inputUsername = $('#username');
      self.$inputPassword = $('#password');
      self.$errorUsername = $('#username-error');
      self.$errorPassoword = $('#password-error');

      self.$btnLogin = $('#login');
    },

    bindEvent: function () {
      var self = this;

      self.$inputUsername.on('blur', function () {
        self.checkUsernameInput();
      });

      self.$inputPassword.on('blur', function () {
        self.checkPasswordInput();
      });

      self.$btnLogin.on('click', function () {
        self.login();
      });

      $('input').on('keypress', function(e) {
        if (e.keyCode === 13) {
          self.$btnLogin.click();
          $(this).blur();
          e.preventDefault();
        }
      });
    },

    checkUsernameInput: function () {
      var self = this;

      if (self.checkIsEmpty(self.$inputUsername)) {

        self.$inputUsername.addClass('error');
        self.$errorUsername.html(errorIcon + _i18n['login_1']);
        self.$inputUsername.focus();

        return false;
      } else {
        self.$inputUsername.removeClass('error');
        self.$errorUsername.html('');
      }

      return true;
    },

    checkPasswordInput: function () {
      var self = this;

      if (!self.checkUsernameInput()) {
        return false;
      }

      if (self.checkIsEmpty(self.$inputPassword)) {
        self.$inputPassword.addClass('error');
        self.$errorPassoword.html(errorIcon + _i18n['login_2']);
        self.$inputPassword.focus();

        return false;
      } else {
        self.$inputPassword.removeClass('error');
        self.$errorPassoword.html('');
      }

      return true;
    },

    checkIsEmpty: function ($this) {
      var self = this;

      if (!$this) {
        return true;
      }

      return ($this.val && $.trim($this.val()) === '') ? true : false;
    },

    checkAllInput: function () {
      var self = this;

      return self.checkPasswordInput();
    },

    login: function () {
      var self = this;
      var data = self.collectInputValue();

      if (self.$btnLogin.is('.disable')) {
        return;
      }

      if (self.checkAllInput()) {

        self.$btnLogin.addClass('disable');
        self.$btnLogin.html(_i18n.login_5);

        setTimeout(function () {
          ajax.invoke({
            url: path + '/find-pwd/do-input-key',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (res) {
              window.location.href = path + '/index';
            },
            failed: function (res) {

              self.$btnLogin.removeClass('disable');
              self.$btnLogin.html(_i18n.login_4);
              self.$inputUsername.addClass('error');
              self.$errorUsername.html(errorIcon + _i18n['login_3']);
              self.$inputUsername.focus();
            }
          });
        }, 2000);
      }
    },

    collectInputValue: function () {
      var self = this;

      return {
        username: $.trim(self.$inputUsername.val()),
        password: $.trim(self.$inputPassword.val())
      };
    }
  };

  login.init();
});