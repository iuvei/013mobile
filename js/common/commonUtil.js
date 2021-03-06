/* 
 * @Author: Administrator
 * @Date:   2015-01-12 16:15:03
 * @Last Modified by:   Administrator
 * @Last Modified time: 2016-01-23 15:48:49
 */
/**
 * [ajaxUtil 数据请求类]
 * @type {Object}
 */
var ajaxUtil = {

    /**
     * post异步请求
     * @param {Object} functionName 请求方法名
     * @param {Object} param    请求参数
     * @param {Object} respFuncCallBack 返回成功回调函数
     * @param {String} beforeMsg 请求前load信息
     * @param {Object} errcallback 返回失败回调函数
     * @param {Object} cworkState 网络不可用回调函数
     */
    ajaxByAsyncPost : function(functionName, param, respFuncCallBack,beforeMsg, errcallback,cworkState) {
        log.v("发送到java端加密之前的数据：" + param);
        log.v("请求的URL地址是:"+ website.path);
        $.ui.blockUI(.5);
        $.ajax({
            //远程Rest接口
            url : website.path,
            type : "POST",
            cache : false,
            //返回的数据类型
            dataType : "json",
            data : {
                "message" : param
            },
            timeout : 15000,
            success : respFuncCallBack,
            beforeSend:function(){
                if(beforeMsg){
                    $.ui.showMask(beforeMsg);
                }else{
                    $.ui.showMask("正在加载,请稍后...");
                }
            },complete:function(){
                $.ui.hideMask();
                $.unblockUI();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                toastUtils.showToast('服务器异常  ，返回数据失败');
                if (null != errcallback) {
                    errcallback(jqXHR, textStatus, errorThrown);
                }
            }
        });
    },
    /**
     * post异步请求
     * @param {Object} functionName 请求方法名
     * @param {Object} param    请求参数
     * @param {Object} respFuncCallBack 返回成功回调函数
     * @param {String} beforeMsg 请求前load信息
     * @param {Object} errcallback 返回失败回调函数
     * @param {Object} cworkState 网络不可用回调函数
     */
    ajaxByAsyncPost1 : function(functionName, param, respFuncCallBack,beforeMsg, errcallback,cworkState) {
        log.v("发送到java端加密之前的数据：" + param);
        log.v("请求的URL地址是:"+ website.path);
        $.ui.blockUI(.5);
        $.ajax({
            //远程Rest接口
            url : website.path,
            type : "POST",
            cache : false,
            //返回的数据类型
            dataType : "json",
            data : {
                "message" : param
            },
            timeout : 15000,
            success : respFuncCallBack,
            beforeSend:function(){
                if(beforeMsg){
                    $.ui.showMask(beforeMsg);
                }else{
                    $.ui.showMask("正在加载,请稍后...");
                }
            },
            complete:function(){
                $.ui.hideMask();
                $.unblockUI();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                toastUtils.showToast('服务器异常，返回数据失败');
                if (null != errcallback) {
                    errcallback(jqXHR, textStatus, errorThrown);
                }
            }
        });
    },
    /**
     * @Author:      muchen
     * @DateTime:    2014-12-10 09:54:09
     * @Description: ajax同步返回data
     */
    ajaxBySyncPost : function(functionName, param,beforeMsg, errcallback,cworkState) {
        log.v("发送到java端加密之前的数据：" + param);
        log.v("请求的URL地址是:"+ website.path + functionName);
        var result;
        $.ui.blockUI(.5);
        $.ajax({
            //远程Rest接口
            url : website.path + functionName,
            type : "POST",
            cache : false,
            //返回的数据类型
            dataType : "json",
            data : {
                "def" : param
            },
            timeout : 15000,
            async: false,
            success : function(data){
                $.unblockUI();
                result = data;
            },
            beforeSend:function(){
                if(beforeMsg){
                    $.ui.showMask(beforeMsg);
                }else{
                    $.ui.showMask("正在加载,请稍后...");
                }
            },complete:function(){
                $.ui.hideMask();
                $.unblockUI();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                toastUtils.showToast('服务器异常，返回数据失败');
                if (null != errcallback) {
                    errcallback(jqXHR, textStatus, errorThrown);
                }
            }
        });
        return result;
    },

    /**
     * get异步请求
     * @param {Object} functionName 请求方法名
     * @param {Object} param    请求参数
     * @param {Object} respFuncCallBack 返回成功回调函数
     */
    ajaxByAsyncGet : function(url, param, respFuncCallBack,beforeMsg, errcallback,cworkState) {
        log.v("get请求发送到java端加密之前的数据：" + param);
        $.ui.blockUI(.5);
        $.ajax({
            //远程Rest接口
            url :  url,
            type : "GET",
            cache : false,
            //返回的数据类型
            dataType : "json",
            data : param,
            timeout : 15000,
            success : respFuncCallBack,
            beforeSend:function(){
                if(beforeMsg){
                    $.ui.showMask(beforeMsg);
                }else{
                    $.ui.showMask("正在加载,请稍后...");
                }
            },complete:function(){
                $.ui.hideMask();
                $.unblockUI();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                toastUtils.showToast('服务器异常，返回数据失败');
                if (null != errcallback) {
                    errcallback(jqXHR, textStatus, errorThrown);
                }
            }
        });
    },

    /**
     * post异步请求
     * @param {Object} functionName 请求方法名
     * @param {Object} param    请求参数
     * @param {Object} respFuncCallBack 返回成功回调函数
     * @param {String} beforeMsg 请求前load信息
     * @param {Object} errcallback 返回失败回调函数
     * @param {Object} cworkState 网络不可用回调函数
     */
    ajaxCodeByAsyncPost : function(functionName, param, respFuncCallBack,beforeMsg, errcallback,cworkState) {
        log.v("发送到java端加密之前的数据：" + param);
        log.v("请求的URL地址是:"+ website.path + functionName);
        $.ui.blockUI(.5);
        $.ajax({
            //远程Rest接口
            url : website.path + functionName,
            type : "POST",
            cache : false,
            //返回的数据类型
            dataType : "json",
            data : {
                "def" : param
            },
            timeout : 15000,
            success : respFuncCallBack,
            beforeSend:function(){
                if(beforeMsg){
                    $.ui.showMask(beforeMsg);
                }else{
                    $.ui.showMask("正在加载,请稍后...");
                }
            },complete:function(){
                $.ui.hideMask();
                $.unblockUI();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                toastUtils.showToast('服务器异常，返回数据失败');
                if (null != errcallback) {
                    errcallback(jqXHR, textStatus, errorThrown);
                }
            }
        });
    },
    /**
     * get同步请求
     * @param {Object} functionName 请求方法名
     * @param {Object} param    请求参数
     * @param {Object} respFuncCallBack 返回成功回调函数
     */
    ajaxBySyncGet : function(url, param, respFuncCallBack,beforeMsg, errcallback,cworkState) {
        log.v("get请求发送到java端加密之前的数据：" + param);
        $.ui.blockUI(.5);
        $.ajax({
            //远程Rest接口
            url :  url,
            type : "GET",
            cache : false,
            //返回的数据类型
            dataType : "json",
            data : param,
            timeout : 15000,
            async: false,
            success : respFuncCallBack,
            beforeSend:function(){
                if(beforeMsg){
                    $.ui.showMask(beforeMsg);
                }else{
                    $.ui.showMask("正在加载,请稍后...");
                }
            },complete:function(){
                $.ui.hideMask();
                $.unblockUI();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                toastUtils.showToast('服务器异常，返回数据失败');
                if (null != errcallback) {
                    errcallback(jqXHR, textStatus, errorThrown);
                }
            }
        });
    }
};

