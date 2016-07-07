var loadScriptPaths = {
  pageIndex: {
    development: ['app/common/navigator.js', 'app/home/main.js'],
    release: ['navigator.min.js', 'pageIndex.min.js']
  },
  pageMessage: {
    development: ['app/common/navigator.js', 'app/message/main.js'],
    release: ['navigator.min.js', 'pageMessage.min.js']
  },
  pageContact: {
    development: ['app/common/navigator.js'],
    release: ['navigator.min.js']
  },
  pageStandard: {
    development: ['app/common/navigator.js'],
    release: ['navigator.min.js']
  },
  pageVersion: {
    development: ['app/common/navigator.js'],
    release: ['navigator.min.js']
  }
};

(function () {
  if (typeof(pageConfig) == 'undefined') return;
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
      baseUrl = baseUrl.replace(/scripts\//g, '');
      require(['jquery'], function () {
        for (; i < loadModule.release.length; i++) {
          loadModule.release[i] = baseUrl + 'release/scripts/' + loadModule.release[i] + '?v=' + pageConfig.versionCode;
        }
        require(loadModule.release);
      });
    }
  }
})();