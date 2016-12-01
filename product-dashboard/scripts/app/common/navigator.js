require(['globalConfig', 'jquery', 'ajax', 'json2'], function (globalConfig, $, ajax) {

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
      self.$options = $('#table-wrapper-options td div');
      self.$btnOptionSubmit = $('#option-submit');
      self.$btnOptionCancel = $('#option-cancel');
    },

    bindEvent: function () {
      var self = this;
      var langTimeoutId;
      var settingTimeoutId;

      self.$btnLangList.on({
        mouseenter: function () {
          self.$wrapperSetting.fadeOut(100);
          self.$wrapperLangList.fadeIn(200);
        },
        mouseleave: function () {
          langTimeoutId = setTimeout(function () {
            self.$wrapperLangList.fadeOut(100);
          }, 300);
        }
      });

      self.$wrapperLangList.on({
        mouseenter: function () {
          langTimeoutId && clearTimeout(langTimeoutId);
        }
      });

      self.$btnSetting.on({
        mouseenter: function () {
          self.$wrapperLangList.fadeOut(100);
          self.$wrapperSetting.fadeIn(200);
        },
        mouseleave: function () {
          settingTimeoutId = setTimeout(function () {
            self.$wrapperSetting.fadeOut(100);
          }, 300);
        }
      });

      self.$wrapperSetting.on({
        mouseenter: function () {
          settingTimeoutId && clearTimeout(settingTimeoutId);
        }
      });

      self.$options.on({
        click: function () {
          var $option = $(this).find('i');

          if ($option.is('.icon-checked-2')) {
            $option.removeClass('icon-checked-2').addClass('icon-unchecked-2');
          } else {
            $option.removeClass('icon-unchecked-2').addClass('icon-checked-2');
          }
        }
      });

      self.$btnOptionSubmit.on({
        click: function () {
          var $this = $(this);

          if ($this.is('.disable')) return;

          $this.addClass('disable');
        }
      });

      self.$btnOptionCancel.on({
        click: function () {
          self.$wrapperSetting.fadeOut(100);
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