/**
 * [log 日志打印]
 * @type {Object}
 */
var log = {
    v: function (message) {
        if (website.isLog) {
            console.log(message);
        }
    },
    a: function (message) {
        if (website.isLog) {
            alert(message);
        }
    }
};

/**
 *  json数据格式转换
 */
var jsonUtils = {

    toObject: function (value) {
        return $.parseJSON(value);
    },

    toJson: function (value) {
        return JSON.parse(value);
    },

    toString: function (value) {
        return JSON.stringify(value);
    }
}

/**
 *本地数据存取函数
 */
var localStorageUtils = {
    setParam : function(name, value) {
        localStorage.setItem(name, value)
    },
    getParam : function(name) {
        return localStorage.getItem(name)
    },
    removeParam : function(key) {
        return localStorage.removeItem(key);
    }
}

/**
 * session数据存取函数
 */

var sessionStorageUtils = {
    setParam : function(key, value) {
        sessionStorage.setItem(key, value)
    },
    getParam : function(key) {
        return sessionStorage.getItem(key)
    },
    removeParam : function(key) {
        return sessionStorage.removeItem(key);
    }
}
/**
 * [toastUtils 显示toast消息]
 * @type {Object}
 */
var toastUtils = {
    showToast: function (text) {
        $.ui.showToast(text);
        window.setTimeout(function () {
            $.ui.hideToast();
        }, 2000);
    },
    showToast_callBack: function (text, callBackFunName) {
        $.ui.showToast(text);
        window.setTimeout(function () {
            $.ui.hideToast();
            eval(callBackFunName);
        }, 2000);
    }
}

