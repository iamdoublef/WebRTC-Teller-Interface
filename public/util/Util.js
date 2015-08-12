/**
 * 工具类
 */
Util ={
	version:'1.0.0'
};

/**
 * 获取mac地址
 * 用到两个ActiveX（首页引入）：
 * <OBJECT id=locator classid=CLSID:76A64158-CB41-11D1-8B02-00600806D9B6 VIEWASTEXT></OBJECT>
 * <OBJECT id=foo classid=CLSID:75718C9A-F029-11d1-A1AC-00C04FB6C223></OBJECT>
 */
Util.NetConfig=(function(){
	
	var _this = this;
	var _locatorObj = null;
	var _configObj = null;
	var _callBack = null;//当获取成功后，回调
	var _MACAddr = null;
	var _IPAddr=null;
	var _sDNSName=null;
	
	/**
	 * 获取配置信息
	 * @param {Object} locatorObj ocx对象
	 * @param {Object} configObj ocx对象
	 * @param {Object} callBack 获取成功回调函数
	 */
	var _getNetConfig = function(locatorObj,configObj,callBack){
		_locatorObj=locatorObj;
		_configObj=configObj;
		_callBack=callBack;
		
		//添加监听
		Util.EventManager.addListener(_configObj,'OnObjectReady',_OnObjectReadyEvent);
		Util.EventManager.addListener(_configObj,'OnCompleted',_OnCompletedEvent);
		
		//开始获取
		var service = _locatorObj.ConnectServer();
		service.Security_.ImpersonationLevel=3;
		service.InstancesOfAsync(_configObj, 'Win32_NetworkAdapterConfiguration');
	};
	
	/**
	 * 循环获取
	 * @param {Object} objObject
	 * @param {Object} objAsyncContext
	 */
	var _OnObjectReadyEvent = function(objObject,objAsyncContext){
		
		if(objObject.IPEnabled != null && objObject.IPEnabled != "undefined" && objObject.IPEnabled == true){
		    if(objObject.MACAddress != null && objObject.MACAddress != "undefined") 
		    	_MACAddr = objObject.MACAddress;
		    if(objObject.IPEnabled && objObject.IPAddress(0) != null && objObject.IPAddress(0) != "undefined"){
		    	_IPAddr = objObject.IPAddress(0);
		    }
		    if(objObject.DNSHostName != null && objObject.DNSHostName != "undefined")
		    	_sDNSName = objObject.DNSHostName;
		 }
		
    };
    
    /**
     * 获取成功
     * @param {Object} hResult
     * @param {Object} pErrorObject
     * @param {Object} pAsyncContext
     */
    var _OnCompletedEvent = function(hResult,pErrorObject, pAsyncContext){
    	_callBack(_MACAddr,_IPAddr);
    	
		Util.EventManager.removeListener(_configObj,'OnObjectReady',_OnObjectReadyEvent);
		Util.EventManager.removeListener(_configObj,'OnCompleted',_OnCompletedEvent);
		
		_locatorObj=null;
		_configObj=null;
		_callBack=null;
    };
    
    return {
    	getNetConfig:_getNetConfig,
    	getMACAddr:function(){
    		return _MACAddr;
    	},
    	getIPAddr:function(){
    		return _IPAddr;
    	}
    };
}());

Util.EventManager = {
	/**
	 * 给对象注册事件
	 * 方便扩展
	 * 	可动态添加未在初始化时候添加进去的事件
	 * 	也可在IE8以及向下版本对同一事件添加多个响应函数
	 * 
	 * @param {string} type 监听的事件类型名称
	 * @param {function} fn 事件触发的函数
	 */
	addListener:function(element,type,fn){
		if(typeof element == 'undefined') return false;

		if(element.attachEvent){
			// 将事件缓冲到该标签上,已解决this指向window(现fn内this指向element)和移除匿名事件问题
			var _EventRef='_'+type+'EventRef';
			if(!element[_EventRef]){
				element[_EventRef]=[];
			}
			var _EventRefs=element[_EventRef];
			var index;
			for(index in _EventRefs){
				if(_EventRefs[index]['realFn']==fn){
					return;
				}
			}
			var nestFn=function(){
				fn.apply(element,arguments);
			};
			element[_EventRef].push({'realFn':fn,'nestFn':nestFn});
			element.attachEvent(type,nestFn);
		}else if(element.addEventListener){
			element.addEventListener(type,fn,false);
		}
		else{
			element[type]=fn;
		}
	},
	
	/**
	 * 移除对象上已注册事件
	 * 
	 * @param {string} type 监听的事件类型名称
	 * @param {function} fn 事件触发的函数
	 */
	removeListener:function(element,type,fn){
		if(typeof element == 'undefined') return false;
		
		if(element.detachEvent){//IE8及向下版本兼容
			var _EventRef='_'+type+'EventRef';
			if(!element[_EventRef]){
				element[_EventRef]=[];
			}
			var _EventRefs=element[_EventRef];
			var index;
			var nestFn;
			for(index in _EventRefs){
				if(_EventRefs[index]['realFn']==fn){
					nestFn=_EventRefs[index]['nestFn'];
					if(index==_EventRefs.length-1){
						element[_EventRef]=_EventRefs.slice(0,index);
					}else{
						element[_EventRef]=_EventRefs.slice(0,index).concat(_EventRefs.slice(index+1,_EventRefs.length-1));
					}
					break;
				}
			}
			if(nestFn){
				element.detachEvent(type,nestFn);
			}
		}else if(element.removeEventListener){//firefox 、IE9以及向上兼容
			element.removeEventListener(type,fn,false);
		}else{
			element[type]=null;
		}
		return true;
	}
};

