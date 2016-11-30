require(['globalConfig', 'jquery', 'ajax', 'jqPlaceHolder', 'json2'], function (globalConfig, $, ajax, jqPlaceHolder) {

  var navigator = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
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

  navigator.init();
});