/**
 * [dialogUtils 显示进度对话框]
 * @type {Object}
 */
var dialogUtils = {
    showMask: function (text, time) {
        $.ui.showMask(text);
        window.setTimeout(function () {
            $.ui.hideMask();
        }, time);
    }
}

/**
 * [mathUtil 注数计算公式]
 * @type {Object}
 */
var mathUtil = {
    /**
     * Cm n的计算方法
     */
    getCCombination: function (m, n) {
        var i = m - n;
        if (i < 0) {
            return 0;
        } else if (i == 0) {
            return 1;
        } else {
            if (i < n) {
                var b = mathUtil.getNtoMMultiplySum(n, m);
                var bigBumberB = new BigNumber(b);
                var c = mathUtil.getMultiplySum(i);
                var bigBumberC = new BigNumber(c);
                return Math.floor(bigBumberB.dividedBy(bigBumberC));
            } else {
                var b = mathUtil.getNtoMMultiplySum(i, m);
                var bigBumberB = new BigNumber(b);
                var c = mathUtil.getMultiplySum(n);
                var bigBumberC = new BigNumber(c);
                return Math.floor(bigBumberB.dividedBy(bigBumberC));
            }
        }
    },

    /**
     * An n的计算方法 计算从1*2*3*...*n的值 n>=1
     */
    getMultiplySum: function (n) {
        return mathUtil.getNtoMMultiplySum(1, n);
    },

    /**
     * 计算1+2+3+...+n
     */
    getAddSum: function (n) {
        var sum = 0;
        for (var i = 0; i <= n; i++) {
            sum += i;
        }
        return sum;
    },

    /**
     * 计算n+(n-i)+(n-2i)+(n-3i)+...
     */
    getAddSum2: function (n, i, count) {
        var sum = 0;
        for (var j = n; j >= 0 && count >= 1; j -= i, count--) {
            sum += j;
        }
        return sum;
    },

    /**
     * 计算从(n+1)*(n+2)*(n+3)*...*m的值 m>n
     */
    getNtoMMultiplySum: function (n, m) {
        var sum = new BigNumber(1);
        if (m < n) {
            return 0;
        }
        if (m == n) {
            return 1;
        }
        for (var i = n + 1; i <= m; i++) {
            var bigInteger = new BigNumber(i);
            sum = bigInteger.times(sum);
        }
        return sum;
    },

    /**
     * Am n的计算方法
     */
    getACombination: function (m, n) {
        return mathUtil.getNtoMMultiplySum(m - n, m);
    },

    /**
     * 产生[0,total)中的可以相同的数的一个数组
     * @param count 产生的数组大小
     * @param max  最大值
     */
    getNums: function (count, max) {
        var nums = new Array(count);
        for (var i = 0; i < count; i++) {
            nums[i] = Math.floor((Math.random() * max));
        }
        return nums;
    },

    /**
     * 产生[start,total]中的可以相同的数的一个数组
     * @param count 产生的数组大小
     * @param max  最大值
     */
    getSameNums: function (start, count, max) {
        var nums = new Array(count);
        for (var i = 0; i < count; i++) {
            nums[i] = Math.floor((Math.random() * max)) + start;
        }
        return nums;
    },

    /**
     * 从数组中随机取出不相同的n个数组成数组
     * nums:源数组
     */
    getDifferentNums: function (n, nums) {
        var newNums = new Array(n);
        var length = nums.length;
        for (var i = 0; i < n; i++) {
            var j = Math.floor((Math.random() * length));
            newNums[i] = nums[j];
            nums[j] = nums[length - 1];
            length--;
        }
        return newNums;
    },

    /**
     * 产生start到end的一个数组
     */
    getInts: function (start, end) {
        var nums = new Array(end - start + 1);
        var start_num = start;
        for (var i = 0; i < end - start + 1; i++, start_num++) {
            nums[i] = start_num;
        }
        return nums;
    },

    /**
     * 获取start到end的随机数(不包括end，不包括负数)
     */
    getRandomNum: function (start, end) {
        var ret = Math.floor((Math.random() * (end - start) + start));
        return ret;
    },

    /**
     * 计算组三和值的注数
     * @param num
     * @return
     */
    getZuSanHeZhiNote: function (num) {
        var temp = 0;
        var sum = parseInt(num);
        switch (sum) {
            case 1:
            case 3:
            case 24:
            case 26:
                temp = 1;
                break;
            case 2:
            case 25:
                temp = 2;
                break;
            case 4:
            case 5:
            case 6:
            case 21:
            case 22:
            case 23:
                temp = 3;
                break;
            case 7:
            case 9:
            case 12:
            case 15:
            case 18:
            case 20:
                temp = 4;
                break;
            case 8:
            case 10:
            case 11:
            case 13:
            case 14:
            case 16:
            case 17:
            case 19:
                temp = 5;
                break;
            default:
                break;
        }
        return temp;
    },

    /**
     * 计算二星直选和值的注数
     * @param num
     * @return
     */
    getErXingZhiXuanHeZhiNote: function (num) {
        var temp = 0;
        var sum = parseInt(num);
        switch (sum) {
            case 0:
            case 18:
                temp = 1;
                break;
            case 1:
            case 17:
                temp = 2;
                break;
            case 2:
            case 16:
                temp = 3;
                break;
            case 3:
            case 15:
                temp = 4;
                break;
            case 4:
            case 14:
                temp = 5;
                break;
            case 5:
            case 13:
                temp = 6;
                break;
            case 6:
            case 12:
                temp = 7;
                break;
            case 7:
            case 11:
                temp = 8;
                break;
            case 8:
            case 10:
                temp = 9;
                break;
            case 9:
                temp = 10;
                break;
            default:
                break;
        }
        return temp;
    },

    /**
     * 计算二星组选和值的注数
     * @param num
     * @return
     */
    getErXingZuXuanHeZhiNote: function (num) {
        var temp = 0;
        var sum = parseInt(num);
        switch (sum) {
            case 0:
            case 1:
            case 2:
            case 16:
            case 17:
            case 18:
                temp = 1;
                break;
            case 3:
            case 4:
            case 14:
            case 15:
                temp = 2;
                break;
            case 5:
            case 6:
            case 12:
            case 13:
                temp = 3;
                break;
            case 7:
            case 8:
            case 10:
            case 11:
                temp = 4;
                break;
            case 9:
                temp = 5;
                break;
            default:
                break;
        }
        return temp;
    },

    /**
     * 计算组六和值的注数
     * @param num
     * @return
     */
    getZuLiuHeZhiNote: function (num) {
        var temp = 0;
        var sum = parseInt(num);
        switch (sum) {
            case 3:
            case 4:
            case 23:
            case 24:
                temp = 1;
                break;
            case 5:
            case 22:
                temp = 2;
                break;
            case 6:
            case 21:
                temp = 3;
                break;
            case 7:
            case 20:
                temp = 4;
                break;
            case 8:
            case 19:
                temp = 5;
                break;
            case 9:
            case 18:
                temp = 7;
                break;
            case 10:
            case 17:
                temp = 8;
                break;
            case 11:
            case 16:
                temp = 9;
                break;
            case 12:
            case 13:
            case 14:
            case 15:
                temp = 10;
                break;
            default:
                break;
        }
        return temp;
    },
    /**
     * 计算排列3，福彩3D直选和值的注数
     * @param num
     * @return
     */
    getZhiXuanHeZhiNote: function (num) {
        var temp = 0;
        var sum = parseInt(num);
        switch (sum) {
            case 0:
            case 27:
                temp = 1;
                break;
            case 1:
            case 26:
                temp = 3;
                break;
            case 2:
            case 25:
                temp = 6;
                break;
            case 3:
            case 24:
                temp = 10;
                break;
            case 4:
            case 23:
                temp = 15;
                break;
            case 5:
            case 22:
                temp = 21;
                break;
            case 6:
            case 21:
                temp = 28;
                break;
            case 7:
            case 20:
                temp = 36;
                break;
            case 8:
            case 19:
                temp = 45;
                break;
            case 9:
            case 18:
                temp = 55;
                break;
            case 10:
            case 17:
                temp = 63;
                break;
            case 11:
            case 16:
                temp = 69;
                break;
            case 12:
            case 15:
                temp = 73;
                break;
            case 13:
            case 14:
                temp = 75;
                break;
            default:
                break;
        }
        return temp;
    },

    /**
     * 计算三星组选和值的注数
     * @param num
     * @return
     */
    getSanXingZuXuanHeZhiNote: function (num) {
        var temp = 0;
        var sum = parseInt(num);
        switch (sum) {
            case 1:
            case 26:
                temp = 1;
                break;
            case 2:
            case 3:
            case 24:
            case 25:
                temp = 2;
                break;
            case 4:
            case 23:
                temp = 4;
                break;
            case 5:
            case 22:
                temp = 5;
                break;
            case 6:
            case 21:
                temp = 6;
                break;
            case 7:
            case 20:
                temp = 8;
                break;
            case 8:
            case 19:
                temp = 10;
                break;
            case 9:
            case 18:
                temp = 11;
                break;
            case 10:
            case 17:
                temp = 13;
                break;
            case 11:
            case 12:
            case 15:
            case 16:
                temp = 14;
                break;
            case 13:
            case 14:
                temp = 15;
                break;
            default:
                break;
        }

        return temp;
    }
};