Util.DateUtil = {
	
	getTime:function(){
		var myDate = new Date();
		var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
		var month = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
		var date = myDate.getDate();        //获取当前日(1-31)
		if(month<=9){
			month = "0" + month;
		}
		if(date<=9){
			date = "0" + date;
		}
		var hour = myDate.getHours();       //获取当前小时数(0-23)
		var min = myDate.getMinutes();     //获取当前分钟数(0-59)
		var second = myDate.getSeconds();     //获取当前秒数(0-59)
		var mili = myDate.getMilliseconds();    //获取当前毫秒数(0-999)
		return ""+year+month+date+hour+min+second+mili;
	},

	getTimeFormat:function(){
		var myDate = new Date();
		var hour = myDate.getHours();       //获取当前小时数(0-23)
		if(hour<10){
			hour = "0"+hour;
		}
		var min = myDate.getMinutes();     //获取当前分钟数(0-59)
		if(min<10){
			min = "0"+min;
		}
		var second = myDate.getSeconds();     //获取当前秒数(0-59)
		if(second<10){
			second = "0"+second;
		}
		return ""+hour+":"+min+":"+second;
	},
	
	//获取当前日期
	getDate:function(){
		var dateTime=new Date();
		var yy=dateTime.getFullYear();
		var MM=dateTime.getMonth()+1;  //因为1月这个方法返回为0，所以加1
		if(MM<=9){
			MM = "0" + MM;
		}
		var dd=dateTime.getDate();
		if(dd<=9){
			dd = "0" + dd;
		}
		return yy+"-"+MM+"-"+dd;
	},
	
	//获取当前日期
	getDateFormat:function(){
		var dateTime=new Date();
		var yy=dateTime.getFullYear();
		var MM=dateTime.getMonth()+1;  //因为1月这个方法返回为0，所以加1
		if(MM<=9){
			MM = "0" + MM;
		}
		var dd=dateTime.getDate();
		if(dd<=9){
			dd = "0" + dd;
		}
		return yy+"年"+MM+"月"+dd+"日";
	},
	
	//写日志时的时间戳
	getLogTime:function(){
		var myDate = new Date();
		var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
		var month = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
		var date = myDate.getDate();        //获取当前日(1-31)
		if(month<=9){
			month = "0" + month;
		}
		if(date<=9){
			date = "0" + date;
		}
		var hour = myDate.getHours();       //获取当前小时数(0-23)
		var min = myDate.getMinutes();     //获取当前分钟数(0-59)
		var second = myDate.getSeconds();     //获取当前秒数(0-59)
		var mili = myDate.getMilliseconds();    //获取当前毫秒数(0-999)
		return year+"-"+month+"-"+date+" "+hour+":"+min+":"+second+":"+mili;
	}
};

/**
 * @author rchen
 * @param {} fileName 文件名
 * @param {} filecontent 文件内容
 * @description 记录日志
 */

Util.Logger = {
	debug : function(filecontent) {
		
		var isDEBUG = true;
		try {
			if (isDEBUG) {
				var fso, f1;
				var filePath = "c:\\vta";
				fso = new ActiveXObject("Scripting.FileSystemObject");
				if (fso.FolderExists(filePath)) {
					f1 = fso
							.OpenTextFile(filePath + '\\vta'
									+ Util.DateUtil.getDate() + '.txt',
									8, true);
					f1.WriteLine(Util.DateUtil.getLogTime() + " "
							+ filecontent);
					f1.Close();
				} else {
					fso.CreateFolder(filePath);
					f1 = fso
							.OpenTextFile(filePath + '\\vta'
									+ Util.DateUtil.getDate() + '.txt',
									8, true);
					f1.WriteLine(Util.DateUtil.getLogTime() + " "
							+ filecontent);
					f1.Close();
				}
			}
		} catch (e) {
			return;
		}
	}
};

