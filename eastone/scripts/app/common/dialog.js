define(['globalConfig', 'jquery', 'mustache'], function (globalConfig, $, Mustache) {

  var dialog = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$dialogBg = $('#dialog-bg');
      self.$dialogBox = $('#dialog-box');
      self.$btnClose = $('#dialog-btn-close');
      self.$btnAction = $('#dialog-btn-action');
      self.$btnCancel = $('#dialog-btn-cancel');
    },

    bindEvent: function () {
      var self = this;

      self.$btnClose.on('click', function () {

        self.$dialogBg.hide();
        self.$dialogBox.hide();
      });

      self.$btnAction.on('click', function () {
        var $temp = $(this);
        var url = $temp.data('url');

        if (url.indexOf('login') > -1) {
          self.$dialogBg.hide();
          self.$dialogBox.hide();
          window.location.href = url;
        }
      });

      self.$btnCancel.on('click', function () {
        self.$dialogBg.hide();
        self.$dialogBox.hide();
      });
    },

    show: function (model) {
      var self = dialog;

      if (model === 'login') {
        self.$dialogBg.show();
        self.$dialogBox.show();
      }
    }
  };

  dialog.init();

  return {
    show: dialog.show
  };
});