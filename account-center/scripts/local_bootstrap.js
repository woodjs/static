var loadScriptPaths = {
  findPassword1: {
    development: ['app/common/navigator.js', 'app/find_password_1/main.js'],
    release: ['release/find_password_1.min.js']
  },
  findPassword2: {
    development: ['app/common/navigator.js', 'app/find_password_2/main.js'],
    release: ['release/find_password_2.min.js']
  },
  findPassword3: {
    development: ['app/common/navigator.js', 'app/find_password_3/main.js'],
    release: ['release/find_password_3.min.js']
  },
  findPassword4: {
    development: ['app/common/navigator.js'],
    release: ['release/navigator.min.js']
  },
  modifyPassword1: {
    development: ['app/common/navigator.js', 'app/modify_password_1/main.js'],
    release: ['release/modify_password_1.min.js']
  },
  modifyPassword2: {
    development: ['app/common/navigator.js', 'app/modify_password_2/main.js'],
    release: ['release/modify_password_2.min.js']
  },
  modifyPassword3: {
    development: ['app/common/navigator.js'],
    release: ['release/navigator.min.js']
  },
  modifyEmail1: {
    development: ['app/common/navigator.js', 'app/modify_email_1/main.js'],
    release: ['release/modify_email_1.min.js']
  },
  modifyEmail2: {
    development: ['app/common/navigator.js', 'app/modify_email_2/main.js'],
    release: ['release/modify_email_2.min.js']
  },
  modifyEmail3: {
    development: ['app/common/navigator.js'],
    release: ['release/navigator.min.js']
  },
  modifyMobile1: {
    development: ['app/common/navigator.js', 'app/modify_mobile_1/main.js'],
    release: ['release/modify_mobile_1.min.js']
  },
  modifyMobile2: {
    development: ['app/common/navigator.js', 'app/modify_mobile_2/main.js'],
    release: ['release/modify_mobile_2.min.js']
  },
  modifyMobile3: {
    development: ['app/common/navigator.js', 'app/modify_mobile_3/main.js'],
    release: ['release/modify_mobile_3.min.js']
  },
  modifyMobile4: {
    development: ['app/common/navigator.js'],
    release: ['release/navigator.min.js']
  }
};

(function () {
  var requireConfig = require.s.contexts._.config,
    loadModule = loadScriptPaths[pageConfig.pageCode],
    loadScriptSrc, baseUrl = requireConfig.baseUrl, i = 0;

  if (loadModule) {
    if (pageConfig.isLocal) {
      for (; i < loadModule.development.length; i++) {
        loadScriptSrc = baseUrl + loadModule.development[i];
        require([loadScriptSrc]);
      }
    } else {
      require(["jquery"], function () {
        for (; i < loadModule.release.length; i++) {
          loadModule.release[i] = baseUrl + loadModule.release[i];
        }
        require(loadModule.release);
      });
    }
  }
})();