require(['globalConfig', 'jquery', 'ajax', 'jqPlaceHolder', 'json2'], function (globalConfig, $, ajax, jqPlaceHolder) {

  var navigator = {

    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },

    buildElement: function () {
      var self = this;

      self.$btnLangList = $('#btn-lang-list');
      self.$wrapperLangList = $('#wrapper-lang-list');
      self.$btnSetting = $('#btn-setting');
      self.$wrapperSetting = $('#wrapper-setting');
    },

    bindEvent: function () {
      var self = this;

      self.$btnLangList.on({
        mouseenter: function () {
          self.$wrapperLangList.show().animateCss('fadeInDown');
        },
        mouseleave: function () {
          self.$wrapperLangList.animateCss('fadeOutUp', function () {
            self.$wrapperLangList.hide();
          });
        }
      });

      self.$btnSetting.on({
        mouseenter: function () {
          self.$wrapperSetting.show().animateCss('fadeInDown');
        },
        mouseleave: function () {
          self.$wrapperSetting.animateCss('fadeOutUp', function () {
            self.$wrapperSetting.hide();
          });
        }
      });
    }
  };

  navigator.init();

  $.fn.extend({
    animateCss: function (animationName, callback) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);

        callback && callback();
      });
    }
  });
});
