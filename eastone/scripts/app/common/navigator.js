require(['globalConfig', 'jquery', 'ajax', 'dialog', 'jqPlaceHolder', 'mustache', 'track', 'json2'], function (globalConfig, $, ajax, dialog, jqPlaceHolder, Mustache, track) {

  var navigator = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$btnSaveSite = $('#btn-save-site');
      self.$btnAuthList = $('.btn-auth');
    },

    bindEvent: function () {
      var self = this;

      self.$btnSaveSite.on('click', function (e) {
        var title = self.$btnSaveSite.data('title');
        var url = self.$btnSaveSite.data('url');

        if (!url) {
          url = window.location.href;
        }
        self.addFavorite(title, url);
      });

      self.$btnAuthList.on('click', function () {
        var $temp = $(this);
        var auth = $temp.data('auth');
        var href = $temp.data('href');

        if (auth === true) {
          window.open(href);
        } else {
          if (globalConfig.userState && (!globalConfig.userState.isLogin)) {
            dialog.show('login');
          }
        }
      });
    },

    addFavorite: function (title, url) {

      try {
        window.external.addFavorite(url, title);
      } catch (e) {
        try {
          window.sidebar.addPanel(title, url, '');
        } catch (e) {
          alert('抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加');
        }
      }
    }
  };

  navigator.init();
});
