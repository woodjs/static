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

      self.$boxVerifyType = $('#verify-type-box');
      self.$boxMobile = $('#mobile-box');
      self.$boxEmail = $('#email-box');
      self.$boxMobileIdentify = $('#mobile-identify-box');
      self.$boxEmailIdentify = $('#email-identify-box');
      self.$listType = $('#verify-type-list');
      self.$listTypeItems = $('#verify-type-list a');
      self.$curVerifyType = $('#cur-verify-type');
      self.$inputMobileAuthCode = $('#mobile-auth-code');
      self.$inputEmailAuthCode = $('#email-auth-code');
      self.$errorMobile = $('#mobile-error');
      self.$errorEmail = $('#email-error');
      self.$btnFetchMobileCode = $('#fetch-mobile-auth-code');
      self.$btnFetchingMobileCode = $('#fetching-mobile-auth-code');
      self.$btnFetchEmailCode = $('#fetch-email-auth-code');
      self.$btnFetchingEmailCode = $('#fetching-email-auth-code');
      self.$labelMobileTime = $('#fetching-mobile-auth-code label');
      self.$labelEmailTime = $('#fetching-email-auth-code label');
      self.$mobileGuide = $('#mobile-guide');
      self.$emailGuide = $('#email-guide');
      self.$btnSubmit = $('#submit');
    },

    bindEvent: function () {
      var self = this;

      self.$boxVerifyType.on('click', function () {

        if (self.$listType.is(":visible")) {
          self.$listType.hide();
        } else {
          self.$listType.show();
        }
      });

      self.$listTypeItems.on('click', function () {
        var $this = $(this);
        var value = $this.data('value');
        var text = $this.html();

        self.$curVerifyType.data('value', value);
        self.$curVerifyType.html(text);

        if (value === 'mobile') {
          self.$boxMobile.show();
          self.$boxEmail.hide();
          self.$boxMobileIdentify.show();
          self.$boxEmailIdentify.hide();
        } else {
          self.$boxMobile.hide();
          self.$boxEmail.show();
          self.$boxMobileIdentify.hide();
          self.$boxEmailIdentify.show();
        }
      });

      self.$btnFetchMobileCode.on('click', function () {
        self.$btnFetchMobileCode.hide();
        self.$btnFetchingMobileCode.show();

        if (lang === 'zh_CN') {
          self.$mobileGuide.html(_i18n_error['4_2_2'].replace('60', '<span class="red">60</span>'));
        } else {
          self.$mobileGuide.html(_i18n_error['4_2_2']);
        }
        self.sendMobileRequest();
        self.beginMobileTimer();
      });

      self.$btnFetchEmailCode.on('click', function () {
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

      self.$inputMobileAuthCode.on('blur', function () {
        self.checkMobileAuthCodeInput();
      });

      self.$inputEmailAuthCode.on('blur', function () {
        self.checkEmailAuthCodeInput();
      });

      self.$btnSubmit.on('click', function () {
        self.submit();
      });

    },

    checkMobileAuthCodeInput: function () {
      var self = this;

      if (self.checkIsEmpty(self.$inputMobileAuthCode)) {

        self.$errorMobile.html(errorIcon + _i18n_error['4_1_2']);

        return false;
      } else {
        self.$errorMobile.html('');
      }

      return true;
    },

    checkEmailAuthCodeInput: function () {
      var self = this;

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

    checkAllInput: function () {
      var self = this;
      var value = self.$curVerifyType.data('value');

      if (value === 'mobile') {
        return self.checkMobileAuthCodeInput()
      } else {
        return self.checkEmailAuthCodeInput();
      }
    },

    beginMobileTimer: function () {
      var self = this;

      self.mobileInter = setInterval(function () {
        var time = parseInt(self.$labelMobileTime.html());

        if (time > 0) {
          time--;
          self.$labelMobileTime.html(time);
          return;
        }

        self.$labelMobileTime.html(time);
        self.resetMobileTimer();
      }, 1000);
    },

    resetMobileTimer: function () {
      var self = this;

      self.$btnFetchMobileCode.show();
      self.$btnFetchingMobileCode.hide();
      self.$labelMobileTime.html('60');
      clearInterval(self.mobileInter);
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
      self.$labelEmailTime.html('60');

      clearInterval(self.emailInter);
    },

    sendMobileRequest: function () {
      var self = this;

      ajax.invoke({
        url: path + '/find-pwd/send-mobile-auth-code',
        type: 'POST',
        dataType: 'json',
        data: null,
        success: function (res) {
        },
        failed: function (res) {
          var code = res.code;

          if ('UN_AUTH' === code) {
            self.$errorMobile.html(errorIcon + _i18n_error['4_2_4']);
          } else if ('SEND_AUTH_CODE_ERROR' === code) {
            self.$errorMobile.html(errorIcon + _i18n_error['4_2_5']);
          }

        }
      });
    },

    sendEmailRequest: function () {
      var self = this;

      ajax.invoke({
        url: path + '/find-pwd/send-email-auth-code',
        type: 'POST',
        dataType: 'json',
        data: null,
        success: function (res) {
        },
        failed: function (res) {
          var code = res.code;

          if ('UN_AUTH' === code) {
            self.$errorEmail.html(errorIcon + _i18n_error['4_2_4']);
          } else if ('SEND_AUTH_CODE_ERROR' === code) {
            self.$errorEmail.html(errorIcon + _i18n_error['4_2_5']);
          }
        }
      });
    },

    submit: function () {
      var self = this;
      var data = self.collectInputValue();
      var value = self.$curVerifyType.data('value');
      var partUrl = (value === 'mobile' ? '/find-pwd/do-check-mobile-auth-code' : '/find-pwd/do-check-email-auth-code');

      if (self.checkAllInput()) {
        ajax.invoke({
          url: path + partUrl,
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(data),
          success: function (res) {
            window.location.href = path + '/find-pwd/reset-pwd';
          },
          failed: function (res) {
            var code = res.code;
            if ('AUTH_CODE_ERROR' === code) {
              value === 'mobile' ? self.$errorMobile.html(errorIcon + _i18n_error['4_2_1']) : self.$errorEmail.html(errorIcon + _i18n_error['4_2_1']);
            }
          }
        });
      }
    },

    collectInputValue: function () {
      var self = this;
      var value = self.$curVerifyType.data('value');

      return {
        val: value === 'mobile' ? self.$inputMobileAuthCode.val() : self.$inputEmailAuthCode.val()
      };
    }
  };

  findPassword.init();
});