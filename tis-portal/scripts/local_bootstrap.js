var loadScriptPaths = {
    pageIndex: {
        development: ['app/sgmw/common/navigator.js', 'app/sgmw/home/main.js'],
        release: ['release/navigator.min.js']
    },
	pageMessage: {
		development: ['app/sgmw/common/navigator.js', 'app/sgmw/message/main.js'],
		release: ['release/navigator.min.js']
	},
	pageContact: {
		development: ['app/sgmw/common/navigator.js'],
		release: ['release/navigator.min.js']
	},
	pageStandard: {
		development: ['app/sgmw/common/navigator.js'],
		release: ['release/navigator.min.js']
	}
};

(function() {
    var requireConfig = require.s.contexts._.config,
        loadModule = loadScriptPaths[pageConfig.pageCode],
        loadScriptSrc, baseUrl = requireConfig.baseUrl, i = 0;
    
    if(loadModule) {
	    if (pageConfig.isLocal) {
	    	for(; i < loadModule.development.length; i++){
	    		loadScriptSrc = baseUrl + loadModule.development[i];
	            require([loadScriptSrc]);
	    	}
	    } else {
	        require(["jquery"], function() {
	        	for(; i < loadModule.release.length;i++){
	        		loadModule.release[i] = baseUrl + loadModule.release[i];
	        	}
	        	require(loadModule.release);
	        });
	    }
    }
})();