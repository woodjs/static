define(['globalConfig', 'jquery', 'domReady!'], function (globalConfig, $) {

  var banner = {
    init: function () {
      var self = this;

      self.buildElement();

      self.index = 0;
      self.length = self.$bannerList.length;
      self.imgSrcList = [];

      self.$bannerImgList.each(function (index, item) {
        self.imgSrcList.push(item['src']);
      });

      self.timer = setInterval(function () {
        self.autoPlay();
      }, 8000);

      self.bindEvent();
    },
    buildElement: function () {
      var self = this;

      self.$bannerList = $('#frame-banner-list li');
      self.$bannerImgList = $('#frame-banner-list li img');
      self.$bannerTemp = $('#frame-banner-temp');
      self.$btnPrev = $('#frame-btn-prev');
      self.$btnNext = $('#frame-btn-next');
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

    },
    prev: function () {
      var self = this;

      self.index = self.index === 0 ? self.length - 1 : self.index - 1;
      self.changeBannerByIndex(self.index);
    },
    next: function () {
      var self = this;

      self.index = self.index === self.length - 1 ? 0 : self.index + 1;
      self.changeBannerByIndex(self.index);
    },
    changeBannerByIndex: function (index) {
      var self = this;
      var prevIndex = index === 0 ? self.length - 1 : index - 1;
      var prevImg = '<img src="'+ self.imgSrcList[prevIndex] + '" />';

      self.transition = true;
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
      self.changeBannerByIndex(self.index);
    }
  };

  return banner;
});