define(['globalConfig', 'jquery', 'domReady!'], function (globalConfig, $) {

  var banner = {
    init: function () {
      var self = this;

      self.buildElement();

      self.gap = 8000;
      self.index = 0;
      self.length = self.$bannerList.length;
      self.imgSrcList = [];

      self.$bannerImgList.each(function (index, item) {
        self.imgSrcList.push(item['src']);
      });

      self.$btnList.each(function (index, item) {
        var $temp = $(item);

        if (index === 0) {
          $temp.addClass('active');
        }
        $temp.data('index', index);
      });

      if (self.length <= 1) {

        return;
      }

      self.timer = setInterval(function () {
        self.autoPlay();
      }, self.gap);

      self.bindEvent();
    },
    buildElement: function () {
      var self = this;

      self.$bannerBox = $('#frame-banner-box');
      self.$bannerList = $('#frame-banner-list li');
      self.$bannerImgList = $('#frame-banner-list li img');
      self.$bannerTemp = $('#frame-banner-temp');
      self.$btnPrev = $('#frame-btn-prev');
      self.$btnNext = $('#frame-btn-next');
      self.$btnList = $('#frame-btn-list .btn-banner');
    },
    bindEvent: function () {
      var self = this;

      self.$btnPrev.on('click', function () {
        if (self.transition) return;

        self.prev();
      });

      self.$btnNext.on('click', function () {
        if (self.transition) return;

        self.next();
      });

      self.$btnList.on('click', function () {
        var $this = $(this);
        var prevIndex = $('#frame-btn-list .active').data('index');

        $this.addClass('active').siblings().removeClass('active');
        self.changeBannerByIndex($this.data('index'), prevIndex);
      });

      self.$bannerBox.on({
        mouseenter: function () {
          clearInterval(self.timer);
        },
        mouseleave: function () {
          self.timer = setInterval(function () {
            self.autoPlay();
          }, self.gap);
        }
      });
    },
    prev: function () {
      var self = this;

      self.index = self.index === 0 ? self.length - 1 : self.index - 1;
      self.$btnList.eq(self.index).click();
    },
    next: function () {
      var self = this;

      self.index = self.index === self.length - 1 ? 0 : self.index + 1;
      self.$btnList.eq(self.index).click();
    },
    changeBannerByIndex: function (index, prevIndex) {
      var self = this;
      prevIndex = prevIndex || 0;
      var prevImg = '<img src="'+ self.imgSrcList[prevIndex] + '" />';

      self.transition = true;
      self.index = index;
      self.$bannerTemp.html(prevImg).show();
      self.$bannerList.hide();
      self.$bannerTemp.fadeOut(1000);

      $(self.$bannerList[index]).fadeIn(1000, function () {
        self.transition = false;
      });
    },
    autoPlay: function () {
      var self = this;

      self.index = self.index === self.length - 1 ? 0 : self.index + 1;
      self.$btnList.eq(self.index).click();
    }
  };

  return banner;
});