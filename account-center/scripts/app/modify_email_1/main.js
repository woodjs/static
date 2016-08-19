require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {

  var path = globalConfig.context.path;
  var lang = globalConfig.context.lang;
  var errorIcon = '<i class="icon icon-error"></i>';

  var modifyEmail = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$inputOriginalPassword = $('#original-password');
      self.$errorOriginalPassword = $('#original-password-error');
      self.$btnSubmit = $('#submit');
    },

    bindEvent: function () {
      var self = this;

      self.$inputOriginalPassword.on('blur', function () {
        self.checkOriginalPasswordInput();
      });

      self.$btnSubmit.on('click', function () {
        self.submit();
      });

    },

    checkOriginalPasswordInput: function () {
      var self = this;

      if (self.checkIsEmpty(self.$inputOriginalPassword)) {

        self.$errorOriginalPassword.html(errorIcon + _i18n_error['2_1_1']);

        return false;
      } else {
        self.$errorOriginalPassword.html('');
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

      return self.checkOriginalPasswordInput();
    },

    submit: function () {
      var self = this;
      var data = self.collectInputValue();

      if (self.checkAllInput()) {
        ajax.invoke({
          url: path + '/user/validate/pwd',
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(data),
          success: function (res) {
            window.location.href = path + '/user/email/modify';
          },
          failed: function (res) {
            var code = res.code;

            if ('OLD_PWD_ERROR' === code) {
              self.$errorOriginalPassword.html(errorIcon + _i18n_error['1_1_3']);
            }
          }
        });
      }
    },

    collectInputValue: function () {
      var self = this;

      return {
        val: self.$inputOriginalPassword.val()
      };
    }
  };

  modifyEmail.init();
});