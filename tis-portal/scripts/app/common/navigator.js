require(['globalConfig', 'jquery', 'ajax', 'dialog', 'jqPlaceHolder', 'mustache', 'domReady!'], function (globalConfig, $, ajax, dialog, jqPlaceHolder, Mustache) {
    var navigator = {
        init: function () {
            var self = this;
            self.buildElement();
            self.bindEvent();
            self.checkMessage();
            self.$inputSearch.placeholder();
            self.isMsgLoaded = false;
        },
        buildElement: function () {
            var self = this;
            self.$btnSaveSite = $('#btn-save-site');
            self.$btnLang = $('#btn-lang');
            self.$boxLang = $('#box-lang');
            self.$langList = self.$boxLang.find('li');
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
        },
        bindEvent: function () {
            var self = this;
            self.$btnSaveSite.on('click', function (e) {
                var $temp = self.$btnSaveSite;
                var title = $temp.data('title');
                var url = $temp.data('url');
                if (url === '') {
                    url = window.location.href;
                }
                self.addFavorite(title, url);
            });
            self.$btnLang.on({
                mouseenter: function () {
                    self.$btnLang.addClass('active');
                    self.$boxLang.slideDown(0);
                },
                mouseleave: function () {
                    self.$btnLang.removeClass('active');
                    self.$boxLang.slideUp(0);
                }
            });
            self.$btnMessage.on({
                mouseenter: function () {
                    self.$btnMessage.addClass('active');
                    self.$boxMessage.slideDown(0);
                    self.$arrMessage.show();
                    if (!self.isMsgLoaded) {
                        self.loadMessage();
                        self.isMsgLoaded = true;
                    }
                },
                mouseleave: function () {
                    self.$btnMessage.removeClass('active');
                    self.$boxMessage.slideUp(0);
                    self.$arrMessage.hide();
                }
            });
            self.$boxMessage.on({
                mouseenter: function () {
                    self.$btnMessage.addClass('active');
                    self.$boxMessage.slideDown(0);
                    self.$arrMessage.show();
                },
                mouseleave: function () {
                    self.$btnMessage.removeClass('active');
                    self.$boxMessage.slideUp(0);
                    self.$arrMessage.hide();
                }
            });
            self.$btnCategory.on({
                mouseenter: function () {
                    self.$btnCategory.addClass('active');
                    self.$boxCategory.slideDown(0);
                },
                mouseleave: function () {
                    self.$btnCategory.removeClass('active');
                    self.$boxCategory.slideUp(0);
                }
            });
            self.$boxCategory.on({
                mouseenter: function () {
                    self.$btnCategory.addClass('active');
                    self.$boxCategory.slideDown(0);
                },
                mouseleave: function () {
                    self.$btnCategory.removeClass('active');
                    self.$boxCategory.slideUp(0);
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
                        dialog.show('buy');
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
            self.$btnReplaceSearch.on('click', function() {
                var val = self.$inputSearch.val();
                var href = self.$btnReplaceSearch.data('href');
                var auth = self.$btnReplaceSearch.data('auth');
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
                url: 'user/msg/count-unread',
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    if (res.data && parseInt(res.data) === 0) {
                        self.$loadingMessage.hide();
                        self.$noMessage.show();
                        self.isMsgLoaded = true;
                    } else {
                        self.$redDot.show();
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        },
        loadMessage: function () {
            var self = this;
            ajax.invoke({
                url: 'user/msg/list-page',
                type: 'post',
                data: {
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
                },
                dataType: 'json',
                success: function(res) {
                    self.$boxMessage.html(Mustache.render($('#message-template').html(), res));
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    };

    navigator.init();
});
