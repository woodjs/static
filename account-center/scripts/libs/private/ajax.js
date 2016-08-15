/*
 name: jQuery ajax
 desc: Packaging the jquery ajax method
*/
define(["globalConfig", "json2"], function(globalConfig) {

    var i18n = {
        "zh_CN": {
            "100": "未知错误",
            "101": "被请求的页面需要用户名和密码",
            "102": "请求未完成,服务器遇到不可预知的情况"
        },
        "en_US": {
            "100": "Unknown error",
            "101": "The requested page needs a username and password",
            "102": "The request was not completed, the server encounters unpredictable circumstances"
        }
    };

    var trans = i18n[globalConfig.context.lang || "zh_CN"];

    var defaultOpts = {
        cache: true,
        data: {},
        timeout: 60000,
        dataType: "json",
        type: "get",
        traditional: false,
        contentType: 'application/json'
    };

    return {
        /**
         * To encapsulate the jquery ajax main method.
         * @param {object} options is ajax configuration parameters.
         * @return {object} Throw an XHR object.
         */
        "invoke": function(options) {
            var self = this,
                opts = $.extend({}, defaultOpts, options || {}),
                jqXHR = $.ajax({
                    url: opts.url,
                    contentType: opts.contentType,
                    type: opts.type,
                    cache: opts.cache,
                    data: opts.data,
                    timeout: opts.timeout,
                    dataType: opts.dataType,
                    beforeSend: opts.beforeSend,
                    complete: opts.complete,
                    traditional: opts.traditional,
                    success: function(root) {
                        self.success(opts, root);
                    },
                    error: function(error) {
                        self.error(opts, error);
                    }
                });

            return jqXHR;
        },

        /**
         * The callback function called ajax request is success.
         * @param {object} options is ajax configuration parameters.
         * @param {object} The server returns the result
         */
        "success": function(options, root) {
            var self = this,
                root = root || {};
            if (typeof options.success === 'function') {
                options.success.apply(self, [root]);
            }
        },

        /**
         * The callback function called ajax request is error.
         * @param {object} options is ajax configuration parameters.
         * @param {object} The server returns the error info
         */
        "error": function(options, error) {
            var self = this,
                responseText = error.responseText;
            switch (error.status) {
                case 0:
                    break;
                case 401:
                	console.log(trans["101"]);
                    //location.href = location.href;
                    break;
                default:
                    try {
                        error = JSON.parse(responseText || '{}');
                    } catch(e) {
                        error = {};
                    }
                    if (typeof options.failed === 'function') {
                        options.failed.apply(self, [error]);
                    } else {
                        console.log(error.message);
                    }
                    break;
            }
        }
    };

});