require.config({
    baseUrl : '../scripts/',
    paths : {
        //lib
        jquery : 'libs/public/jquery-1.11.3.min.js',
        json2 :'libs/public/json2.js',
        domReady:'libs/public/domReady.js',
        ajax : 'libs/private/ajax.js',
        jqForm: 'libs/public/jquery.form.js',
        jqPlaceHolder: 'libs/public/jquery.placeholder.min.js',
        mustache: 'libs/public/mustache.js',
        amplify: 'libs/public/amplify.min.js',
        text: 'libs/public/text.js',
        jqueryUI: 'libs/public/jquery-ui.js',
        jqueryDatepicker: 'libs/public/jquery.ui.datepicker-zh_CN.js',
        md5: 'libs/private/md5.js',

        //component
        checkbox : 'component/private/form/form_checkbox.js',
        select : 'component/private/form/form_select.js',
        chooseBox: 'component/private/form/choose_box.js',
        inputValueCtrl : 'component/private/form/input_val_ctrl.js',
        numbox: 'component/private/form/jquery.numbox.js',
        formValidate : 'component/private/form/jquery.formValidate.js',
        paging : 'component/private/paging.js',
        promptUI: 'component/private/promptUI/js/jquery.promptUI.js',
        addressSelect: 'component/private/addressSelect/jquery.addressSelect.js',
        blockUI : 'component/public/blockUI/jquery.blockUI.js',
        datetimepicker : 'component/public/datetimepicker/jquery.datetimepicker.js',

        //app
        navigator: 'app/sgmw/common/navigator.js',
        dialog: 'app/sgmw/common/dialog.js',
        tabNews: 'app/sgmw/home/tab_news.js',
        userDynamic: 'app/sgmw/home/user_dynamic.js',
        toggleMessage: 'app/sgmw/message/toggle_message.js',
        pagination: 'app/sgmw/message/pagination.js'
    },
    shim : {
        ajax : ['jquery'],
        jqForm: ['jquery'],
        jqPlaceHolder: ['jquery'],
        region: ['jquery'],
        numbox:['jquery'],
        amplify:['jquery'],
        promptUI:['jquery'],
        addressSelect:['jquery'],
        formValidate: ['jquery'],
        datetimepicker: ['jquery']
    }
});

<!-- global config -->
define('globalConfig', [], function () {
    return {
        context: {
            path: '${path}',
            ftppath: '${ftp_path}',
            purcharseUrl: 'http://www.baidu.com',
            loginUrl: 'http://www.sina.com#2'
        },
        userState: {
            isLogin: true,
            isEnglish: false
        }
    };
});



