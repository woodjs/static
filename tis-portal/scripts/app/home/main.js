require(['globalConfig', 'tabNews', 'userDynamic', 'jquery', 'domReady!'], function (globalConfig, tabNews, UserDynamic, $) {
  var home = {
    init: function () {
      var self = this;
      self.initComponent();

      self.randomShow();
    },
    initComponent: function () {
      var self = this;
      tabNews.init();
      var userDynamic = new UserDynamic();
    },
    randomShow: function () {
      var $boxColList = $('.box-col-1');
      var htmlList = [];

      $boxColList.each(function (index, item) {

        htmlList.push($(item).html());

      });

      var newHtmlList = [];

      function getHtmlItem(htmlList) {
        var len = htmlList.length;

        if (len === 0) return;

        var key = Math.floor(Math.random() * len);

        newHtmlList.push(htmlList.splice(key, 1));

        getHtmlItem(htmlList);

      }

      getHtmlItem(htmlList);

      $boxColList.each(function (index, item) {
        $(item).html(newHtmlList[index]);
      });

    }
  };
  home.init();
});