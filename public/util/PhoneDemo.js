/**
 * 提供话务调用，事件触发的流程
 * 处理所有业务逻辑，业务控制中心
 */
Fn =  {};
Fn.PhoneEvent = new (function() {
	var serverLog = null;
	var jsUrl = "teller/huawei/PhoneDemo.js";
	
	this.init = function() {
		if(!serverLog) serverLog = top.Fn.serverLog;
		serverLog.debug('Teller.Fn.init', jsUrl);
	}

	this.msgArrived = function(msg) {
	}
	//柜员登录成功事件
	this.loginSucc = function(eventInfo) {
	}

	//呼叫振铃事件
	this.alerting = function(callNO, vtmNO) {
		alert("lingling.....");
	}
	
	// 呼叫建立事件
	this.talking = function(callNo,vtmNo,callType) {
	}

	//柜员登录失败事件
	this.loginFailed = function(eventInfo) {
	}

	//柜员登出成功事件
	this.logoutSucc = function() {
	}
	//久不应答事件
	this.noAnswer = function(){
	}
	//柜员登出失败事件
	this.logoutFailed = function(eventInfo) {
	}

	/** 5.2 呼叫控制事件 Start *************** */

	//柜员进入闲态事件
	this.idle = function() {
	}
	
	/**
	 * 柜员进入忙态事件
	 */
	this.busy = function() {
	}

	//柜员进入未准备态事件
	this.notReady = function() {
	}
	
	//保持事件
	this.hold = function(){
	}
	
	//取消保持事件
	this.unHold = function(){
	}
	// 呼叫挂断事件
	this.release = function(callNo) {
	}
	//桌面共享开始
	this.desktopStart = function(){
	}
	//桌面共享结束
	this.desktopStop_huawei = function(){
	}
	//桌面共享结束  桌面共享与远程控制为不可用状态  avaya
	this.desktopStop = function(){
	}
	//远程控制开始
	this.desktopCtlStart = function(){
	}
	//远程控制结束
	this.desktopCtlStop = function(){
	}
	
	//静音事件
	this.mute = function(){
	}
	
	//取消静音事件
	this.unMute = function(){
	}
	
	/** Teller异常处理 ***************** */
	this.error = function(){//错误，不可恢复
	}
	
	this.exception = function(){//异常，可重试
	}
	
})();
