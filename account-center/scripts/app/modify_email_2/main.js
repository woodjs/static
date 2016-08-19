require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {

  var path = globalConfig.context.path;
  var lang = globalConfig.context.lang;
  var errorIcon = '<i class="icon icon-error"></i>';
  var emailRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

  var modifyEmail = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
      self.originalEmailTime = self.$labelEmailTime.html();
    },

    buildElement: function () {
      var self = this;

      self.$originalEmail = $('#original-email');
      self.$inputNewEmail = $('#new-email');
      self.$inputEmailAuthCode = $('#email-auth-code');
      self.$errorNewEmail = $('#new-email-error');
      self.$errorEmail = $('#email-error');
      self.$btnFetchEmailCode = $('#fetch-email-auth-code');
      self.$btnFetchingEmailCode = $('#fetching-email-auth-code');
      self.$labelEmailTime = $('#fetching-email-auth-code label');
      self.$emailGuide = $('#email-guide');
      self.$btnSubmit = $('#submit');
    },

    bindEvent: function () {
      var self = this;

      self.$btnFetchEmailCode.on('click', function () {
        if (!self.checkNewEmailInput()) {
          return false;
        }
        self.$btnFetchEmailCode.hide();
        self.$btnFetchingEmailCode.show();

        if (lang === 'zh_CN') {
          self.$emailGuide.html(_i18n_error['4_2_3'].replace('5分钟', '<span class="red">5分钟</span>'));
        } else {
          self.$emailGuide.html(_i18n_error['4_2_3']);
        }
        self.sendEmailRequest();
        self.beginEmailTimer();
      });


      self.$inputNewEmail.on('blur', function () {
        self.checkNewEmailInput();
      });

      self.$inputEmailAuthCode.on('blur', function () {
        self.checkEmailAuthCodeInput();
      });

      self.$btnSubmit.on('click', function () {
        self.submit();
      });

    },

    checkNewEmailInput: function () {
      var self = this;

      if (self.checkIsEmpty(self.$inputNewEmail)) {

        self.$errorNewEmail.html(errorIcon + _i18n_error['2_2_2']);

        return false;
      } else {
        var str = self.$inputNewEmail.val();

        if (emailRegex.test(str)) {
          self.$errorNewEmail.html('');

        } else {

          self.$errorNewEmail.html(errorIcon + _i18n_error['2_2_3']);

          return false;
        }
      }

      return true;
    },

    checkEmailAuthCodeInput: function () {
      var self = this;

      if (!self.checkNewEmailInput()) {
        return false;
      }
      if (self.checkIsEmpty(self.$inputEmailAuthCode)) {

        self.$errorEmail.html(errorIcon + _i18n_error['4_1_2']);

        return false;
      } else {
        self.$errorEmail.html('');
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

    checkIsSameEmail: function () {
      var self = this;

      if (self.$inputNewEmail.val() !== $.trim(self.$originalEmail.html())) {

        return false;
      }
      return true;
    },


    checkAllInput: function () {
      var self = this;

      return self.checkEmailAuthCodeInput();
    },

    beginEmailTimer: function () {
      var self = this;

      self.emailInter = setInterval(function () {
        var time = parseInt(self.$labelEmailTime.html());

        if (time > 0) {
          time--;
          self.$labelEmailTime.html(time);
          return;
        }

        self.$labelEmailTime.html(time);
        self.resetEmailTimer();
      }, 1000);

    },

    resetEmailTimer: function () {
      var self = this;

      self.$btnFetchEmailCode.show();
      self.$btnFetchingEmailCode.hide();
      self.$labelEmailTime.html(self.originalEmailTime);
      self.$emailGuide.html('');

      clearInterval(self.emailInter);
    },

    sendEmailRequest: function () {
      var self = this;

      ajax.invoke({
        url: path + '/user/email/send-auth-code',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
          val: self.$inputNewEmail.val()
        }),
        success: function (res) {
        },
        failed: function (res) {
          var code = res.code;

          if ('EMAIL_HAS_BIND_TO_OTHER_USER' === code) {
            self.$errorNewEmail.html(errorIcon + _i18n_error['2_2_1']);
          } else if ('SEND_AUTH_CODE_ERROR' === code) {
            self.$errorEmail.html(errorIcon + _i18n_error['4_2_5']);
          }
        }
      });
    },

    submit: function () {
      var self = this;
      var data = self.collectInputValue();

      if (self.checkAllInput()) {
        ajax.invoke({
          url: path + '/user/email/do-update',
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(data),
          success: function (res) {
            window.location.href = path + '/user/email/success';
          },
          failed: function (res) {
            var code = res.code;

            if ('AUTH_CODE_ERROR' === code) {
              self.$errorEmail.html(errorIcon + _i18n_error['4_2_1']);
            } else if ('SEND_ONLY_ONCE_IN_A_INTERVAL'  === code) {
              self.$errorEmail.html(errorIcon + _i18n_error['4_2_6']);
            } else if ('VAL_SAME_ERROR' === code) {
              self.$errorEmail.html(errorIcon + _i18n_error['2_2_4']);
            }
          }
        });
      }
    },

    collectInputValue: function () {
      var self = this;

      return {
        email: self.$inputNewEmail.val(),
        authCode: self.$inputEmailAuthCode.val()
      };
    }
  };

  modifyEmail.init();
});