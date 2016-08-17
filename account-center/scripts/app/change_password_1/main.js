require(['globalConfig', 'jquery'], function (globalConfig, $) {

  var changePassword = {

    init: function () {
      var self = this;

    },

    buildElement: function () {
      var self = this;

      self.$boxLang = $('#box-lang');
      self.$langList = $('#lang-list');
    },

    bindEvent: function () {
      var self = this;

      self.$boxLang.on({
        mouseenter: function () {
          self.$langList.fadeIn(0);
        },
        mouseleave: function () {
          self.$langList.fadeOut(0);
        }
      });
    }

  };

  changePassword.init();
});