function getArraySelect(n, array1, array2) {
    var temp = 0;
    for (var i = 0; i < array1.length; i++) {
        var m = 0;
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] != array2[j]) {
                m++;
            }
            ;
        }
        ;
        temp += mathUtil.getCCombination(m, n);
    }
    ;
    return temp;
}

/**
 * [bigNumberUtil 对金额大数据、浮点数处理]
 * @type {Object}
 */
var bigNumberUtil = {
    /**
     * 转换成BigNumber
     */
    toBigNumber: function (value) {
        return isNaN(value) ? new BigNumber("0") : new BigNumber(value);
    },
    /**
     * BigNumber进行加法运算
     */
    add: function (value1, value2) {
        return bigNumberUtil.toBigNumber(value1).plus(bigNumberUtil.toBigNumber(value2)).toNumber();
    },

    /**
     * BigNumber进行减法运算
     */
    minus: function (value1, value2) {
        return bigNumberUtil.toBigNumber(value1).minus(bigNumberUtil.toBigNumber(value2)).toNumber();
    },

    /**
     * BigNumber进行乘法运算
     */
    multiply: function (value1, value2) {
        return bigNumberUtil.toBigNumber(value1).times(bigNumberUtil.toBigNumber(value2)).toNumber();
    },

    /**
     * BigNumber进行除法运算
     */
    divided: function (value1, value2) {
        return bigNumberUtil.toBigNumber(value1).dividedBy(bigNumberUtil.toBigNumber(value2)).toNumber();
    },

    /**
     * BigNumber进行取整运算
     */
    dividedToInt: function (value1, value2) {
        return bigNumberUtil.toBigNumber(value1).dividedToIntegerBy(bigNumberUtil.toBigNumber(value2));
    },


    /**
     * 处理大数据的金额
     * value 金额
     * pointNum 小数点后保留几位
     */
    getBalanceRealMoney: function (value, pointNum) {
        var temp = bigNumberUtil.divided(value, 10000).toFixed(pointNum + 1).toString();
        return temp.substring(0, temp.length - 1);
    },

    /**
     * 取绝对值
     */
    getRealMoney: function (value, pointNum) {
        var temp = Math.abs(bigNumberUtil.divided(value, 10000)).toFixed(pointNum + 1).toString();
        return temp.substring(0, temp.length - 1);
    }

};

