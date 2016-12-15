require(['globalConfig', 'jquery', 'tabNews', 'userActivity', 'banner', 'mustache', 'scWindow'], function (globalConfig, $, tabNews, UserActivity, banner, Mustache) {
  var home = {
    init: function () {
      var self = this;

      self.bannerTime = '';
      self.index = 0;
      self.initComponent();
      self.controlDialog();
      self.controlBannerShow();
    },
    initComponent: function () {
      var self = this;

      // tis-home
      tabNews.init();
      new UserActivity();

      // tis-portal
      banner.init();
    },
    controlDialog: function () {
      var self = this;
      if (globalConfig.context.oemCode === 'suzuki' && globalConfig.userState.needRemindUserUseLogger) {
        var html = $('#system-introduction').html();

        $('body').append(html);

        $('#dialog-btn-close-system').on('click', function () {
          $('#dialog-bg-system').remove();
          $('#dialog-box-system').remove();

          self.isShowExpired();
        });

      } else {
        self.isShowExpired();
      }
    },
    isShowExpired: function () {
      var self = this;

      if (globalConfig.userState.needRemindUserExpireDate) {
        var html = $('#expired-introduction').html();
        var data = {
          expiringServices: globalConfig.userState.expiringServices
        };

        $('body').append(Mustache.render(html, data));
        $('#dialog-btn-close').on('click', function () {
          $('#dialog-bg').remove();
          $('#dialog-box').remove();
        });
      }
    },
    controlBannerShow: function () {
      var self = this;
      if (globalConfig.context.oemCode === 'dfsk') {

        var $bannerBtnList = $(".banner-btn-list span");

        $bannerBtnList.click(function () {
          var $this = $(this);

          clearTimeout(self.bannerTime);

          var index = parseInt($this.data("index"));

          $this.addClass('active').siblings().removeClass('active');

          $("#banner-wrapper li").eq(index).fadeIn().siblings().fadeOut();

          self.index = index;

          var nextIndex = (self.index + 1) % 4;

          self.bannerTime = setTimeout(function () {

            $bannerBtnList.eq(nextIndex).trigger('click');

          }, 2000);

        });

        $bannerBtnList && $bannerBtnList.eq(self.index).trigger('click');
      }
    }

  };
  home.init();
});