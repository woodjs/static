define(['globalConfig', 'jquery', 'ajax', 'json2', 'domReady!'], function (globalConfig, $, ajax) {
	var path = globalConfig.context.path;
    var message = {
        init: function () {
            var self = message;
            self.getAnchor();
            self.buildElement();
            self.bindEvent();
            if (self.hasAnchor) {
            	$('[data-id="'+ self.hash +'"]').click();
            }
        },
        buildElement: function () {
            var self = message;
            self.$boxMessage = $('#block-message-box');
            self.$btnCtlShowList = self.$boxMessage.find('dt');
        },
        bindEvent: function () {
            var self = message;
            self.$btnCtlShowList.on({
                click: function () {
                    var $temp = $(this).closest('.item-message');
                    var $dt = $temp.find('dt');
                    var id = $dt.data('id');
                    if (!$dt.is('.readed')) {
                        $dt.addClass('readed');
                        self.stampReaded(id);
                    }
                    if ($temp.is('.collapsed')) {
                        $temp.find('dd').slideDown(100);
                        $temp.removeClass('collapsed');
                    } else {
                        $temp.find('dd').slideUp(100);
                        $temp.addClass('collapsed');
                    }
                }
            });
        },
        getAnchor: function () {
        	var hash = window.location.hash.slice(1);
        	if (!hash) {
        		self.hasAnchor = false;
        	} else {
        		self.hasAnchor = true;
        		self.hash = hash;
        	}        	
        },
        stampReaded: function (id) {
            var self = this;
            //ajax.invoke({
            //    url: path + '/user/msg/read',
            //    type: 'post',
            //    data: JSON.stringify([id]),
            //    dataType: 'json',
            //    success: function(res) {
            //        console.log(res.success);
            //    },
            //    error: function (err) {
            //        console.log(err);
            //    }
            //});
        }
    };

    return {
        init: message.init
    };
});
