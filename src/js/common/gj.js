function doAsyn(callback) {
    if (typeof TcsJSBridge == "object" && typeof TcsJSBridge.invoke == "function") {
        // log("ready for: " + callback);
        callback();
    } else {
        if (document.addEventListener) {
            // log("not ready, addEventListener for: " + callback);
            document.addEventListener("TcsJSBridgeReady", callback, false);
        } else if (document.attachEvent) {
            // log("not ready, attachEvent for: " + callback);
            document.attachEvent("TcsJSBridgeReady", callback);
            document.attachEvent("onTcsJSBridgeReady", callback);
        }
    }
}

function shareTimeline(options){
    doAsyn(function(){
        TcsJSBridge.invoke("shareTimeline", options, function(res) {
            if(res.err_msg == "ok" && res.ret == 0){
                // pgvSendClick({hottag: 'client.txwz.gj.shareSuccess'});
            }
        });
    });
	
}


// 获取登录状态
function getQQLoginState(callback) {
    doAsyn(function(){
        TcsJSBridge.invoke("getQQLoginState", {
            uin : ''
        }, function(res) {
            if (res.err_msg == "ok" && res.ret == 0) {
                if (res.state == "online") {
                    callback(res.uin);
                } else if (res.state == "offline") {
                    loginQQ('',true, callback);
                } else /*if (res.state == "none") */{
                    loginQQ('',true, callback);
                }
            } else {
                alert("getQQLoginState,err_msg: " + res.err_msg + " res.ret: " + res.ret);
            }
        });
    });
    // res.err_msg的值
    // access_control:not_allow
    // system:function_not_exist
    // ok
    // [fail message]
}

/**
 * 登录QQ
 * 输入参数：
 * as_main_account: bool类型，可选，是否作为管家的主账号，如果是将会替换掉管家个人中心的登录账号，默认为true
 * uin: String类型，可选，要登录的QQ号，如果不指定则由用户在QQ的登录框里面输入
 * 回调函数返回内容:
 * res.err_msg：调用结果，String类型，"ok"表示调用成功
 * res.ret: 执行结果，int类型，0表示成功
 * res.uin: String类型，实际登录的QQ号，一般来说和输入参数是一样的，但也有可能用户在QQ登录界面上切换了账号，所以以这个为准
 *
 */
function loginQQ(aUin, asMainAccount, callback) {

    TcsJSBridge.invoke("loginQQ", {
        as_main_account : asMainAccount,
        uin : aUin
    }, function(res) {
        // alert(res.err_msg + '--' + res.ret);
        if (res.err_msg == "ok" && res.ret == 0) {
            getQQLoginState(callback);
            
            // log("登录成功，qq: " + res.uin);
        } else {
            alert("loginQQ登录失败，err_msg: " + res.err_msg + " res.ret: " + res.ret);
        }
    });
    // res.err_msg的值
    // access_control:not_allow
    // system:function_not_exist
    // ok
    // [fail message]
}

/**
 * 获取QQ登录态的key
 * 输入参数：
 * uin: String类型，必选，填QQ号，不指定则填""
 * keyType: String类型，必选，需要返回的key的类型（不同业务需要的类型可能不一样，所以直接让使用者选择），取值范围：{"sid", "skey", "vkey", "a2key", "stwebkey"}
 * 回调函数返回内容:
 * res.err_msg：调用结果，String类型，"ok"表示调用成功
 * res.ret: 执行结果，int类型，0表示成功
 * res.keytype: String类型，key的类型，从传入参数返回
 * res.key: String类型，对应的key值
 * res.uin: String类型，QQ号
 */
function getQQLoginKey(aUin, aKeyType, callback) {
    TcsJSBridge.invoke("getQQLoginKey", {
        uin : aUin,
        keytype : aKeyType
    }, function(res) {
        if (res.err_msg == "ok" && res.ret == 0) {
            callback(res.key);
            // log("获取到登录态，\nqq: " + res.uin + "\nkeyType: " + res.keytype + "\nkey: " + res.key);
        } else {
            alert("getQQLoginKey,err_msg: " + res.err_msg + " res.ret: " + res.ret);
        }
    });
    // res.err_msg的值
    // access_control:not_allow
    // system:function_not_exist
    // ok
    // [fail message]
}

/**
 * 获取信息
 *
 * 版本支持：
 * 1. 管家Android 5.6     jsapi版本: 20150515新增、20150604补充
 * 
 * 输入参数：
 * key: String类型，必填，要获取的信息类型
 *      20150515版本开始支持的key：imei、guid、phone_number
 *      20150604版本开始支持的key：lc、android_os_build_model、android_os_build_version_release
 *
 * 回调函数返回内容:
 * res.err_msg：调用结果，String类型，"ok"表示调用成功
 * res.ret: 返回的值，String类型，err_msg=="ok"时才有效，
 * 但即使err_msg=="ok"时res.ret仍然有可能是空串""，比如获取手机号码时系统接口可能返回空串""而没有异常
 */
function getInfo(aKey,callback) {
    TcsJSBridge.invoke("getInfo", {
        key : aKey
    }, function(res) {
        if (res.err_msg == "ok") {
            callback(res.ret);
        } else {
            alert("getInfo获取失败，err_msg: " + res.err_msg);
        }
    });
}

var imei,skey,guid;
function getClientInfo(qq,callback){
    
    if(guid){
        callback(imei,skey,guid);
        return;
    }
    // 获取skey
    getQQLoginKey(qq,'skey',function(key){
        skey = key;
        // 获取imei
        getInfo('imei',function(_imei){

            imei = _imei;
            // 获取guid
            getInfo('guid',function(_guid){
               
                guid = _guid;
                callback(imei,skey,guid);
            });
        });
    });
}


module.exports = {
    shareTimeline: shareTimeline,
    getQQ: getQQLoginState,
    getClientInfo: getClientInfo
};