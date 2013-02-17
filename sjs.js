/**
 * build by awen  71752352@qq.com
 */
;(function(W,undefined){
	var D=W.document,
		_$$=W.$?W.$:undefined,
		wn=W.navigator,
		wl=W.location,
		ua=wn.userAgent.toLowerCase(),
		av=wn.appVersion,
 		type=function(o){
			return o!=undefined?(Object.prototype.toString.call(o)).slice(8,-1):'undefined';
		},
		RAF = W.requestAnimationFrame|| W.mozRequestAnimationFrame|| W.webkitRequestAnimationFrame|| W.msRequestAnimationFrame|| W.oRequestAnimationFrame|| function(callback) {setTimeout(callback, _f);},
		/*基础工具类*/
		UT={
			noConflict:function(){
				if (_$$) {W.$=_$$;}
			},
			uniqueId:function(){
				var t=new Date().getTime(),r=parseInt(Math.random()*10000);
				return t*10000+r;
			},
			type:type,
			isArray:function(o){
				return type(o)==='Array';
			},
			isBoolean:function(o){
				return type(o)==='Boolean';
			},
			isString:function(o){
				return type(o)==='String';
			},
			isFunction:function(o){
				return type(o)==='Function';
			},
			isNumeric:function(o){
				return !isNaN( parseFloat(o) ) && isFinite( o );
			},
			isXML: function(el) {
	            var doc = el.ownerDocument || el;
	            return doc.createElement("p").nodeName !== doc.createElement("P").nodeName;
	        },
			isPlainObject:function(o){
				return type(o)==='Object';
			},
			isEmptyObject: function(o) {
				var name;
				for ( name in o ) {
					return false;
				}
				return true;
			},
			/**正则*/
			isEmptyString:function(s){
				return (/^\s*$/ig).test(s);
			},
			trim:function(s){
				return s.replace(/(^\s*)|(\s*$)/g, ""); 
			},
			/**核心啊，代码换效率*/
			each:function(o,f){
				if (sjs.isArray(o)) {
					for (var i = 0,l=o.length; i < l; i++) {
						if(f.call(o,i,o[i])===false){
							break;
						}
					}
				}else{
					for (var k in o) {
						if (o[k]!=undefined) {
							if(f.call(o,k,o[k])===false){
								break;
							}
						}
					}
				}
			},
			grep:function(o,c,s){
				var ret=[],rs=s===true?false:true;
				if(o&&c) {
					sjs.each(o,function(i,n){
						if(c.call(o,n,i)===rs){
							ret.push(n);
						}
					});
				}
				return ret;
			},
			merge:function(f,s){
				return f=f.concat(s);
			},
			map:function(o,f){
				if (o&&f) {
					var t=[];
					for (var i = 0,l=o.length; i <l; i++) {
						var v=f.call(o,o[i],i);
						if (v==null) {return true}
						if (sjs.isArray(v)) {
							sjs.merge(t,v);
						}else{
							t.push(v);
						}
					}
					o=t;
				}
				return o;
			},
			inArray:function(v,o){
				if (Array.prototype.indexOf) {
					  return Array.prototype.indexOf.call(o,v);  
				}else{
					for (var i=i==undefined?0:i,l=o.length; i < l; i++) {
						if (o[i]==v) {return i}
					}
				}
				return -1;
			},
			unique:function(o){
				var j={},r=[];
				for (var i = 0; i < o.length; i++) {
					j[o[i]]=o[i];
				}
				sjs.each(j,function(n,i){
					r.push(i);
				});
				return r;
			},
			/**从数组或者对象中移除*/
			remove:function(o,k,isv){
				var ik=k;
				if (isv===true) {
					ik=null;
					for (var i in o) {
						if (o[i]==k) {
							ik=i;
							break;
						}
					}
				}
				if (ik!==undefined&&ik!==null) {
					if (sjs.isArray(o)) {
						o.splice(ik,1);
					}
					if (sjs.isPlainObject(o)) {
						delete o[ik];
					}
				}
				return o;
			},
			/**json*/
			JSONS:{
				parse:function(d){
					if ( typeof d !== "string" || !d ) {  
		        		return null;  
					}
					d =sjs.trim(d);
					return W.JSON?JSON.parse(d):eval(d);
				},
				stringify:function(O){
					if (!O) {return '';}
					if (W.JSON) {return W.JSON.stringify(O);}
					var S = [],J = "";
					switch(type(O)){
						case 'Array':
							for (var i = 0; i < O.length; i++){
					       		S.push(this.stringify(O[i])); 
						    }
						    J = '[' + S.join(',') + ']'; 
						break;
						case 'Date':
						 	J = "new Date(" + O.getTime() + ")"; 
						break;
						case 'RegExp':
						case 'Function':
							J = O.toString(); 
						break;
						case 'Object':
						  for (var i in O) { 
						       O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? this.stringify(O[i]) : O[i]); 
						       S.push(i + ':' + O[i]); 
						   } 
						   J = '{' + S.join(',') + '}'; 
						break;
					}
					return J; 
				},
				parseQuery:function(s){
					var o={};
					var os=s.split("&");
					for(var i=0,len=os.length;i<len;i++){
						if(os[i].indexOf("=")>-1){
							var oi=os[i].split("=");
							if(!( (/^\s*$/ig).test(o[0]))){
								var v=oi[1].trim();
								if(v=="null"||v=="undefined"){v="";}
								o[oi[0]]=v;
							}
						}
					}
					return o;
				},
				toQuery:function(o){
					var s="";
					for(var k in o){
						s+=sjs.isEmptyString(s)?"":"&";
						var v=o[k]==null?"":o[k];
						s+=k+"="+v;
					}
					return s;
				},
				count:function(o){
					var n=0;
					for (var k in o) {
						n++;
					}
					return n;
				}
			},
			/**帧动画对象*/
			raf:function(frame,fn) {
				//run 动画状态  0初始 1运动 2暂停 3停止
				var st=new Date().getTime(),_f=Math.ceil(1000/frame),run=0,
					cnt=0,args=Array.prototype.slice.call(arguments,2);args.unshift(cnt);
				instance=this;
	 			function go(){
	 				if (run<2) {
	 					var _t=new Date().getTime();
						var _d=_t-st;
						if (_d>=_f) {
							st=_t;
							cnt++;
							args[0]=cnt;
							if(fn.apply(instance,args)===false){
								return;
							};
						};
						RAF(go);
	 				};
				}
				this.sign=null;
				this.start=function(){
					if (run==0) {
						run=1;
						RAF(go);
					};
				}
				this.pause=function(){
					if (run==1) {
						run=2;
					};
				}
				this.resume=function(){
					if (run==2) {
						run=1;
						RAF(go);
					};
				}
	 			this.stop=function(){
	 				run=3;
				}
				return this;
			}
		},
		//构建sjs对象
		sjs=function(s){return new sjs.fn.init(s);};
		//对象原型
		sjs.fn=sjs.prototype={
			constructor: sjs,
			selector: "",
			length: 0,
			init:function(s){
				if (W==this) {return new sjs(s)};
				if (!s) {
					return this;
				}
				/**如果是函数则为ready*/
				if (sjs.isFunction(s)) {
					document.addEventListener("DOMContentLoaded", function(e) {
						s.call(W,sjs);
					});
				}
				// sjs(DOMElement)
				if (s.nodeType) {
					this[0] = s;
					this.length = 1;
					//dom对象的唯一标志
					id(s);
				}
				// sjs(string)
				if ( typeof s === "string" ) {
					if ( s.charAt(0) === "<" && s.charAt( s.length - 1 ) === ">" && s.length >= 3 ) {
						//暂时不处理html代码
					} else {
						var doms=D.querySelectorAll(s);
						this.length = doms.length;
						for (var i = 0,len=doms.length; i<len; i++) {
							id(doms[i]);
							this[i]=doms[i];
						}
						this.selector=s;
					}
				}
				return this;
			},
			get:function(i){
				var gs=Array.prototype.slice.call(this,0,this.length);
				return i==undefined?gs:gs[i];
			},
			index:function(){
				var d=this[0],cs=d.parentNode.children;
				return sjs.inArray(d,cs);
			}
		}
		sjs.fn.init.prototype = sjs.fn;
		//主要扩展方法
		sjs.extend=sjs.fn.extend=function(){
			var to=arguments[0]||{},options,len=arguments.length,deep=false,ci=0,src,copy;
			//第一个参数如果是boolean型的话，则代表是否深度复制，扩充对象为第二个参数
			if(typeof to === "boolean") {
				ci++;
				deep=true;
				to=arguments[ci]||{};
			}
			//to类型检测
			if (typeof to != 'object') {
				to={};
			}
			//如果只有一个object对象则扩充对象为本身
			if (len==ci+1) {
				to=this;
			}
			//循环所有要继承的对象
			for (;ci<len;ci++){
				 if ((options=arguments[ci])!=null) {
				 	for (var key in options) {
				 		src=to[key];
				 		copy=options[key];
				 		//防止两个对象互相包含，造成无休止循环
				 		if (to==copy) {
				 			continue;
				 		}
				 		//深度复制
				 		if (deep&&copy&&(UT.isArray(copy)||UT.isPlainObject(copy))) {
				 			if (UT.isPlainObject(copy)) {
				 				src= src && UT.isArray(src) ? src : {};
				 			}
				 			if (UT.isArray(copy)) {
				 				src= src && UT.isPlainObject(src) ? src : [];
				 			}
				 			to[key] = sjs.extend( deep, src, copy );
				 		}else{
				 			to[key]=copy;
				 		}
				 	};
				 };
			}
			return to;
		}
		///////////////////////////////////sjs对象扩展
		//获取dom对象的唯一标志
		function id(d){
			return d._hash?d._hash:(d._hash=UT.uniqueId());
		}
		//将CSS属性名转换成驼峰式
		function camelize(s) {
		 return s.replace(/-[a-z]/gi,function (c) {
		  return c.charAt(1).toUpperCase();
		 });
		}
		//获取class值
		function gc(d,n){
			return W.getComputedStyle(d).getPropertyValue(n)||'';
		}
		//检测是否含有className
		function hc(d,c){
			var r=new RegExp('(\\s|^)'+c+'(\\s|$)');
			return r.test(d.className);
		}
		//将数组或者字符串 统一成数组
		function ba(s,b){
			b=b?b:' ';
			return s==undefined?s:sjs.isArray(s)?s:s.split(b);
		}
		function dc(d,c){
			if (c&&hc(d,c)) {
				var r=new RegExp('(\\s|^)'+c);
				d.className=d.className.replace(r,'');
			}
		}
		//获取元素数据
		function gd(d,k){
		 	var hash=id(d),ds=_domdatas[hash]||undefined;
		 	return k==undefined?ds:(ds&&ds[k])?ds[k]:undefined;
		}
		//设置元素数据
		function sd(d,k,v){
			var hash=id(d);
			if (!_domdatas[hash]) {_domdatas[hash]={};}
			_domdatas[hash][k]=v;
		}
		//删除数据
		function dd(d,k){
			var hash=id(d),ds=_domdatas[hash]||undefined;
			if (ds){
				if(k){
					if (_domdatas[hash][k]) {
						delete _domdatas[hash][k];
					}
				}else{
					delete _domdatas[hash];
				}
			}
		}
		//ajax回调函数绑定
		function ajaxcall(xhr,s){
			if (!s || !xhr) {return false;};
			if (s.success) {
				xhr.onload=function(e){
					var res=null;
					switch(s.dataType){
						case 'json':
						case 'script':
							res=eval(this.responseText);
						break;
						default:
							res=this.response;
						break;
					}
					s.success.call(s.context,res,this);
				}
			}
			if (s.abort) {
				xhr.onabort=function(e){
					s.abort.call(s.context,this);
				}
			}
			if (s.error) {
				xhr.onerror=function(e){
					s.error.call(s.context,this);
				}
			}
			if (s.beforeSend) {
				xhr.onloadstart=function(e){
					s.beforeSend.call(s.context,this);
				}
			}
			if (s.complete) {
				xhr.onloadend=function(e){
					s.complete.call(s.context,this);
				}
			}
			if (s.progress) {
				xhr.onprogress=function(e){
					s.progress.call(s.context,e);
				}
			}
			if (s.upProgress){
				xhr.upload.onprogress=function(e){
					 s.upProgress.call(s.context,e);
				}
			}
		}
		//dom扩展
		var _domdatas={},DOMS={
	 		data:function(k,v){
	 			if (this.length>0) {
					var len=arguments.length;
		 			switch(len){
		 				case 0:
		 				case 1:
		 					return gd(this[0],k);
		 				break;
		 				default:
		 					this.each(function(d){
		 						sd(d,k,v)
		 					});
		 				break;
		 			}
	 			}
	 			return this;
	 		},
	 		/**删除数据,name可以使某个key，也可以使key数组，或者空格分开的key串*/
	 		removeData:function(name){
	 			if (sjs.isString(name) && !sjs.isEmptyString(name)) {
	 				name=name.split(" ");
	 			}
	 			return this.each(function(d){
 					if (sjs.isArray(name)) {
 						sjs.each(name,function(i,n){
 							dd(d,n)
		 				});
		 			}else{
		 				dd(d);
 					}
	 			});
	 		},
	 		html:function(s){
	 			if (this.length==0) {
	 				return this;
	 			}
	 			if (!s) {
	 				return this[0].innerHTML;
	 			}
	 			var h=sjs.isString(s)?s:null,isfunc=sjs.isFunction(s);
	 			return this.each(function(d,i){
	 				if (isfunc) {
	 					h=s.call(this,i,this.innerHTML);
	 					if (!h) {return true;};
	 				};
	 				this.innerHTML=h;
	 			});
	 		},
	 		val:function(s){
	 			return s==undefined?(this[0].value||''):this.each(function(d,i){
	 				if (sjs.isFunction(s)) {
	 					var r=s.call(d,i,d.value);
	 					if (r!=undefined) {
	 						d.value=r;
	 					}
	 				}else{
	 					d.value=s;
	 				}
	 			});
	 		},
	 		text:function(s){
	 			if (s) {
	 				return this.each(function(d,i){
	 					if (sjs.isFunction(s)) {
	 						var r=s.call(d,i,d.textContent);
	 						if (r!=undefined) {
	 							d.textContent=r;
	 						}
	 					}else{
	 						d.textContent=s;
	 					}
	 				});
	 			}else{
	 				var ret='';
	 				this.each(function(d){
	 					ret+=d.textContent;
	 				});
	 				return ret;
	 			}
	 		},
	 		css:function(a,b){
	 			if (a==undefined||this.length==0) {return undefined};
	 			if (sjs.isString(a)) {
	 				var isf=sjs.isFunction(b),a=camelize(a);
	 				return b==undefined?gc(this[0],a):this.each(function(d,i){
	 					var v=isf?(b.call(this,i,gc(this,a))):b;
	 					v=sjs.isNumeric(v)?(v+'px'):v;
	 					d.style[a]=v;
	 				});
	 			}
	 			if (sjs.isPlainObject(a)) {
	 				var ins=this;
	 				sjs.each(a,function(k,v){
	 					k=camelize(k);
	 					ins.css(k,v);
	 				});
	 			}
	 			return this;
	 		},
	 		/*name|properties|key,value|fn*/
	 		attr:function(a,b){
	 			if (a) {
	 				if (b) {
	 					//两个参数
	 					if (sjs.isFunction(b)) {
	 						this.each(function(d,i){
	 							var v=d.getAttribute(a),r=b.call(d,i,v);
	 							if (r!=undefined) {
	 								d.setAttribute(a,r);
	 							};
	 						});
	 					}else{
	 						this.each(function(d){
	 							d.setAttribute(a,b);
	 						});
	 					}
	 				}else{
	 					//一个参数
	 					if (sjs.isString(a)) {
	 						return this[0].getAttribute(a);
	 					}else if (sjs.isPlainObject(a)) {
	 						this.each(function(d){
	 							sjs.each(a,function(k,v){
	 								d.setAttribute(k,v);
	 							})
	 						})
	 					}
	 				}
	 			};
	 			return this;
	 		},
	 		removeAttr:function(n){
	 			return this.each(function(d){
	 				d.removeAttribute(n);
	 			});
	 		},
	 		getBox:function(){
				//safari3.2没有getBoundingClientRect
				if (W.HTMLElement&&(!('getBoundingClientRect' in HTMLElement))) {
					var st = D.documentElement.scrollTop,sl = D.documentElement.scrollLeft,al = this[0].offsetLeft,
						at = this[0].offsetTop,
						cp = this[0].offsetParent; 
					while (cp != null){   
					    al += cp.offsetLeft;   
						at += cp.offsetTop;   
						cp = cp.offsetParent;   
					}   
					return {   
					    left : al- sl, 
					    right : al + this[0].offsetWidth - sl,   
					    top : at- st,   
					    bottom : at+ this[0].offsetHeight - st,
					    width: this[0].offsetWidth,
					    height: this[0].offsetHeight
					}   
				}else{
					var box=this[0].getBoundingClientRect();
					return {
						left : box.left, 
					    right :box.right,   
					    top : box.top,   
					    bottom : box.bottom,
					    width: box.right-box.left,
					    height:box.bottom-box.top
					}
				}
	 		},
	 		inBox:function(x,y){/**x，y均相对于浏览器窗口，event可用clientX,clientY*/
	 			var r=false,x=parseInt(x),y=parseInt(y);
	 			this.each(function(dom,i){
	 				var b=sjs(this).getBox();
	  				r=b.left<=x&&b.right>=x&&b.top<=y&&b.bottom>=y;
	  				if (r==true) {return false};
	 			});
	 			return r;
	 		},
	 		each:function(fn){
	 			for (var i = 0; i <this.length; i++) {
	 				if(fn.call(this[i],this[i],i)===false){
	 					return this;
	 				}
	 			}
	 			return this;
	 		},
	 		remove:function(){
	 			return this.each(function() {
						this.parentNode != null && this.parentNode.removeChild(this);
				});
			},
			addClass:function(c){
				if (c==undefined||this.length==0) {return this};
				var cs=sjs.isFunction(c)?null:ba(c);
				return this.each(function(d,i){
					var sc=sjs.trim(d.className);
					if (cs==null) {
						var cn=c.call(d,i,sc);
						if (cn&&!hc(d,cn)) {
							d.className=sc+' '+cn;
						}
					}
					else{
						sjs.each(cs,function(i,cn){
							sc=sjs.trim(d.className);
							if (cn&&!hc(d,cn)) {
								d.className=sc+' '+cn;
							}
						});
					}
				});
			},
			removeClass:function(c){
				if (this.length==0) {return this};
				var cs=sjs.isFunction(c)?null:ba(c);
				return this.each(function(d,i){
					if (c==undefined) {return (d.className='');};
					var sc=sjs.trim(d.className);
					if (cs==null) {
						var cn=c.call(d,i,sc);
						if (cn&&hc(d,cn)) {
							dc(d,cn)
						}
					}
					else{
						sjs.each(cs,function(i,cn){
							dc(d,cn);
						});
					}
				});
			},
			toggleClass:function(c){
				if (c==undefined||this.length==0) {return this};
				var cs=sjs.isFunction(c)?null:ba(c);
 				return this.each(function(d,i){
					var sc=sjs.trim(d.className),cn='';
					if (cs==null) {
						if(cn=c.call(d,i,sc)){
							if (hc(d,cn)) {dc(d,cn)}
							else{d.className=sc+' '+cn}
						}
					}
					else{
						sjs.each(cs,function(i,ci){
							sc=sjs.trim(d.className);
							if (hc(d,ci)) {dc(d,ci)}
							else{d.className=sc+' '+ci}
						});
					}
				});
			},
			//筛选
			eq:function(i){
				i=i<0?this.length+i:i;
				return sjs(this.get(i));
			},
			//文档处理

	 	},
	 	//ajax
	 	AJAXS={
	 		ajax:function(url,s){
				var _s = {
					async : true, 		// 异步
					cache : false, 		// 是否读取缓存
					type : 'GET', 		// 请求方式
					dataType:'html',	// 返回数据类型,xml|html|css|script|json|blod|arraybuffer
					mime:'text/html',
					data : {}, 			// 要随请求发送的键值对
					charset:'utf-8',	// 编码
					contentType:'application/x-www-form-urlencoded',
					// 事件函数句柄
					context:s,       	// 回调函数的上下文，默认为传递的参数对象
					progress:null,		// 下载进度，参数为当前事件对象
					upProgress:null,	// 上传进度，参数为当前事件对象
					beforeSend : null, 	// 请求开始前的函数句柄
					success : null, 	// 请求成功函数句柄，有两个参数，第一个是返回的数据，第二个是XMLHttpRequest对象
					abort : null, 		// 请求被取消时的回调句柄，并且传入一个XMLHttpRequest作为参数		
					error : null, 		// 请求失败似的函数句柄，并且传入一个XMLHttpRequest作为参数
					complete : null 	// 请求结束后的函数句柄,不管成功或者失败，并且传入一个XMLHttpRequest作为参数
				};
				if (!sjs.isString(url)) {return false}
				var _t=new Date().getTime(),_s=s?sjs.extend(_s,s):_s,
					xhr=new XMLHttpRequest,url=url.indexOf('?')>-1?url+'&':url+'?',postd=_s.data;
					url+=_s.cache?'':'_t='+_t;
 					if ((_s.type).toLowerCase()=='get') {
						url+=sjs.JSONS.toQuery(_s.data);
						postd=null;
					}
					if (_s.dataType=='blod' || _s.dataType=='arraybuffer') {
						xhr.responseType=_s.dataType;
					}
	 			if (xhr) {
	 				ajaxcall(xhr,_s);
			        xhr.open(_s.type, url, _s.async);
			        xhr.setRequestHeader("Accept", _s.mime);
					xhr.setRequestHeader("Content-Type", _s.contentType+"; charset="+_s.charset+"");
			        xhr.send(postd);
				}else{
					if (sjs.isFunction(_s.error)) {_s.error('ajax不被支持！')}
				}
				return xhr;
			},
			ajaxForm:function(sel,s){
 				$(sel).each(function(d){
 					if (d.nodeName.toLowerCase()=='form') {
						var fd = new FormData(d),xhr=new XMLHttpRequest();
						if (s && s.data) {
							for (var k in s.data) {
								fd.append(k,s.data[k]);
							}
						}
						ajaxcall(xhr,s);
						xhr.open(d.method,d.action);
						xhr.send(fd);
 					}
 				});
			},
			get:function(u,d,f,t){
				if (!u) {return false;}
				var _d=d,_f=f,_t=t;
				if (sjs.isFunction(_d)) {
					_t=_f;
					_f=_d;
					_d=null;
				}
				return sjs.ajax(u,{success:_f,data:_d,dataType:_t||'html'});
			},
			getJSON:function(u,d,f){
				if (!u) {return false;}
				var _d=d,_f=f;
				if (sjs.isFunction(_d)) {
					_f=_d;
					_d=null;
				}
				return sjs.ajax(u,{success:_f,data:_d,dataType:'json'});
			},
			getScript:function(u,f){
				if (!u) {return false;}
				var script=document.createElement('script');
				script.async=true;
				script.src=u;
				script.onload=f;
				document.body.appendChild(script);
			},
			post:function(u,d,f,t){
				if (!u) {return false;}
				var _d=d,_f=f,_t=t;
				if (sjs.isFunction(_d)) {
					_t=_f;
					_f=_d;
					_d=null;
				}
				return sjs.ajax(u,{type:'post',success:_f,data:_d,dataType:_t});
			}
	 	},
	 	/**浏览器扩展*/
	 	gwe=function(p){
			try {
	            if (window.external && window.external[p]) {
	                var f=W.external[p];
	                return UT.isFunction(f)?f():f;
	            }
			} catch (e) {}
            return '';
        },
		bs={
			isAndroid  		:(/Android/i).test(ua),
   			isIPad  		:(/ipad/i).test(ua),
   			isIPhone  		:(/iphone os/i).test(ua),
   			isWMobile		:(/Ws mobile/i).test(ua),

			isIECore		:(/Trident/i).test(ua),
			isWebkitCore	:(/webkit/i).test(ua),
			isGeckosCore	:(/Gecko/i).test(ua) && !(/khtml/i).test(ua),
			se360			:(function(){
						        var ret =/360se/i.test(ua)|| /360ee/i.test(ua);
						        return ret?ret:(/360se/i).test(gwe('twGetRunPath'));
							})(),
			sougou			:(/MetaSr/i).test(ua),
			qq				:(/QQBrowser/i).test(ua),
			maxthon			:(function(){
								return gwe('max_version').substr(0,1)>0;
					 		})(),
			opera			:W.opera?true:false,
			firefox 		:(/Firefox/i).test(ua),
			uc  			:(/UC/i).test(ua),
			liebao			:(/LBBROWSER/i).test(ua),
			baidu			:(/BIDUBrowser/i).test(ua)||gwe('GetVersion')=='baidubrowser'
		},
		nogc=!bs.sougou&&!bs.maxthon&&!bs.qq&&!bs.uc&&!bs.liebao&&!bs.baidu&&!bs.se360;
		bs.ie=(bs.isIECore&&nogc);
		bs.chrome=( /Chrome/i).test(ua)&&W.chrome&&nogc;
		bs.safari=(/Safari/.test(ua))&&!bs.chrome&&nogc;
		bs.prefix=bs.isWebkitCore?'webkit':bs.isGeckosCore?'Moz':bs.opera?'O':bs.isIECore?'ms':'';
	 	/**事件管理栈*/
	 	var _ES={},
		EVENTS={
			on:function(){
				if (arguments.length>1){
					var et=arguments[0],d=arguments[1],fn=arguments[2];					
					if (sjs.isFunction(d)) {
						fn=d;d=null;
					}else{
						if (!fn||!sjs.isFunction(fn)) {
							return this;
						}
					}
					if (typeof _ES[et] === "undefined") {	
						_ES[et]={};
						//事件委托
						document.addEventListener(et,function(e){
							if(_ES[e.type]){
								sjs(e.target).trigger(e.type,e);
							}
						},false);
					}
					//将本次选择器放入本对象的data中，便于以后循环获取根据不同selector绑定的事件
					this.each(function(dom){
						var hash=id(dom);
						if (typeof _ES[et][hash] === "undefined") {
							_ES[et][hash]=[];
						}
						_ES[et][hash].push({'fn':fn,'data':d,'cnt':0});
					});
				}
				return this;
			},
			trigger:function(et){
				if (et && _ES[et]) {
					var _dels=[],e=arguments[arguments.length-1];;
					//在本对象的事件选择器列表中获取所有绑定事件时使用过的选择器来检索事件
					this.each(function(d){
						//始终传入的最后一个参数为event(手动除外)
						e=e.type?e:{'type':et,'target':d};
						var hash=id(d),items=_ES[et][hash]||[],_dels=[];
						for (var j=0,len = items.length; j <len; j++) {
							e.data=items[j]['data'];
							e.firecnt=++items[j]['cnt'];
							//根据返回值来判断是否取消绑定
							if(items[j]['fn'].call(this,e)===false){
								_dels.push(j);
							}
						}
						for (var i = _dels.length - 1; i >= 0; i--) {
							items.splice(_dels[i],1);
						}
					})
 				}
				//触发其他自定义绑定事件
				try{
					var evt = document.createEvent('Event'); 
					evt.initEvent(et,true,true); 
					el.dispatchEvent(evt); 
				}catch(e){}
				return this;
			},
			off:function(et,fn){
					this.each(function(d){
						var hash=id(d),items;
						if (et && _ES[et]) {
							if (items=_ES[et][hash]) {
								if(fn){
									var _dels=[];
									for (var i =items.length - 1; i >= 0; i--) {
										if (items[i]['fn']==fn) {
											_dels.push(i);
										}
									}
									//数组分离删除，防止序号错乱
									for (var i = _dels.length - 1; i >= 0; i--) {
										_ES[et][hash].splice(i,1);
									}
								}else{
									delete _ES[et][hash];
								}
							}
						}else{
							//删除所有
							sjs.each(_ES,function(i,d){
								delete d[hash];
							});
						}
					});
				
				return this;
			},
			one:function(et,d,fn){
				var _fn=fn;
				this.on(et,d,function(e){
					if (_fn) {
						fn.call(this,e);
					};
					return false;
				});
				return this;
			}
		};
		EVENTS.bind=EVENTS.on;EVENTS.unbind=EVENTS.off;
		/**动画*/
		var atimer=null,_AS={},_apre=bs.prefix?bs.prefix+'Transition':'transition',ntdelay=_apre+'Delay',ntp=_apre+'Property',ntd=_apre+'Duration',nttf=_apre+'TimingFunction',
		speed={'slow':1000,'normal':600,'fast':300},
		gfx=function(d){
			var i=id(d),q=_AS[i];
			if (q==undefined) {
				var ds=d.style,ot={};
				ot[ntp]=ds[ntp];ot[ntd]=ds[ntd];ot[nttf]=ds[nttf];ot[ntdelay]=ds[ntdelay];
				return {dom:d,oldt:ot,t:0,stacks:[]};
			}
			return  _AS[i];
		},
		ANIMS={
			delay:function(t){
				if (sjs.isNumeric(t)) {
					$(this).each(function(d){
						var q=gfx(d);
							q.stacks.push({'dur':t});
						_AS[id(d)]=q;
					});
				}
				this._run();
				return this;
			},
			/**stop([clearQueue])
			停止所有在指定元素上正在运行的动画。
			如果队列中有等待执行的动画(并且clearQueue没有设为true)，他们将被马上执行
			*/
			stop:function(cq){
				cq=cq===false?false:true;
				this.each(function(d){
					if (cq) {
						//中断
						var s=d.style;
						for (var i = s.length - 1; i >= 0; i--) {
							d.style[s[i]]=gc(d,s[i]);
						}
					}else{
						var as=_AS[id(d)],l=as?as.stacks.length:0,p={};
						for (var i = 0; i <l; i++) {
							if (as.stacks[i].tran) {
								sjs.extend(p,as.stacks[i].tran)
							}
						}
						p[ntp]='none';
						sjs(d).css(p);
					}
					delete _AS[id(d)];
				});
				return this;
			},
			/**animate(params,[speed],[easing],[fn])*/
			animate:function(p,s,e,f){
				if (!sjs.isPlainObject(p)||sjs.isEmptyObject(p)) {return this;};
				var	_s=(s==undefined||sjs.isPlainObject(s))?100:s,
					_e=!e?'ease':e,
					_f=f;
					if (sjs.isPlainObject(s)) {
						_s=s.speed?s.speed:_s;
						_e=s.easing?s.easing:_e;
						_f=s.callback?s.callback:_f;
					};
					_s=sjs.isString(_s)?(speed[_s]||100):_s;
					_e=_e=='swing'?'ease-in-out':_e;
				//更新动画队列
 				this.each(function(d){
					var queue=gfx(d),tran={};
					tran[ntp]='all';tran[ntd]=_s/1000+'s';tran[nttf]=_e;
					sjs.extend(tran,p);
					queue.stacks.push({dur:_s,tran:tran,fn:_f});
					_AS[id(d)]=queue;
				});
				this._run();
				return this;
			},
			/***/
			_run:function(){
				//启动全局动画队列
				if (atimer==null) {
					atimer=UT.raf(25,function(n){
						var n=0;
						sjs.each(_AS,function(i,q){
							if (q.stacks.length==0) {
								//本对象的动画序列为空，还原并删除队列中的该对象
								sjs(q.dom).css(q.oldt);
								delete _AS[i]
							}else{
								var stack=q.stacks[0];
								//本dom的计数器开始
								if (q.t==0) {
									q.t=Date.now();
									if (stack.tran!=undefined) {
										sjs(q.dom).css(stack.tran);
									}
								}else{
									//判断结束
									if (Date.now()-q.t>=stack.dur){
										if(stack.fn){stack.fn.call(q.dom);}
										q.t=0;
										_AS[i].stacks.shift();
									}
								}
							}
							n++;
						});
						if (n==0) {this.stop();atimer=null};
					});
					atimer.start();
				};
			}
		},
		/**
		 * 扩展所有工具包
		 */
		SED=sjs.extend({},UT,{browser:bs},AJAXS),ED=sjs.extend(DOMS,EVENTS,ANIMS);
		sjs.extend(SED);
		sjs.fn.extend(ED);
		//全局提供
		W.sjs = W.$ = sjs;
})(window);