define(['globalConfig', 'jquery', 'domReady!'], function (globalConfig, $) {
    var tabNews = {
        init: function () {
            var self = tabNews;
            self.buildElement();
            self.bindEvent();
        },
        buildElement: function () {
            var self = tabNews;
            self.$tabBtnList = $('#tab-btn-box .btn');
            self.$userDynamicList = $('#user-dynamic-list');
            self.$newsList = $('#news-list');
        },
        bindEvent: function () {
            var self = tabNews;
            self.$tabBtnList.on({
                click: function () {
                    var $temp = $(this);
                    var target = $temp.data('target');
                    $temp.addClass('active').siblings('.btn').removeClass('active');
                    if (target === 'user-dynamic-list') {
                        self.$newsList.hide();
                        self.$userDynamicList.show();
                    } else if (target === 'news-list') {
                        self.$userDynamicList.hide();
                        self.$newsList.show();
                    }
                }
            });
        }
    };

    return {
        init: tabNews.init
    };
});