var ObjUtil = {
    /********** 判断对象是否为空  **********/
    isEmpty: function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    }
}

function isLogIn(data) {
    if (data.LoginState == true) {
        localStorageUtils.setParam("isLogin", "true");
        return true;
    } else {
        if (data.ErrorCode == 2) {
            toastUtils.showToast("用户名或密码错误!");
            localStorageUtils.setParam("isLogin", "false");
        } else if (data.ErrorCode == 3) {
            toastUtils.showToast("您的账户被锁定!");
            localStorageUtils.setParam("isLogin", "false");
            return false;
        } else if (data.ErrorCode == 4 || data.ErrorCode == 5) {
            toastUtils.showToast("您的账号被限制登录!");
            localStorageUtils.setParam("isLogin", "false");
            return false;
        } else if (data.ErrorCode == 6) {
            toastUtils.showToast("您的账号被冻结!");
            localStorageUtils.setParam("isLogin", "false");
            return false;
        } else if (data.SystemState == 2) {
            toastUtils.showToast("登录异常!");
            localStorageUtils.setParam("isLogin", "false");
            return false;
        } else {
            toastUtils.showToast("网络异常!");
            localStorageUtils.setParam("isLogin", "false");
            return false;
        }
    }
}
/**
 * 重新登录
 * [loginAgain description]
 * @return {[type]} [description]
 */
