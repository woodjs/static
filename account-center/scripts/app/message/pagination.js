define(['mustache', 'jquery'], function (mustache) {

    var paginationTpl = '';

    function Pagination(opt) {
        this.init(opt);
    }

    Pagination.prototype = {
        init: function (opt) {
            var self = this;

            self.config(opt);
            self.build();
        },
        config: function (opt) {
            var self = this;
            self.currentPageNumber = typeof opt.currentPageNumber === 'number' && opt.currentPageNumber > 0 ? opt.currentPageNumber : 1;//当前页码
            self.pageSize = typeof opt.pageSize === 'number' && opt.pageSize > 0 ? opt.pageSize : 0;//每页显示记录数
            self.totalRecordsNumber = typeof opt.totalRecordsNumber === 'number' && opt.totalRecordsNumber >= 0 ? opt.totalRecordsNumber : 0;//总记录数
            self.showFirstBtn = typeof opt.firstBtn === 'boolean' ? opt.firstBtn : true;//首页按钮  默认true
            self.showPrevBtn = typeof opt.prevBtn === 'boolean' ? opt.prevBtn : true;//前翻页按钮  默认true
            self.showNextBtn = typeof opt.nextBtn === 'boolean' ? opt.nextBtn : true;//后翻页按钮  默认true
            self.showLastBtn = typeof opt.lastBtn === 'boolean' ? opt.lastBtn : true;//末页按钮  默认true
            self.begin = typeof opt.begin === 'number' && opt.begin >= 0 ? opt.begin : 2;//自然数  默认 2
            self.range = typeof opt.range === 'number' && opt.range > 0 && opt.range % 2 !== 0 ? opt.range : 5;//只能是正奇数  默认 5
            self.end = typeof opt.end === 'number' && opt.end >= 0 ? opt.end : 0;//自然数  默认 0
            self.showDirect = typeof opt.direct === 'boolean' ? opt.direct : true;//直达功能  默认true
            self.showEllipsise = self.begin > 0 || self.end > 0 ? true : (typeof opt.ellipsis === 'boolean' ? opt.ellipsis : true); //省略号    默认true（如果begin或end不为0此值将忽略用户设置始终为true）
            self.tpl = typeof opt.template === 'string' ? opt.template : paginationTpl;//模版
            self.onSubmit = typeof opt.onSubmit === 'function' ? opt.onSubmit : function (pageNumber) {
                try {
                    console.log('您将要访问第' + pageNumber + '页')
                } catch (e) {
                }
            };
            self.onInputError = typeof opt.onInputError === 'function' ? opt.onInputError : function (value) {
            };
        },
        build: function () {
            var self = this;

            self.element = $(mustache.render(self.tpl, self.buildPaginationData()));
            self.bindEvent();
        },
        buildPaginationData: function () {
            var self = this;

            self.maxPageNumber = Math.ceil(self.totalRecordsNumber / self.pageSize);//maxpageNumber

            var data = {
                firstBtn: {
                    pageNumber: 1,
                    isDisabled: true
                },
                prevBtn: {
                    pageNumber: self.currentPageNumber - 1,
                    isDisabled: true
                },
                nextBtn: {
                    pageNumber: self.currentPageNumber + 1,
                    isDisabled: true
                },
                lastBtn: {
                    pageNumber: self.maxPageNumber,
                    isDisabled: true
                },
                paging: [],
                direct: self.showDirect,
                totalPageNumber: self.maxPageNumber,
                currentPageNumber: self.currentPageNumber,
                pageSize: self.pageSize
            };

            if (self.currentPageNumber === 1) {
                data.firstBtn.isDisabled = true;
                data.prevBtn.isDisabled = true;
            } else {
                data.firstBtn.isDisabled = false;
                data.prevBtn.isDisabled = false;
            }
            if (self.currentPageNumber === self.maxPageNumber) {
                data.nextBtn.isDisabled = true;
                data.lastBtn.isDisabled = true;
            } else {
                data.nextBtn.isDisabled = false;
                data.lastBtn.isDisabled = false;
            }

            var tArr = [];
            var m = self.begin;
            var n = self.end;
            var r = self.range;
            var x = Math.floor(self.range / 2);
            var l = m + 1 + r + 1 + n;
            for (var i = 1; i <= l; i++) {
                var index = i + 1;
                if (i <= m) {
                    var num = i;
                    if (num >= self.currentPageNumber - x) {
                        tArr[i - 1] = null;
                    } else {
                        tArr[i - 1] = {};
                        tArr[i - 1].isEllipsis = false;
                        tArr[i - 1].isCurrent = false;
                        tArr[i - 1].pageNumber = num;
                    }
                } else if (i === (m + 1) || i === (m + 1 + r + 1)) {
                    tArr[i - 1] = {};
                    tArr[i - 1].isEllipsis = true;
                } else if (i > (l - n)) {
                    var num = self.maxPageNumber - (l - i);
                    if (num <= self.currentPageNumber + x) {
                        tArr[i - 1] = null;
                    } else {
                        tArr[i - 1] = {};
                        tArr[i - 1].isEllipsis = false;
                        tArr[i - 1].isCurrent = false;
                        tArr[i - 1].pageNumber = num;
                    }
                } else {
                    var num = self.currentPageNumber - x - 1 + (i - (m + 1));
                    if (num <= 0 || num > self.maxPageNumber) {
                        tArr[i - 1] = null;
                    } else {
                        tArr[i - 1] = {};
                        tArr[i - 1].isEllipsis = false;
                        tArr[i - 1].isCurrent = num === self.currentPageNumber ? true : false;
                        tArr[i - 1].pageNumber = num;
                    }
                }
            }
            for (var i = 0; i < tArr.length; i++) {
                if (tArr[i] !== null && tArr[i].isEllipsis === true) {
                    if (i + 1 < tArr.length) {
                        if (tArr[i + 1] === null || tArr[i + 1].isCurrent === true) {
                            tArr[i] = null;
                        }
                    }
                    if (i - 1 >= 0) {
                        if (tArr[i - 1] === null || tArr[i - 1].isCurrent === true) {
                            tArr[i] = null;
                        }
                    }
                }
            }
            for (var i = 0; i < tArr.length; i++) {
                if (tArr[i] !== null) {
                    if (!self.showEllipsise && tArr[i].isEllipsis === false) {
                        data.paging.push(tArr[i]);
                    } else {
                        data.paging.push(tArr[i]);
                    }
                }
            }
            return data;
        },
        bindEvent: function () {
            var self = this;

            self.directSubmitBtn = self.element.find('[data-action="direct-submit"]');
            self.directInput = self.element.find('[data-type="direct-input"]');
            self.element.on('click', '[data-action="page-jump"]', function () {
                var $this = $(this);
                if ($this.hasClass('disabled')) {
                    return;
                }
                self.onSubmit($this.attr('data-page'));
            });

            self.directSubmitBtn.on('click', function () {
                var $this = $(this);
                if ($this.hasClass('disabled')) {
                    return;
                }
                var value = $.trim(self.directInput.val());
                if (value === '') {
                    return;
                }
                var pageNumber = Number(value);
                if (isNaN(pageNumber) || pageNumber <= 0 || pageNumber > self.maxPageNumber || pageNumber % 1 !== 0) {
                    try {
                        console.log('输入的页码无效');
                    } catch (e) {
                    }
                    self.onInputError(self.directInput.val());
                    self.directInput.val('').focus();
                    return;
                }
                self.onSubmit(pageNumber);
            });
        }
    };
    return Pagination;
});
