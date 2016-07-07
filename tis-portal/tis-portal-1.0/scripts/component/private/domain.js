define(['jquery', 'ajax', 'pageRender'], function(jq, ajax, pageRender) {
	
	var defaultCfgs = {
		readOnly : false,
		table : $("#data-table"),
		pageBar: $("#data-page-bar"),
		queryArea : $(".query-area"),
		query : {
			paging: {
    			page: 1,
    			size: 10
			},
			filters: {},
			sorts: []
		},
		list : {filterCols:[]},
		add : {allow: true, filterCols:[]},
		mod : {allow: true, filterCols:[]},
		del : {allow: true, filterCols:[]},
	};
	
    var Domain = function(cfg) {
    	this.init(cfg);
    };
    
    Domain.prototype = {
    	init: function(cfg) {
    		var self = this;
    		
    		self.cfgs = {};
    		
    		$.extend(self.cfgs, defaultCfgs, cfg);
    		
    		self.table = self.cfgs.table;
    		self.pageBar = self.cfgs.pageBar;
    		self.queryArea = self.cfgs.queryArea;
    		self.filterArea = self.cfgs.queryArea.find(".filter-area");
    		self.sortArea = self.cfgs.queryArea.find(".sort-area");
    		
    		self.searchBtn = self.cfgs.queryArea.find(".btn-area .search-btn");
    		
    		self.bindEvent();

    		self.renderPageBar();
    		self.list();
    		
    		self.queryCount = 0;
    		self.dataType = {};
    		self.cols = [];
    	},
    	
    	bindEvent: function() {
    		var self = this;
    		
    		self.cfgs.table.on('click', 'tbody button', function() {
    			var el = $(this);
    			var optType = el.attr("opt-type");
    			if ('add' == optType) {
    				self.add(el);
    			} else if ('mod' == optType) {
    				self.mod(el);
    			} else if ('del' == optType) {
    				self.del(el);
    			}
    		});
    		
    		self.filterArea.find(".filter-add-btn").on('click', function() {self.addFilterUnit()});
    		
    		self.sortArea.find(".sort-add-btn").on('click', function() {self.addSortUnit()});
    		
    		self.filterArea.on('click', '.filter-unit a.filter-del-btn', function() {
    			self.delFilterUnit($(this));
    		});
    		self.sortArea.on('click', '.sort-unit a.sort-del-btn', function() {
    			self.delSortUnit($(this));
    		});
    		
    		self.searchBtn.on('click', function() {
    			self.query();
    		});
    	},
    	
    	add: function(el) {
    		var self = this;
    		
    		var inputs = el.closest('tr').find("input");
    		var data = $.extend({}, self.cfgs.add.extraData);
    		var allNull = true;
    		
    		inputs.each(function() {
    			var name = $(this).attr('name');
    			var val = $(this).val();
    			data[name] = self.getDataValue(val, name);
    			if (val !== '') allNull = false; 
    		});
    		
    		if (allNull) {
    			alert('不能添加空的记录');
    			return false;
    		}
    		
    		if (! confirm("确定添加？")) return false;
    		
    		ajax.invoke({
    			url: self.cfgs.add.url,
				contentType: 'application/json',
				type: 'post',
				data: JSON.stringify(data),
				success: function() {
					self.list();
				}
    		});
    	},
    	
    	mod: function(el) {
    		var self = this;
    		
    		var inputs = el.closest('tr').find("input");
    		var data = $.extend({}, self.cfgs.add.extraData);
    		var filter = {};
    		
    		var _filterCols = {};
    		for (var p in self.cfgs.mod.filterCols) {
				var col = self.cfgs.mod.filterCols[p];
				_filterCols[col] = true;
			}
    		
    		inputs.each(function() {
    			var name = $(this).attr('name');
    			if (_filterCols[name]) filter[name] = self.getDataValue($(this).val(), name);
    			else data[name] = self.getDataValue($(this).val(), name);
    		});
    		
    		if (! confirm("确定修改？")) return false;
    		
    		ajax.invoke({
    			url: self.cfgs.mod.url,
				contentType: 'application/json',
				type: 'post',
				data: JSON.stringify([data, filter]),
				success: function() {
					self.list();
				}
    		});
    	},
    	
    	del: function(el) {
    		var self = this;
    		
    		var inputs = el.closest('tr').find("input");
    		var filter = {};
    		
    		var _filterCols = {};
    		for (var p in self.cfgs.del.filterCols) {
				var col = self.cfgs.del.filterCols[p];
				_filterCols[col] = true;
			}

    		inputs.each(function() {
    			var name = $(this).attr('name');
    			if (_filterCols[name]) {
    				filter[name] = self.getDataValue($(this).val(), name);
    			}
    		});
    		
    		if (! confirm("确定删除？")) return false;
    		
    		ajax.invoke({
    			url: self.cfgs.del.url,
				contentType: 'application/json',
				type: 'post',
				data: JSON.stringify(filter),
				success: function() {
					self.list();
				}
    		});
    	},
		
    	list: function() {
			this.pageRender.home();
		},
    	
		renderPageBar: function() {
			var self = this;
			self.pageRender = new PageRender({
				scope: self,
				page: self.cfgs.query.paging.page, 
				limit: self.cfgs.query.paging.size,
				renderTo: self.cfgs.pageBar[0],
				gotoFn: self.doSearch
			});
		},
		
		query : function() {
			var self = this;
			var sels, units, name, val;
			
			// reset
			self.cfgs.query.filters = {};
			self.cfgs.query.sorts = [];
			
			// build filters
			units = self.filterArea.find('.filter-unit');
			units.each(function() {
				name = $(this).find("select").val();
				val = $(this).find("input").val();
				if (val.length == 0) {
					delete self.cfgs.query.filters[name];
				} else {
					self.cfgs.query.filters[name] = val;
				}
			});

			// build sorts
			units = self.sortArea.find('.sort-unit');
			units.each(function() {
				sels = $(this).find("select");
				name = $(sels[0]).val();
				val = $(sels[1]).val();
				self.cfgs.query.sorts.push({
					field : name, 
					asc: val == 'true' ? true : false
				});
			});
			
			self.list();
		},
    	
    	doSearch : function(page) {
    		var self = this;
			
    		self.cfgs.query.paging.page = page;

			if (self.cfgs.list.before) {
				self.cfgs.list.before.call(self);
			}
			
			ajax.invoke({
				url: self.cfgs.list.url,
				contentType: 'application/json',
				type: 'post',
				data: JSON.stringify(self.cfgs.query),
				success: function(data) {
					self.renderData(data.list);
					self.pageRender.setTotal(data.totalRecords).refresh();
					
					if (self.queryCount === 0) self.afterFirstQuery(data);
					
					self.queryCount ++;
					
					if (self.cfgs.list.after) {
						self.cfgs.list.after.call(self, data);
					}
				}
			});
    	},
    	
    	afterFirstQuery : function() {
			var self = this;
			
			var filterUnit = self.filterArea.find(".filter-unit");
			var sortUnit = self.sortArea.find(".sort-unit");
			
			// 填充Select
			var filterSelect = filterUnit.find("select")[0];
			var sortSelect = sortUnit.find("select")[0];
			if (filterSelect.options.length == 0) {
				filterSelect.options.length = 0;
				sortSelect.options.length = 0;
				for (var p in self.cols) {
					var col = self.cols[p];
					filterSelect.options.add(new Option(col, col));
					sortSelect.options.add(new Option(col, col));
				}
			}

			var count = 0, k, p, sel, sel1, sel2, input, sort;
			// filter
			for (k in self.cfgs.query.filters) {
				if (count ++ > 0) filterUnit = self.addFilterUnit();

				sel1 = filterUnit.find("select")[0];
				self.setSelected(sel1, k);
				filterUnit.find("input").val(self.cfgs.query.filters[k]);
			}
			// sort
			count = 0;
			for (p in self.cfgs.query.sorts) {
				sort = self.cfgs.query.sorts[p];
				if (count ++ > 0) sortUnit = self.addSortUnit();

				sel = sortUnit.find("select");
				sel1 = sel[0];
				sel2 = sel[1];
				self.setSelected(sel1, sort.field);
				self.setSelected(sel2, sort.asc);
			}
    	},
    	
    	setSelected: function(sel, val) {
    		var p, opt, optv;
    		
    		var boolType = typeof(val) === 'boolean';
    		
    		for (p=0; p<sel.options.length; p++) {
				opt = sel.options[p];
				optv = opt.value;
				if (boolType) {
					optv = optv === 'true';
				}
				if (optv === val) {
					sel.options.selectedIndex = p;
					break;
				}
			}
    	},
    	
    	addFilterUnit : function() {
    		var self = this, units, filterUnit, targetUnit;
    		units = targetUnit = filterUnit = self.filterArea.find(".filter-unit");
    		if (units.length > 1) {
    			filterUnit = $(units.get(0));
    			targetUnit = $(units.get(units.length - 1));
    		}
    		
    		var clone = filterUnit.clone();
    		clone.append('<a class="filter-del-btn btn small" href="javascript:void(0);">删除</a>');
    		clone.insertAfter(targetUnit);
    		return clone;
    	},
    	
    	delFilterUnit : function(el) {
    		el.parent().remove();
    	},
    	
    	addSortUnit : function() {
    		var self = this, units, sortUnit, targetUnit;
    		units = targetUnit = sortUnit = self.sortArea.find(".sort-unit");
    		if (units.length > 1) {
    			sortUnit = $(units.get(0));
    			targetUnit = $(units.get(units.length - 1));
    		}
    		
    		var clone = sortUnit.clone();
    		clone.append('<a class="sort-del-btn btn small" href="javascript:void(0);">删除</a>');
    		clone.insertAfter(targetUnit);
    		return clone;
    	},
    	
    	delSortUnit : function(el) {
    		el.parent().remove();
    	},
    	
    	renderData : function(data) {
    		var self = this;
    		
    		var _hiddenCols = {};
    		for (var p in self.cfgs.list.hiddenCols) {
				var col = self.cfgs.list.hiddenCols[p];
				_hiddenCols[col] = true;
			}
    		
			var theadHtml = [];
			var tbodyHtml = [];
			var p, k;
			
			var colLenMax = self.getColLenMax(data, _hiddenCols);
			
			for (p in data) {
				var map = data[p];

				tbodyHtml.push('<tr>');
				
				if (! self.cfgs.readOnly) {
					tbodyHtml.push('<td style="text-align:center;">');
					if (self.cfgs.mod.allow) tbodyHtml.push('<button opt-type="mod" title="修改">*</button>');
					if (self.cfgs.del.allow) tbodyHtml.push('<button opt-type="del" title="删除">-</button>');
					tbodyHtml.push('</td>');
				}
				
				for (k in map) {
					if (_hiddenCols[k]) {
						continue;
					}
					
					val = map[k];
					
					if (! self.dataType[k]) self.dataType[k] = self.getDataType(val, k);
					tbodyHtml.push('<td data-field="', k, '"><input type="text" name="'+k+'" value="', val, '"/></td>');
				}
				tbodyHtml.push('</tr>');
				
				if (data.length - 1 == p) {
					// extra row
					tbodyHtml.push('<tr>');
					
					if (self.cfgs.add.allow) tbodyHtml.push('<td style="text-align:center;"><button opt-type="add" title="增加">+</button></td>');
					
					if (! self.cfgs.readOnly) theadHtml.push('<tr><th style="width:70px;">操作</th>');
					
					for (k in map) {
						self.cols.push(k);
						
						if (_hiddenCols[k]) {
							continue;
						}
						
						theadHtml.push('<th style="width:'+colLenMax[k]+'px;">', k, '</th>');
						
						if (self.cfgs.add.allow) tbodyHtml.push('<td data-field="', k, '"><input style="width:'+(colLenMax[k]+10)+'px;" type="text" name="'+k+'" value=""/></td>');
					}
					theadHtml.push('</tr>');
					
					tbodyHtml.push('</tr>');
				}
			}
			
			self.cfgs.table.find("thead").html(theadHtml.join(''));
			self.cfgs.table.find("tbody").html(tbodyHtml.join(''));
	    }, 
	    
	    endsWith : function(str, sub) {
	    	return str.lastIndexOf(sub) == str.length - sub.length;
	    },
	    
	    getDataType : function(val, name) {
	    	var self = this;
	    	if (val === null) return null; 
	    	if (self.endsWith(name, '_DATE')) return "date";
	    	if (self.endsWith(name, '_TIME')) return "date";
	    	return typeof(val);
	    },
	    
	    getDataValue : function(val, name) {
	    	var self = this;
	    	var dataType = self.dataType[name];
	    	if (dataType == 'number') {
	    		return new Number(val);
	    	} else if (dataType == 'date') {
	    		// FIXME 返回日期类型
	    		return val;
	    	}
	    	return val;
	    },
	    
	    getColLenMax : function(data, _hiddenCols) {
			var colLenMax = {};
			var p, k, val, maxLen, len;
			
			// 得到值的长度
			var getLen = function(val) {
				if (! val) return 1;
				if (typeof(val) == 'object') {
					return val.toString().length;
				} else if (typeof(val) == 'number') {
					return 10;
				} else if (typeof(val) == 'string') {
					return val.length;
				} else {
					return 20;
				}
			};
			
			for (p in data) {
				var map = data[p];
				for (k in map) {
					if (_hiddenCols[k]) {
						continue;
					}
					val = map[k];
					maxLen = colLenMax[k] || 0;
					len = getLen(val);
					if (len > maxLen) colLenMax[k] = len;
				}
				if (data.length - 1 == p) {
					for (k in map) {
						val = k;
						len = getLen(val);
						maxLen = colLenMax[k];
						if (len > maxLen) colLenMax[k] = len;
					}
				}
			}
			for (p in colLenMax) {
				len = colLenMax[p];
				if (len > 100) colLenMax[p] = len * 2;
				else if (len > 50) colLenMax[p] = len * 3;
				else if (len > 40) colLenMax[p] = len * 4;
				else if (len > 30) colLenMax[p] = len * 5;
				else colLenMax[p] = len * 10;
			}
			
			return colLenMax;
	    }
    };

	return Domain; 
});