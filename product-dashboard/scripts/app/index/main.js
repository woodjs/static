require(['globalConfig', 'jquery', 'ajax'], function (globalConfig, $, ajax) {
  var navigator = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$links = $('.frame-nav a');
    },

    bindEvent: function () {
      var self = this;

      self.$links.on({
        click: function () {
          var $this = $(this);
          var targetId = $this.data('target');

          for (var i = 0; i < self.$links.length; i++) {
            $(self.$links[i]).removeClass('active');
          }

          $this.addClass('active');

          if (targetId) {
            $('html,body').animate({scrollTop: $('#' + targetId).offset().top - 55}, 500);
          }
        }
      });
    }
  };

  navigator.init();
});