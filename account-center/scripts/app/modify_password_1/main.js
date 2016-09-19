require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {

  var path = globalConfig.context.path;
  var lang = globalConfig.context.lang;
  var errorIcon = '<i class="icon icon-error"></i>';

  var modifyPassword = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$inputOriginalPassword = $('#original-password');
      self.$inputPassword = $('#password');
      self.$inputRepeatPassword = $('#repeat-password');
      self.$errorOriginalPassword = $('#original-password-error');
      self.$errorPassword = $('#password-error');
      self.$errorRepeatPassword = $('#repeat-password-error');
      self.$passwordGuide = $('#guide-password');
      self.$btnSubmit = $('#submit');
    },

    bindEvent: function () {
      var self = this;

      self.$inputOriginalPassword.on('blur', function () {
        self.checkOriginalPasswordInput();
      });

      self.$inputPassword.on('blur', function () {
        self.checkPasswordInput();
      });

      self.$inputRepeatPassword.on('blur', function () {
        self.checkRepeatPasswordInput();
      });

      self.$btnSubmit.on('click', function () {
        self.submit();
      });

      $('input').on('keypress', function (e) {
        if (e.keyCode === 13) {
          self.$btnSubmit.click();
          $(this).blur();
          e.preventDefault();
        }
      });
    },

    checkOriginalPasswordInput: function () {
      var self = this;

      if (self.checkIsEmpty(self.$inputOriginalPassword)) {

        self.$errorOriginalPassword.html(errorIcon + _i18n_error['1_1_1']);

        return false;
      } else {
        self.$errorOriginalPassword.html('');
      }

      return true;
    },

    checkPasswordInput: function () {
      var self = this;

      if (!self.checkOriginalPasswordInput()) {
        return false;
      }
      if (self.checkIsEmpty(self.$inputPassword)) {

        self.$errorPassword.html(errorIcon + _i18n_error['4_3_1']);

        return false;
      } else {
        var str = self.$inputPassword.val();

        if (str.length > 20 || str.length < 8) {
          self.$errorPassword.html(errorIcon + _i18n_error['4_3_3']);

          return false;
        } else {
          if (self.$inputOriginalPassword.val() === self.$inputPassword.val()) {
            self.$errorPassword.html(errorIcon + _i18n_error['1_1_4']);

            return false;
          } else {
            self.$errorPassword.html('');
          }
        }
      }

      return true;
    },

    checkRepeatPasswordInput: function () {
      var self = this;

      if (!self.checkPasswordInput()) {
        return false;
      }

      if (self.checkIsEmpty(self.$inputRepeatPassword)) {

        self.$errorRepeatPassword.html(errorIcon + _i18n_error['1_1_2']);

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

      return self.checkRepeatPasswordInput();
    },

    submit: function () {
      var self = this;
      var data = self.collectInputValue();

      if (self.checkAllInput()) {
        ajax.invoke({
          url: path + '/user/pwd/do-update',
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(data),
          success: function (res) {
            window.location.href = path + '/user/pwd/success';
          },
          failed: function (res) {
            var code = res.code;

            if ('OLD_PWD_ERROR' === code) {
              self.$errorOriginalPassword.html(errorIcon + _i18n_error['1_1_3']);
            } else if ('PASSWORD_NOT_PASS' === code) {
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
        oldPwd: self.$inputOriginalPassword.val(),
        newPwd: self.$inputRepeatPassword.val()
      };
    }
  };

  modifyPassword.init();
});