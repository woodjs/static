
define(["globalConfig", "jquery"], function (settings) {
    var CATEGORYS = {
        "brand": "品牌",
        "series": "目录",
        "year": "年份",
        "model": "车型",
        "group": "主组",
        "image": "图例",
        "legend": "左图右数据",
        "buy": "购买",
        "favorites": "书签",
        "vsn-search": "VSN查询",
        "part-number-search": "零件编号查询",
        "legend-search": "图例编号查询",
        "advanced-search": "高级查询",
        "super-session-search": "替换查询",
        "info-search": "信息检索",
        "build-order":"生成订单",
        "search-order": "历史订单-查询订单编号",
        "into-order": "进入订单管理页面",
        "bookmark": "书签管理",
        "history": "历史管理",
        "tree": "树导航",
        "crumbs": "面包屑导航",
        "large-icons": "大图模式",
        "detial-icons": "小图详细模式"

    },
    ACTIONS = {
        "search": "搜索",
        "expand": "展开",
        "add": "添加",
        "view": "查看",
        "paging": "翻页",
        "delete": "删除",
        "create": "生成",
        "loading": "加载",
        "open": "弹出",
        "export": "导出"
    },
    EVENTS = {
        "drag": "拖拽",
        "click": "点击",
        "enter": "回车"
    },
    local = window.location,
    url = settings.context.trackUrl,
    trackEnable = settings.context.trackEnabled,
    lang = settings.context.lang,
    localUrl = local.pathname + "/" + (typeof local.search === "undefined" ? "" : local.search);

    return {

        /**
         * description: The user operation is sent to the server side
         * @category {string} Page category operation area 
         * @action {string} user operation action
         * @event {string} user operation event type (click 、dblclick...)
         * @label {string} The current operation object labels
         * @value {string} User behavior description
         */
        publish: function (category, action, event, value) {
            var params = {
                url: localUrl,
                cat: CATEGORYS[category],
                name: ACTIONS[action],
                type: EVENTS[event],
                parm: value,
                lang: lang
            };
            if (Boolean(trackEnable))
                $.post(url, params);
        }

    };
});