function loginAgain() {
    localStorageUtils.setParam("isLogin", "false");
    goBack.loginPage();
}
/**
 * [description]
 * @param  {[type]} funName [方法名]
 * @return {[type]}         [description]
 */
function catchErrorFun(funName) {
    try {
        eval(funName);
    } catch (e) {
        log.a(e.message);
        toastUtils.showToast_callBack("页面存在异常，返回首页....",
            '$.ui.loadContent("#lotteryHallPage", true, false, "slide");');
    }
}

$(function () {
    try {
        window.localStorage.foobar = "foobar";
    } catch (e) {
        $.ui.popup({
            addCssClass: 'afBigPopup',
            title: "提示信息",
            message: ("本地储存写入错误，若为safari浏览器请关闭隐身模式或无痕浏览。"),
            cancelText: "确定",
            cancelClass: "alertPopup button", // {margin: "34px 0 0 0"}
            cancelCallback: function () {
            },
            cancelOnly: true
        });
    }
});

/**
 * [createInitPanel_Fun 创建panel及跳转页面]
 * @param  {[type]} panelID [panelID（页面ID）]
 * @param  {[type]} back    [是否返回]
 * @return {[type]}         [description]
 */
function createInitPanel_Fun(panelID, back) {
    panelID = panelID.replace("#", "");
    if (!panelID) {
        return false;
    }
    var $that = $("#" + panelID);
    if (!$that.length) {
        var isOk = createPanelHtml_Fun(panelID);
        if (!isOk) {
            $.ui.loadContent("#lotteryHallPage", false, false, "slide");
            return false;
        }
        var el = $("#" + panelID).get(0);
        el.parsedContent = 1;
        $.ui.addDivAndScroll(el);
        $.ajax({
            async: false,
            url: intel.xdk.webRoot + panelParam_cp[panelID]["data-defer"],
            success: function (data) {
                if (data.length > 0) {
                    $.ui.updatePanel(panelID, data);
                    $.ui.parseScriptTags($.query("#" + panelID).get(0));
                }
            },
            error: function (msg) {
                log.v("Error with deferred load " + panelParam_cp[panelID]["data-defer"]);
            }
        });

        if ($.query("nav").length == 1) {
            var splitViewClass = $.ui.splitview ? " splitview" : "";
            $.query("#afui #header").addClass("hasMenu" + splitViewClass);
            $.query("#afui #content").addClass("hasMenu" + splitViewClass);
            $.query("#afui #navbar").addClass("hasMenu" + splitViewClass);
            $.query("#afui #menu").addClass("hasMenu" + splitViewClass);
            $.query("#afui #aside_menu").addClass(splitViewClass);
        }
        if ($.query("aside").length == 1) {
            $.query("#afui #header, #afui #content, #afui #navbar").addClass("hasAside");
        }
    }
    $.ui.loadContent("#" + panelID, false, back || false, "slide");
}

/**
 * [createPanelHtml_Fun 创建panelDIV]
 * @param  {[type]} panelID [panelID]
 * @return {[type]}         [description]
 */
function createPanelHtml_Fun(panelID) {
    panelID = panelID.replace("#", "");
    if (!panelID || $("#" + panelID).length) {
        return false;
    }

    if (!panelParam_cp[panelID]) {
        log.a("createPanelHtml_Fun中配置错误");
        return false;
    }

    var $div = $('<div id="' + panelID + '"></div>').attr(panelParam_cp[panelID]);
    $("#content").append($div);

    return $div;
}

function backFn() {
    var activeID = $.ui.activeDiv.id;
    var urlHistoryID = $.ui.backPageConfig[activeID];
    //log.a(activeID + "???" + urlHistoryID);
    if (!urlHistoryID || urlHistoryID == activeID) {
        urlHistoryID = "lotteryHallPage";
    }
    createInitPanel_Fun(urlHistoryID);
}

