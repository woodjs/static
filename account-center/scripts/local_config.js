require.config({
  baseUrl: '../scripts/',
  paths: {
    //lib
    jquery: 'libs/public/jquery-1.11.3.min.js',
    json2: 'libs/public/json2.js',
    domReady: 'libs/public/domReady.js',
    ajax: 'libs/private/ajax.js',
    jqForm: 'libs/public/jquery.form.js',
    jqPlaceHolder: 'libs/public/jquery.placeholder.min.js',
    mustache: 'libs/public/mustache.js',
    ejs: 'libs/public/ejs-1.0.0.min.js',
    amplify: 'libs/public/amplify.min.js',
    text: 'libs/public/text.js',
    jqueryUI: 'libs/public/jquery-ui.js',
    jqueryDatepicker: 'libs/public/jquery.ui.datepicker-zh_CN.js',
    md5: 'libs/private/md5.js',

    //component
    checkbox: 'component/private/form/form_checkbox.js',
    select: 'component/private/form/form_select.js',
    chooseBox: 'component/private/form/choose_box.js',
    inputValueCtrl: 'component/private/form/input_val_ctrl.js',
    numbox: 'component/private/form/jquery.numbox.js',
    formValidate: 'component/private/form/jquery.formValidate.js',
    paging: 'component/private/paging.js',
    promptUI: 'component/private/promptUI/js/jquery.promptUI.js',
    addressSelect: 'component/private/addressSelect/jquery.addressSelect.js',
    blockUI: 'component/public/blockUI/jquery.blockUI.js',
    datetimepicker: 'component/public/datetimepicker/jquery.datetimepicker.js',

    //app
    navigator: 'app/common/navigator.js',

  },
  shim: {
    ajax: ['jquery'],
    jqForm: ['jquery'],
    jqPlaceHolder: ['jquery'],
    region: ['jquery'],
    numbox: ['jquery'],
    amplify: ['jquery'],
    promptUI: ['jquery'],
    addressSelect: ['jquery'],
    formValidate: ['jquery'],
    datetimepicker: ['jquery']
  }
});

<!-- global config -->
define('globalConfig', [], function () {
  var expiringServices = "";
  return {
    context: {
      path: '/tis-home',
      lang: 'zh_CN',
      ftppath: '',
      purcharseUrl: 'http://boss.dev.servision.com.cn/customer/',
      loginUrl: '/tis-home/login',
      oemCode: 'sgmw',
      userActivityPath: 'activity/top/sgmw/4'
    },
    userState: {
      isEnglish: false,
      isLogin: false,
      needRemindUserExpireDate: false,
      expiringServices: expiringServices,
      needRemindUserUseLogger:false
    }
  };
});

var _i18n_error = {
  '4_1_1': '请输入您的TIS用户名、邮箱或手机号',
  '4_1_2': '请输入验证码',
  '4_1_3': '请输入正确的TIS用户名、邮箱或手机号',
  '4_1_4': '输入的验证码不正确',
  '4_2_1': '您输入的验证码不正确或已过期',
  '4_2_2': '校验码已发出，请注意查收短信，如果没有收到，你可以在60秒后要求系统重新发送',
  '4_2_3': '校验码已发出，请注意查收邮件，如果没有收到，你可以在5分钟后要求系统重新发送',
  '4_2_4': '请先输入用户名',
  '4_2_5': '验证码发送失败，请稍后重试',
  '4_3_1': '请输入新的密码',
  '4_3_2': '请输入确认密码',
  '4_3_3': '请输入8-20位的长度的密码',
  '4_3_4': '8-20位，必须要要包含字母、数字和特殊字符（@，！，#，&）例如：xie98@12',
  '4_3_5': '8-20位，必须要要包含字母、数字 ，例如：xie982312',
  '4_3_6': '两个密码不一致，请重新输入'
};


