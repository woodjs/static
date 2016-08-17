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
    development: ['app/common/navigator.js', 'app/find_password_4/main.js'],
    release: ['release/find_password_4.min.js']
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