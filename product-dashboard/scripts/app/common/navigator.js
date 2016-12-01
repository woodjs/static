require(['globalConfig', 'jquery', 'ajax', 'json2'], function (globalConfig, $, ajax) {
  var path = globalConfig.context.path;

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
          var $this = $(this);

          self.$wrapperSetting.fadeOut(50);
          self.$wrapperLangList.fadeIn(200);

          self.toggleToArrowUp($this);
        },
        mouseleave: function () {
          var $this = $(this);

          langTimeoutId = setTimeout(function () {
            self.$wrapperLangList.fadeOut(50);

            self.toggleToArrowDown($this);
          }, 200);
        }
      });

      self.$wrapperLangList.on({
        mouseenter: function () {
          langTimeoutId && clearTimeout(langTimeoutId);
        }
      });

      self.$btnSetting.on({
        mouseenter: function () {
          var $this = $(this);

          self.$wrapperLangList.fadeOut(50);
          self.$wrapperSetting.fadeIn(200);

          self.toggleToArrowUp($this);
        },
        mouseleave: function () {
          var $this = $(this);

          settingTimeoutId = setTimeout(function () {
            self.$wrapperSetting.fadeOut(50);
            self.toggleToArrowDown($this);
          }, 200);
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
          $this.html(_i18n.index_2);
          self.$btnOptionCancel.addClass('disable');

          var data = self.collectOptions();

          ajax.invoke({
            url: path + '/setting',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (res) {
              window.location.href = path + '/index';
            },
            failed: function (res) {

              $this.removeClass('disable');
              $this.html(_i18n.index_1);
              self.$btnOptionCancel.removeClass('disable');

              alert(_i18n.index_3);
            }
          });
        }
      });

      self.$btnOptionCancel.on({
        click: function () {
          var $this = $(this);

          if ($this.is('.disable')) return;

          self.$wrapperSetting.fadeOut(50);
        }
      });
    },

    toggleToArrowUp: function ($this) {
      $this.find('.arrow').removeClass('icon-arrow-down').addClass('icon-arrow-up');

    },

    toggleToArrowDown: function ($this) {
      $this.find('.arrow').removeClass('icon-arrow-up').addClass('icon-arrow-down');
    },

    collectOptions: function () {
      var self = this;
      var result = [];

      for (var i = 0; i < self.$options.length; i++) {
        var obj = {};
        var $temp = $(self.$options[i]);
        var code = $temp.data('code');

        obj.code = code;
        obj.isShow = $temp.find('i').is('.icon-checked-2') ? true : false;

        result.push(obj);
      }

      return result;
    }
  };

  navigator.init();
});
