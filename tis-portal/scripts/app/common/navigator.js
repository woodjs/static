require(['globalConfig', 'jquery', 'ajax', 'dialog', 'jqPlaceHolder', 'mustache', 'json2'], function (globalConfig, $, ajax, dialog, jqPlaceHolder, Mustache) {
  var path = globalConfig.context.path;

  var navigator = {
    init: function () {
      var self = this;
      self.buildElement();

      if (self.$boxCategory.is('.site-nav')) {
        var $navColumnList = self.$boxCategory.find('.nav-column');

        self.$boxCategory.width($navColumnList.length * 194 + 2);
        if (self.$boxCategory.height() > 0) {
          self.$boxCategory.height(self.$boxCategory.height());
        }
      }
      self.bindEvent();
      self.checkMessage();
      self.$inputSearch.placeholder();
      self.isMsgLoaded = false;
      self.interId = setInterval(self.checkMessage, 1000 * 30);
    },
    buildElement: function () {
      var self = this;
      self.$btnSaveSite = $('#btn-save-site');
      self.$btnLang = $('#btn-lang');
      self.$boxLang = $('#box-lang');
      self.$btnMessage = $('#btn-message');
      self.$arrMessage = $('#message-arrow');
      self.$boxMessage = $('#box-message');
      self.$btnCategory = $('#btn-category');
      self.$boxCategory = $('#box-category');
      self.$btnAuthList = $('.btn-auth');
      self.$btnAuthLoginList = $('.btn-auth-login');
      self.$inputSearch = $('#input-search');
      self.$btnSearch = $('#btn-search');
      self.$btnReplaceSearch = $('#btn-replace-search');
      self.$redDot = $('#red-dot');
      self.$noMessage = $('#no-message');
      self.$loadingMessage = $('#loading-message');
      self.$messageTemplateBox = $('#message-template-box');
      self.$backToTop = $('#back-to-top');
    },
    bindEvent: function () {
      var self = this;
      self.$inputSearch.on('keypress', function (e) {
        if (e.keyCode === 13) {
          self.$btnSearch.click();
          $(this).blur();
          e.preventDefault();
        }
      });
      self.$btnSaveSite.on('click', function (e) {
        var $temp = self.$btnSaveSite;
        var title = $temp.data('title');
        var url = $temp.data('url');
        if (url === '') {
          url = window.location.href;
        }
        self.addFavorite(title, url);
      });
      self.$backToTop.on('click', function () {
        $('html,body').animate({scrollTop: 0}, 300);
      });
      self.$btnLang.on({
        mouseenter: function () {
          self.$btnLang.addClass('active');
          self.$boxLang.fadeIn(0);
        },
        mouseleave: function () {
          self.$btnLang.removeClass('active');
          self.$boxLang.fadeOut(0);
        }
      });
      self.$btnMessage.on({
        mouseenter: function () {
          self.$btnMessage.addClass('active');
          self.$boxMessage.fadeIn(0);
          self.$arrMessage.show();
          if (!self.isMsgLoaded) {
            self.loadMessage();
          }
        },
        mouseleave: function () {
          self.$btnMessage.removeClass('active');
          self.$boxMessage.fadeOut(0);
          self.$arrMessage.hide();
        }
      });
      self.$boxMessage.on({
        mouseenter: function () {
          self.$btnMessage.addClass('active');
          self.$boxMessage.fadeIn(0);
          self.$arrMessage.show();
        },
        mouseleave: function () {
          self.$btnMessage.removeClass('active');
          self.$boxMessage.fadeOut(0);
          self.$arrMessage.hide();
        }
      });
      self.$btnCategory.on({
        mouseenter: function () {
          self.$btnCategory.addClass('active');
          self.$boxCategory.fadeIn(0);
        },
        mouseleave: function () {
          self.$btnCategory.removeClass('active');
          self.$boxCategory.fadeOut(0);
        }
      });
      self.$boxCategory.on({
        mouseenter: function () {
          self.$btnCategory.addClass('active');
          self.$boxCategory.fadeIn(0);
        },
        mouseleave: function () {
          self.$btnCategory.removeClass('active');
          self.$boxCategory.fadeOut(0);
        }
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
          } else if (globalConfig.userState && globalConfig.userState.isLogin && (!auth)) {
            dialog.show('buy', $temp);
          }
        }
      });
      self.$btnAuthLoginList.on('click', function () {
        var $temp = $(this);
        var href = $temp.data('href');
        if (!(globalConfig.userState && globalConfig.userState.isLogin)) {
          dialog.show('login');
        } else {
          window.open(href);
        }
      });
      self.$btnSearch.on('click', function () {
        var val = self.$inputSearch.val();
        var href = self.$btnSearch.data('href');
        var auth = self.$btnSearch.data('auth');

        if (globalConfig.context.oemCode === 'sih' && /.*[\u4e00-\u9fa5]+.*$/.test(val)) {
          alert("请正确直接输入VIN/VCB/VP号码，不能包含中文！");
          return false;
        }

        if (auth === true) {
          window.open(href + '?value=' + val);
        } else {
          if (globalConfig.userState && (!globalConfig.userState.isLogin)) {
            dialog.show('login');
          } else if (globalConfig.userState && globalConfig.userState.isLogin && (!auth)) {
            dialog.show('buy');
          }
        }
      });
      self.$btnReplaceSearch.on('click', function () {
        var val = self.$inputSearch.val();
        var href = self.$btnReplaceSearch.data('href');
        var auth = self.$btnReplaceSearch.data('auth');

        if (globalConfig.context.oemCode === 'sih' && /.*[\u4e00-\u9fa5]+.*$/.test(val)) {
          alert("请正确直接输入VIN/VCB/VP号码，不能包含中文！");
          return false;
        }

        if (auth === true) {
          window.open(href + '?value=' + val);
        } else {
          if (globalConfig.userState && (!globalConfig.userState.isLogin)) {
            dialog.show('login');
          } else if (globalConfig.userState && globalConfig.userState.isLogin && (!auth)) {
            dialog.show('buy');
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
    },
    checkMessage: function () {
      var self = this;
      if (globalConfig.userState && (!globalConfig.userState.isLogin)) {
        return;
      }
      ajax.invoke({
        url: path + '/user/msg/count-unread',
        type: 'get',
        dataType: 'json',
        success: function (res) {
          var self = navigator;
          if (parseInt(res.data) === 0) {
            self.$redDot.hide();
            self.$loadingMessage.hide();
            self.$messageTemplateBox.hide();
            self.$noMessage.show();
            self.isMsgLoaded = true;
          } else {
            self.$noMessage.hide();
            self.$messageTemplateBox.hide();
            self.$redDot.show();
            self.$loadingMessage.show();
            self.isMsgLoaded = false;
          }
        },
        error: function (err) {
          console.log(err);
        }
      });
    },
    loadMessage: function () {
      var self = this;
      var data = {
        filters: {
          unread: true
        },
        sort: [
          {field: 'time', asc: false}
        ],
        paging: {
          page: 1,
          size: 3
        }
      };
      ajax.invoke({
        url: path + '/user/msg/list-page',
        type: 'post',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (res) {
          var self = navigator;
          self.$messageTemplateBox.html(Mustache.render($('#message-template').html(), res));
          self.$redDot.hide();
          self.$loadingMessage.hide();
          self.$noMessage.hide();
          self.$messageTemplateBox.show();
          self.isMsgLoaded = true;
        },
        error: function (err) {
          var self = navigator;
          if (err.status === 401) {
            //clearInterval(self.interId);
            location.href = location.href;
          }
        }
      });
    }
  };

  navigator.init();
});