Util.Json = {
	decode : function(jsonStr){
		var jsonObj = null;
		try{
			jsonObj = eval('('+jsonStr+')');
		}catch(e){
			jsonObj = eval(jsonStr);
		}
		return jsonObj;
	}
},

Util.Object = {
	/**
	 * 基于现有对象创建新对象，而无需创建自定义类型
	 * @param 
	 */
	object : function(o){
		function F(){};
		F.prototype = o;
		return new F();
	},
	/**
	 * 寄生组合式继承
	 * @returns
	 */
	inherit : function(subType, superType){
		var prototype = this.object(superType.prototype);
		prototype.constructor = subType;
		subType.prototype = prototype;
	}
};

/**
 * 声音播放（振铃时使用）
 * 在html中使用EMBED标签加入声音源，才可进行以下操作
 * 其中标签名字为TellerAudio
 */
Util.Audio = {
	start : function(){
//		document.TellerAudio.play();
		//document.getElementById("TellerAudio").src="teller/msg.mp3";
	},
	stop : function(){
//		document.TellerAudio.stop();
		//document.getElementById("TellerAudio").src="";
	}
}

/**
 * @author zhengyh
 * @description 定时执行函数
 * @param interval number间隔执行时间（ms）
 * @param count number循环次数
 */
Util.IntervalTask = function(interval, count){
	var me = this;
	if (typeof interval == 'number') {
		me._interval = interval;
	}
	if (typeof count == 'number') {
		me._count = count;
	}
	Util.Logger.debug("=============constructor=====count="+me._count+"====me._interval="+me._interval+"===============");
};

Util.IntervalTask.prototype = {
	constructor : Util.IntervalTask,
	_interval : 1000,//心跳间隔时间
	_count : 3, //心跳异常允许次数
	_curCount : 0,//当前心跳异常次数
	_timerId : null,//定时器ID
	_isRunning : false,//任务状态
	_exceptionFn : null,//异常调用方法
	_taskFn : null,//循环调用方法
	_taskArgs:'',
	
	/**
	 * 
	 * @param taskFn function执行任务
	 * @param exceptionFn function超过执行次数抛出结束函数
	 * @param taskArgs arguments or array taskFn执行传入参数
	 */
	start : function(taskFn, exceptionFn, taskArgs) {
		var me = this;
		me.resetCount();
		me._taskFn = taskFn;
		me._taskArgs = taskArgs;
		me._exceptionFn = exceptionFn;
		me._isRunning = true;
		Util.Logger.debug("=============start=====me._isRunning="+me._isRunning+"====me._taskArgs="+me._taskArgs+"===============");
		me._run();
	},

	_run : function() {
		var me = this;
		if (me._isRunning) {
			if (me._curCount >= me._count) {
				if ('function' === typeof (me._exceptionFn)){
					me._exceptionFn();
				}
				me.resetCount();
				Util.Logger.debug("===========run throw exception timeout=======");
			} else {
				me._curCount++;
				me._taskFn.apply(null,me._taskArgs);
				me._timerId = setTimeout(function(){me._run();}, me._interval);//js定时器
				Util.Logger.debug("===========run into timer=======me.count="+me._count);
			}
		}
	},

	stop : function() {
		var me = this;
		me._isRunning = false;
		if (null != me._timerId) {
			clearTimeout(me._timerId);
			me._timeId = null;
		}
		Util.Logger.debug("===========stop=======isrunning="+me._isRunning);
	},

	//重置计时器
	resetCount : function() {
		var me = this;
		me._curCount = 0;
		me.stop();
		Util.Logger.debug("===========resetCount===========");
	}
};

Util.Record = {
		_count : 3,
		_curCount : 0,
		_isRecording : false,
		
		start : function(taskFn,endFn) {
			var me = this;
			Util.Logger.debug("===========Util.Record start==========="+me._curCount);
			
			if (!me._isRecording) {
			    if(me._curCount < me._count){
					taskFn();
					me._curCount++;
				}else{
					me._reset();
					me._isRecording = false;
					endFn();
				}
			}
		},
		
		stop : function() {
			Util.Logger.debug("===========Util.Record stop===========");
			var me= this;
			me._reset();
			me._isRecording = false;
		},
		
		setIsReording: function(){
			var me = this;
			me._reset();
			me._isRecording = true;
		},
		
		_reset : function() {
			this._curCount = 0;
		}
};
