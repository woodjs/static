require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {
  var navigator = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$products = $('.block-products a');
    },

    bindEvent: function () {
      var self = this;

      self.$products.on({
        mouseenter: function () {
          $(this).animateCss('pulse');
        },
        mouseleave: function () {
        }
      });
    }
  };

  navigator.init();
});