var loadScriptPaths = {
  login: {
    development: ['app/common/navigator.js', 'app/login/main.js'],
    release: ['release/login.min.js']
  },
  index: {
    development: ['app/common/navigator.js', 'app/index/main.js'],
    release: ['release/index.min.js']
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