/**
 * [goMyLottery_Fun 跳转我的彩票页面]
 * @return {[type]} [description]
 */
function callMyLottery_Fun() {
    if (localStorageUtils.getParam("isLogin") == "true") {
        setPanelBackPage_Fun('myLottery');
    } else {
        setPanelBackPage_Fun('loginPage');
    }
}

/**
 * [goMyLottery_Fun 跳转提款页面]
 * @return {[type]} [description]
 */
function callTiKuan_Fun() {
    cpAPI.getDrawingInfo('{}', function (data) {
        console.info(data);
        if (data.state == 501) {
            setPanelBackPage_Fun('loginPage');
        } else if (data.state == 500001 || data.state == 500002 || data.state == 500003 || data.state == 500004 || data.state == 500005) {
            //未设置提款密码 500001
            //银行信息未绑定 500002
            //银行信息不完善 500003
            //手机号码未绑定 500004
            //未进行实名认证 500005
            toastUtils.showToast("请完善提款资料。");
            createInitPanel_Fun('safetyCenter');
        } else if (data.state == 200) {//获取提款数据成功
            createInitPanel_Fun('tikuan');

            var _user = sessionStorageUtils.getParam("user");
            $("#tikuan_username").text(_user.name);
            _user.money = Number(data.obj.remainMoney).toFixed(2);
            sessionStorageUtils.setParam("user", _user);
            $("#tikuan_yue").text(_user.money);
            $("#tikuan_name").text(data.obj.idCardName);
            $("#tikuan_bank").text(bank[data.obj.partBankName].name);
            $("#tikuan_zhanghu").text(data.obj.bankCard);

        }
    });
}

/**
 * [callProtocal_help_Fun 设置panel返回页面]
 * @return {[type]} [description]
 */
function setPanelBackPage_Fun(panelID) {
    // 设置当前页面为返回页面
    var backPage = $.ui.activeDiv.id;

    // 获取返回页面历史
    var backH = jsonUtils.toJson(jsonUtils.toString($("#afui").data("backPageHistory")));
    if (!backH) {
        backH = {};
    }

    // 设置跳转页的返回页面
    backH[panelID] = backPage;
    $("#afui").data("backPageHistory", backH);
    createInitPanel_Fun(panelID, true);
}

/**
 * [getPanelBackPage_Fun 获取panel返回页面]
 * @param  {[type]} panelID [description]
 * @return {[type]}         [description]
 */
function getPanelBackPage_Fun() {
    // 当前页面
    var activeDiv = $.ui.activeDiv.id;

    // 获取返回页面历史
    var backH = jsonUtils.toJson(jsonUtils.toString($("#afui").data("backPageHistory")));
    if (!backH) {
        backH = {};
    }

    // 获取当前页面跳转页面
    var backPage = backH[activeDiv];
    var noFirstDiv = true;
    if (!backPage || backPage == activeDiv) {
        noFirstDiv = false;
        backPage = "lotteryHallPage";
    }

    // 返回首页时清空记录
    if (backPage == $.ui.firstDiv.id) {
        $("#afui").removeData('backPageHistory');
    }
    createInitPanel_Fun(backPage, noFirstDiv);
}

/**
 * 实名验证
 */
function vilidata(start, name) {
    // alert(start)
    var tempString = "";
    switch (name) {
        case 'certification':
        case 'info':
            if (!start) {
                tempString = "未实名认证"
            } else {
                tempString = "已认证"
            }
            break;
        case 'email':
            if (!start) {
                tempString = "未绑定"
            } else {
                tempString = sessionStorageUtils.getParam("user").email;
            }
            break;
        case 'phone':
            if (!start) {
                tempString = "未绑定"
            } else {
                tempString = sessionStorageUtils.getParam("user").mobile;
            }
            break;
        case 'bank':
            if (!start) {
                tempString = "未绑定"
            } else {
                tempString = "已绑定";
            }
            break;
        case 'tkpassword':
            if (!start) {
                tempString = "未设置"
            } else {
                tempString = "已设置"
            }
            break;
    }
    return tempString;
}

