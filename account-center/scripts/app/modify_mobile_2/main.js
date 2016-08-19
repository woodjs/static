require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {

  var path = globalConfig.context.path;
  var lang = globalConfig.context.lang;
  var errorIcon = '<i class="icon icon-error"></i>';
  var mobileRegex = /^1[3|4|5|7|8]\d{9}$/;

  var modifyMobile = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
      self.originalMobileTime = self.$labelMobileTime.html();
    },

    buildElement: function () {
      var self = this;

      self.$originalMobile = $('#original-mobile');
      self.$inputNewMobile = $('#new-mobile');
      self.$inputMobileAuthCode = $('#mobile-auth-code');
      self.$errorNewMobile = $('#new-mobile-error');
      self.$errorMobile = $('#mobile-error');
      self.$btnFetchMobileCode = $('#fetch-mobile-auth-code');
      self.$btnFetchingMobileCode = $('#fetching-mobile-auth-code');
      self.$labelMobileTime = $('#fetching-mobile-auth-code label');
      self.$mobileGuide = $('#mobile-guide');
      self.$btnSubmit = $('#submit');
    },

    bindEvent: function () {
      var self = this;

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

      self.$inputMobileAuthCode.on('blur', function () {
        self.checkMobileAuthCodeInput();
      });

      self.$btnSubmit.on('click', function () {
        self.submit();
      });

    },

    checkMobileAuthCodeInput: function () {
      var self = this;

      if (self.checkIsEmpty(self.$inputMobileAuthCode)) {

        self.$errorMobile.html(errorIcon + _i18n_error['3_3_5']);

        return false;
      } else {
        self.$errorMobile.html('');
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

      return self.checkMobileAuthCodeInput();
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
      self.$labelMobileTime.html(self.originalMobileTime);
      self.$mobileGuide.html('');

      clearInterval(self.mobileInter);
    },

    sendMobileRequest: function () {
      var self = this;

      ajax.invoke({
        url: path + '/user/mobile/send-bind-auth-code',
        type: 'POST',
        dataType: 'json',
        data: null,
        success: function (res) {
        },
        failed: function (res) {
          var code = res.code;

          if ('SEND_AUTH_CODE_ERROR' === code) {
            self.$errorMobile.html(errorIcon + _i18n_error['4_2_5']);
          }
        }
      });
    },

    submit: function () {
      var self = this;
      var data = self.collectInputValue();

      if (self.checkAllInput()) {
        ajax.invoke({
          url: path + '/user/mobile/check-bind-auth-code',
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(data),
          success: function (res) {
            window.location.href = path + '/user/mobile/modify';
          },
          failed: function (res) {
            var code = res.code;

            if ('AUTH_CODE_ERROR' === code) {
              self.$errorMobile.html(errorIcon + _i18n_error['4_2_1']);
            } else if ('SEND_ONLY_ONCE_IN_A_INTERVAL'  === code) {
              self.$errorMobile.html(errorIcon + _i18n_error['4_2_7']);
            }
          }
        });
      }
    },

    collectInputValue: function () {
      var self = this;

      return {
        val: self.$inputMobileAuthCode.val()
      };
    }
  };

  modifyMobile.init();
});