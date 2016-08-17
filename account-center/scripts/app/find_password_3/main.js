require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {

  var path = globalConfig.context.path;
  var lang = globalConfig.context.lang;
  var errorIcon = '<i class="icon icon-error"></i>';

  var findPassword = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$inputPassword = $('#password');
      self.$inputRepeatPassword = $('#repeat-password');
      self.$errorPassword = $('#password-error');
      self.$errorRepeatPassword = $('#repeat-password-error');
      self.$passwordGuide = $('#guide-password');
      self.$btnSubmit = $('#submit');
    },

    bindEvent: function () {
      var self = this;

      self.$inputPassword.on('blur', function () {
        self.checkPasswordInput();
      });

      self.$inputRepeatPassword.on('blur', function () {
        self.checkRepeatPasswordInput();
      });

      self.$btnSubmit.on('click', function () {
        self.submit();
      });

    },

    checkPasswordInput: function () {
      var self = this;

      if (self.checkIsEmpty(self.$inputPassword)) {

        self.$errorPassword.html(errorIcon + _i18n_error['4_3_1']);

        return false;
      } else {
        var str = self.$inputPassword.val();

        if (str.length > 20 || str.length < 8) {
          self.$errorPassword.html(errorIcon + _i18n_error['4_3_3']);

          return false;
        } else {
          self.$errorPassword.html('');
        }
      }

      return true;
    },

    checkRepeatPasswordInput: function () {
      var self = this;

      self.checkPasswordInput();

      if (self.checkIsEmpty(self.$inputRepeatPassword)) {

        self.$errorRepeatPassword.html(errorIcon + _i18n_error['4_3_2']);

        return false;
      } else {

        var str = self.$inputRepeatPassword.val();

        if (str.length > 20 || str.length < 8) {
          self.$errorRepeatPassword.html(errorIcon + _i18n_error['4_3_3']);

          return false;
        } else {

          if (self.checkIsSamePassword()) {
            self.$errorRepeatPassword.html('');
          } else {
            self.$errorRepeatPassword.html(errorIcon + _i18n_error['4_3_4']);

            return false;
          }
        }
      }

      return true;
    },

    checkIsSamePassword: function () {
      var self = this;

      if (self.$inputRepeatPassword.val() !== self.$inputPassword.val()) {
        return false;
      }
      return true;
    },

    checkIsEmpty: function ($this) {
      var self = this;

      if (!$this) {
        return true;
      }

      return ($this.val && $this.val() === '') ? true : false;
    },

    checkAllInput: function () {
      var self = this;

      return self.checkPasswordInput() && self.checkRepeatPasswordInput();
    },

    submit: function () {
      var self = this;
      var data = self.collectInputValue();

      if (self.checkAllInput()) {
        ajax.invoke({
          url: path + '/find-pwd/do-reset-pwd',
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(data),
          success: function (res) {
            window.location.href = path + '/find-pwd/success';
          },
          failed: function (res) {
            var code = res.code;

            self.$errorPassword.html(errorIcon + self.$passwordGuide.html());
            self.$errorRepeatPassword.html(errorIcon + self.$passwordGuide.html());

            if ('PASSWORD_NOT_PASS' === code) {
              self.$errorPassword.html(errorIcon + self.$passwordGuide.html());
              self.$errorRepeatPassword.html(errorIcon + self.$passwordGuide.html());
            }
          }
        });
      }
    },

    collectInputValue: function () {
      var self = this;

      return {
        val: self.$inputRepeatPassword.val()
      };
    }
  };

  findPassword.init();
});