require(['globalConfig', 'toggleMessage', 'pagination', 'jquery', 'ajax', 'mustache', 'json2'], function(globalConfig, toggleMessage, Pagination, $, ajax, Mustache) {
	var path = globalConfig.context.path;
	
	var home = {
        init: function() {
            var self = this;
            self.initComponent();
            self.buildElement();
            self.buildTemplate(); 
        },
        initComponent: function() {
            var self = this;
            self.loadMessage(1);
        },
        buildElement: function () {
            var self = this;
            self.$blockMessageBox = $('#block-message-box');
        },
        buildPagination: function (curNum, totalNum) {
            var self = this;
            var pagination = new Pagination({
                currentPageNumber: curNum,  //当前页码
                totalRecordsNumber: totalNum,  //总记录数
                pageSize: 8,  //每页显示记录数
                firstBtn: true,  //首页按钮  默认true
                prevBtn: true,  //前翻页按钮  默认true
                nextBtn: true,  //后翻页按钮  默认true
                lastBtn: true,  //末页按钮  默认true
                begin: 0,  //自然数  默认 2
                range: 3,  //只能是正奇数  默认 5
                end: 0,  //自然数  默认 0
                direct: false,  //直达功能  默认true
                ellipsis: true,  //省略号  默认true（如果begin或end不为0此值将忽略用户设置始终为true）
                template: $('#pagination-tpl').html(),  //模版
                onSubmit: function (pageNumber) {
                    self.loadMessage(parseInt(pageNumber));
                },
                onInputError: function(value) {
                    alert('您输入的页码无效，请重新输入！');
                }
            });
            $('#pagination-container').html(pagination.element);
        },
        buildTemplate: function () {
            var self = this;
            self.template = $('#item-message-template').html();
        },
        loadMessage: function (pageNumber) {
            var self = this;
            ajax.invoke({
                url: path + '/user/msg/list-page',
                type: 'post',
                data: JSON.stringify({
                    filters: {
                    	
                    },
                    sort: [
                        {field: 'time', asc: false}
                    ],
                    paging: {
                        page: pageNumber,
                        size: 8
                    }
                }),
                dataType: 'json',
                success: function(res) {
                	var self = home;
                    self.$blockMessageBox.html(Mustache.render(self.template, res));
                    self.buildPagination(pageNumber, parseInt(res.total));
                    toggleMessage.init();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    };
    home.init();
});