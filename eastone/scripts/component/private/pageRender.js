/**
 * 分页渲染器
 * @author: wubo
 * @createDate: 2010-8-12
 * @version: 1.0
 */
define(['jquery'], function (jq) {
	
	PageRender = function(params) {
		
		var _getId = function(id){
			if(id)return id;
			if(! PageRender.IdSequence){
				PageRender.IdSequence = 0;
			}
			return "PageRender_"+(PageRender.IdSequence ++);
		};
		var idstr = _getId(params.id);
		window[idstr] = this;
		
		var homestr = params.home || "";
		var endstr = params.end || "";
		var nextstr = params.next || "下一页";
		var laststr = params.last || "上一页";
		var scope = params.scope || window;
		
		var start = params.start || 0;
		var limit = params.limit || 10;
		var gotoFn = params.gotoFn || function(){}
		var noDataInfo = params.noDataInfo;
		
		this.currentPage = 1;
		this.totalPages = 0;
		this.total = 0;
		
		this.toString = function(el) {
			//alert("Start:"+start+"\tLimti:"+limit+"\tTotal:"+this.total+"\tCurrentPage:"+this.currentPage+"\tTotalPages:"+this.totalPages);
			this.totalPages = (this.total ==0 ? 0 : Math.floor( this.total / limit + (this.total % limit == 0 ? 0 : 1) ));
			
			if(this.total > 0) {
				var str = [];
				//分页按钮
				if(this.currentPage > 1){
					str.push("<a class='page-ctrl-prev' href='javascript:void(0);' onclick='javascript:window[\""+idstr+"\"].last();'>"+laststr+"</a>");
				}else{
					str.push("<a class='page-ctrl-prev disabled' href='javascript:void(0);'>"+laststr+"</a>");
				}
				
				var pvc = 2; //page view count
				var prevCount = pvc, nextCount = pvc;
				var leftCount = this.currentPage - 1;
				var rightCount = this.totalPages - this.currentPage;
				if(this.currentPage <= pvc) {
					prevCount = leftCount;
					nextCount += pvc - prevCount;
					if(nextCount > rightCount) {
						nextCount = rightCount;
					}
				}
				if(rightCount < pvc) {
					nextCount = rightCount;
					prevCount += pvc - nextCount;
					if(prevCount > leftCount) {
						prevCount = leftCount;
					}
				}
				
				for (var p=1; p<this.currentPage && p<3; p++) {
					str.push("<a href='javascript:void(0);' class='page-link' onclick='javascript:window[\""+idstr+"\"].position("+p+");'>"+p+"</a>");
				}
				
				if (this.currentPage-pvc > 3) {
					str.push('<span class="ellipsis">...</span>');
				}
				for(var p=this.currentPage - prevCount; p<this.currentPage; p++){
					if (p<=2) continue;
					if(p>0)str.push("<a href='javascript:void(0);' class='page-link' onclick='javascript:window[\""+idstr+"\"].position("+p+");'>"+p+"</a>");
				}
				str.push('<span class="current">'+this.currentPage+'</span>');
				for(var p=this.currentPage+1; p<=this.currentPage+nextCount; p++){
					str.push("<a href='javascript:void(0);' class='page-link' onclick='javascript:window[\""+idstr+"\"].position("+p+");'>"+p+"</a>");
				}
				if (this.currentPage + nextCount < this.totalPages) str.push('<span class="ellipsis">...</span>');
				if(this.currentPage < this.totalPages && this.totalPages > 1){
					str.push("<a class='page-ctrl-next' href='javascript:void(0);' onclick='javascript:window[\""+idstr+"\"].next();'>"+nextstr+"</a>");
				}else{
					str.push("<a class='page-ctrl-next disabled' href='javascript:void(0);'>"+nextstr+"</a>");
				}
				str.push('<span class="total">共'+this.totalPages+'页，</span>');
				str.push('<span>到第<input type="text" id="'+idstr+'_pagenum" class="text-input-box page-input" onkeydown="javascript:if(event.keyCode==13){window[\''+idstr+'\'].changePage();return false;}">页</span>');
				str.push('<a href="javascript:;" class="btn go-to" onclick="javascript:window[\''+idstr+'\'].changePage();return false;">跳转</a>');
				return str.join('');
			}
			return noDataInfo || "";
		};
		this.refresh = function(el) {
			this.render(el || params.renderTo);
		};
		this.render = function(el) {
			if(typeof(el) == "string") {
				document.getElementById(el).innerHTML = this.toString();
			} else {
				el.innerHTML = this.toString();
			}
			params.renderTo = el;
		};
		this.setTotal = function(total) {
			this.total = total;
			return this;
		};
		this.setLimit = function(l) {
			limit = parseInt(l);
			start = this.curretnPage * limit - limit;
			return this;
		};
		this.next = function() {
			if(this.currentPage < this.totalPages) {
				this.position(this.currentPage + 1);
			}
			return this;
		};
		this.last = function() {
			if(this.currentPage > 1) {
				this.position(this.currentPage - 1);
			}
			return this;
		};
		this.home = function() {
			this.position(1);
			return this;
		};
		this.end = function() {
			this.position(this.totalPages);
			return this;
		};
		this.changePage = function() {
			var el = document.getElementById(idstr+"_pagenum");
			var page = el.value;
			if(page && /\d+/.test(page)) {
				page = parseInt(page);
				if(page > 0 && page <= this.totalPages) {
					this.position(page);
					return false;
				}
			}
			alert('无效的页码', 'warn');el.value = '';
		};
		this.position = function(page) {
			this.currentPage = page;
			gotoFn.call(scope || window, page, limit)
		};
	};
	
	return PageRender;
});
