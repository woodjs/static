require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {

  var path = globalConfig.context.path;
  var identifyCodePath = path + '/find-pwd/input-user-key-auth-code';
  var errorIcon = '<i class="icon icon-error"></i>';

  var findPassword = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$accountInput = $('#account-input');
      self.$accountError = $('#account-error');
      self.$identifyInput = $('#identify-input');
      self.$identifyError = $('#identify-error');
      self.$identifyImg = $('#identify-img');
      self.$btnInvisibility = $('#invisibility');
      self.$btnSubmit = $('#submit');
    },

    bindEvent: function () {
      var self = this;

      self.$accountInput.on('blur', function () {
        self.checkAccountInput();
      });

      self.$identifyInput.on('blur', function () {
        self.checkIdentifyInput();
      });

      self.$btnSubmit.on('click', function () {
        self.submit();
      });

      self.$identifyImg.on('click', function () {

        self.$identifyImg.attr('src', identifyCodePath + '?_sc=' + Math.random());
      });

      self.$btnInvisibility.on('click', function () {

        self.$identifyImg.attr('src', identifyCodePath + '?_sc=' + Math.random());
      });
    },

    checkAccountInput: function () {
      var self = this;

      if (self.checkIsEmpty(self.$accountInput)) {

        self.$accountError.html(errorIcon + _i18n_error['4_1_1']);

        return false;
      } else {
        self.$accountError.html('');
      }

      return true;
    },

    checkIdentifyInput: function () {
      var self = this;

      if (!self.checkAccountInput()) {
        return false;
      }

      if (self.checkIsEmpty(self.$identifyInput)) {

        self.$identifyError.html(errorIcon + _i18n_error['4_1_2']);

        return false;
      } else {
        self.$identifyError.html('');
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

      return self.checkIdentifyInput();
    },

    submit: function () {
      var self = this;
      var data = self.collectInputValue();

      if (self.checkAllInput()) {
        ajax.invoke({
          url: path + '/find-pwd/do-input-key',
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(data),
          success: function (res) {
            window.location.href = path + '/find-pwd/validate';
          },
          failed: function (res) {
            var code = res.code;

            if ('AUTH_CODE_ERROR' === code) {
              self.$identifyError.html(errorIcon + _i18n_error['4_1_4']);
            } else if ('USER_NOT_EXISTS' === code) {
              self.$accountError.html(errorIcon + _i18n_error['4_1_3']);
            }

            self.$btnInvisibility.click();
          }
        });
      }
    },

    collectInputValue: function () {
      var self = this;

      return {
        userKey: self.$accountInput.val(),
        authCode: self.$identifyInput.val()
      };
    }
  };

  findPassword.init();
});