//@ 获取今天日期前后 N 天,N 月,N 年。
function initDefaultDate(n,timeUnit) {
    var curr_date = new Date();
    if (timeUnit === 'day') {
        curr_date.setDate(curr_date.getDate() + n);
    } else if (timeUnit === 'month') {
        curr_date.setMonth(curr_date.getMonth() + n);
    } else if (timeUnit === 'year') {
        curr_date.setFullYear(curr_date.getFullYear() + n);
    }
    var strYear = curr_date.getFullYear();
    var strMonth = curr_date.getMonth()+1;
    var strDay = curr_date.getDate();
    var strHours = curr_date.getHours();
    var strMinutes = curr_date.getMinutes();

    var datastr = strYear + '/' + formatNumber(strMonth) + '/' + formatNumber(strDay);

    function formatNumber(value){
        return (value < 10 ? '0' : '') + value;
    }
    return datastr;
}

//@ limit a string'length that containing numbers, letters, Chinese and symbols...
function limitLength(element,limit) {
    var str = element.value;
    var len = 0, i = 0;
    while (len < limit && i < str.length) {
        len += 1;
        if (str.substring(i, i + 1).match(/[\u4e00-\u9fa5]/)) len += 1; //一个中文是相当于2个英文
        i += 1;
    }
    return str.substring(0, i);
}

//判断一个包含中英文字符串的长度
function getStrLength_EnCn(str) {
    var cArr = str.match(/[^\x00-\xff]/ig);
    return str.length + (cArr == null ? 0 : cArr.length);
}

//@ 只能输入2位小数
function ValidateNumberTwoDecimal(element, pnumber) {
    if (!(/^\d+[.]?\d*$/.test(pnumber))) {
        //检测正则是否匹配
        element.value = /^\d+[.]?\d*/.exec(element.value);
        pnumber = element.value;
    }
    var temp=pnumber.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
    return element.value = temp;
}


//@ 判断密码强度
function checkPasswordStrong(sValue) {
	var modes = 0;
	sValue = sValue + "";
	//正则表达式验证符合要求的
	if (sValue.length < 1) return modes;
	if (/\d/.test(sValue)) modes++; //数字
	if (/[a-z]/.test(sValue)) modes++; //小写
	if (/[A-Z]/.test(sValue)) modes++; //大写
	if (/\W/.test(sValue)) modes++; //特殊字符

	//逻辑处理 1=弱，2/3=中，4=强
	switch (modes) {
		case 1:
			return 1;
			break;
		case 2:
			return sValue.length < 6 ? 1 : 2;
		case 3:
		case 4:
			return (sValue.length < 10) ? (sValue.length < 6 ? 1 : 3) : 4;
			break;
		default:
			return 1;
			break;
	}
}

//@ 密码强度显示
var pwd_strong = 1;
function check_pwd_strong(ele) {
	ele.value=ele.value.replace(/^ +| +$/g,'');
	if(ele.value){
		var result = checkPasswordStrong(ele.value);
		$(".pwd-strong").show();
		var ruo_color = "#ea515c",
			zhong_color = "#f07e40",
			qiang_color = "#43af6c",
			no_color = "#ccc",
			text_light = "#fafafa",
			text_dark = "rgba(255,255,255,0.4)";

		pwd_strong = result;
		if(result == 1){  //弱
			$(".pwd-strong span:nth-of-type(1)").css({"backgroundColor":ruo_color,"color":text_light})
				.siblings("span")
				.css({"backgroundColor":no_color,"color":text_dark});
		}else if(result == 2 || result ==3){  //中
			$(".pwd-strong span:nth-of-type(1)").css({"backgroundColor":zhong_color,"color":text_dark});
			$(".pwd-strong span:nth-of-type(2)").css({"backgroundColor":zhong_color,"color":text_light});
			$(".pwd-strong span:nth-of-type(3)").css({"backgroundColor":no_color,"color":text_dark});
		}else if(result > 3){ //强
			$(".pwd-strong span").css({"backgroundColor":qiang_color,"color":text_dark});
			$(".pwd-strong span:nth-of-type(3)").css({"color":text_light});
		}
	}else {
		$(".pwd-strong").hide();
	}
}

//@ 密码强度提醒
function isToastPwdStrong() {
	var isToastPwd = Number(localStorageUtils.getParam("isToastPwd"));
	var loginPasswd = localStorageUtils.getParam("LoginPasswd");

	if( isToastPwd && (loginPasswd == "123456" || loginPasswd == "123456a" || loginPasswd == "a123456") ){
		toastUtils.showToast("您的登录密码强度太低，请重新设置！");
		localStorageUtils.setParam("isToastPwd",0);
	}
}