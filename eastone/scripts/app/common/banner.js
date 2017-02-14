define(['globalConfig', 'jquery', 'domReady!'], function (globalConfig, $) {

  var banner = {

    init: function () {
      var self = this;

      self.buildElement();

      self.gap = 3000;
      self.index = 0;
      self.length = self.$bannerList.length;
      self.imgSrcList = [];
      self.countBannerImageError = 0;

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
      
      self.checkLoading();
    },

    buildElement: function () {
      var self = this;

      self.$bannerBox = $('#frame-banner-box');
      self.$bannerListBox = $('#frame-banner-list');
      self.$bannerList = $('#frame-banner-list li');
      self.$bannerImgList = $('#frame-banner-list li img');
      self.$bannerTemp = $('#frame-banner-temp');
      self.$bannerLoading = $('#frame-banner-loading');
      self.$btnPrev = $('#frame-btn-prev');
      self.$btnNext = $('#frame-btn-next');
      self.$btnListBox = $('#frame-btn-list');
      self.$btnList = $('#frame-btn-list .btn-banner');
    },
    
    checkLoading: function () {
      var self = this;
      var count = 0;

      for (var i = 0; i < self.$bannerImgList.length; i++) {

        if (self.$bannerImgList[i].complete || self.$bannerImgList[i].width) {

          count++;
          if (count === self.length) self.showBanner();

        } else {

          self.$bannerImgList[i].onload = function () {

            count++;
            if (count === self.length) self.showBanner();

          };

          self.$bannerImgList[i].onerror = function () {};
        }
      }
    },
    
    showBanner: function () {
      var self = this;

      self.$bannerLoading.fadeOut(300);
      self.$bannerListBox.fadeIn(300);
      self.$bannerTemp.fadeIn(300);
          
      if (self.length > 1) {
    	  self.$btnListBox.fadeIn(300);
	      self.bindEvent();
	      self.bannerTimer = setInterval(function () {
	          self.autoPlay();
	        }, self.gap);
      }
    
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
        	self.bannerTimer && clearInterval(self.bannerTimer);
        },
        mouseleave: function () {
          self.bannerTimer = setInterval(function () {
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