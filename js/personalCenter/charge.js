
//用户名
var userName = "";
//币种
var moneyType = "";
//是否注册真实姓名
var isHasName = false;
//充值金额
var payMoney = "";
//充值银行
var bank = "";
//支付类型
var type = "";
var test;
var bankID;

/**
 * 进入页面加载
 * [chargeLoadedPanel description]
 * @return {[type]} [description]
 */
function chargeLoadedPanel() {
    catchErrorFun("chargeInit();");
}

/**
 * 页面离开时加载
 * [chargeUnloadedPanel description]
 * @return {[type]} [description]
 */

function chargeUnloadedPanel() {
    flag=6;
    $("#tonghangzz").empty();
    $("#tonghangpayMoney").val("");
}

/**
 * 初始化
 * [chargeInit description]
 * @return {[type]} [description]
 */
function chargeInit(){
    $("#tonghangzz").empty();
    localStorageUtils.setParam("loginState","2");
    Array.prototype.S = String.fromCharCode(2);
    Array.prototype.in_array = function(e) {
        var r = new RegExp(this.S + e + this.S);
        return (r.test(this.S + this.join(this.S) + this.S));
    };
    var bettingIndex = localStorageUtils.getParam("userRechargeTypeList"); //网银充值checked
    //获取字符串格式的银行信息并转化为JSON格式使用
    var allRecType = jsonUtils.toJson(localStorageUtils.getParam("allRecType"));
    test = JSON.parse(bettingIndex);
    var testDIV = "";
    //获取后台银行名称，并将选中的选项展示到页面
    for (var i = 0; i < test.length; i++) {
        for(var j=0;j<allRecType.length;j++){  //** 获取银行名称 start
            if(test[i].id == allRecType[j].Pay){
                if(i==0){
                    bankID=test[i].id;
                    testDIV += '<a onclick="to_change('+test[i].id+');"><dd><div class="userName">' + allRecType[j].PayName + '</div><div id="chongzhi' + test[i].id + '"   class="checkBoxA"></div></dd></a>';
                    setValiDate(test[i].maxRecMoney,test[i].minRecMoney);
                }else{
                    testDIV += '<a onclick="to_change('+test[i].id+');"><dd><div class="userName">' + allRecType[j].PayName + '</div><div id="chongzhi' + test[i].id + '"  class="checkBox"></div></dd></a>';
                }

            }
        }  //** 获取银行名称 end
    }
    $("#tonghangzz").append(testDIV);

    ajaxUtil.ajaxByAsyncPost(null, '{"ProjectPublic_PlatformCode":2,"InterfaceName":"GetUserAllMoney"}', GetUserAllMoney_charge, null);
    userName = localStorageUtils.getParam("username");
    moneyType = localStorageUtils.getParam("moneyType");
    $(".redtext").html(moneyType);

    ajaxUtil.ajaxByAsyncPost(null, '{"ProjectPublic_PlatformCode":2,"UserName":"' + userName + '","InterfaceName":"GetUserDetailNew"}', successCallBack_GetUserDetail, null);

    //提交按钮
    $("#tonghangsubmit").off('click');
    $("#tonghangsubmit").on("click", function() {
        postSubmit();
    });

//My18类 显示提示，在线方式不提示
	if ($.inArray( Number(bankID), [151,152,153,154,155,156,157,158,159,160,161,162,163,164,165]) != -1){
		$("#hint").show();
	}else{
		$("#hint").hide();
	}

    $("#show_icbc_hint").hide();
    $("#show_other_hint").show();
}
//选择银行，当前银行被选中
function to_change(id){
    bankID=id;
    for (var j = 0; j < test.length; j++) {
        $('#chongzhi'+test[j].id+'').removeClass('checkBoxA');
        $('#chongzhi'+test[j].id+'').addClass('checkBox');
        if(id == test[j].id){
            $('#chongzhi'+test[j].id+'').removeClass('checkBox');
            $('#chongzhi'+test[j].id+'').addClass('checkBoxA');
            $("#textID").html("充值金额(重要提示：范围为"+test[j].minRecMoney+"-"+test[j].maxRecMoney+")");
        }
    }
    //My18类 显示提示，在线方式不提示
    if ($.inArray(id, [151,152,153,154,155,156,157,158,159,160,161,162,163,164,165]) != -1){
        $("#hint").show();
    }else{
        $("#hint").hide();
    }

    if (id == 151){
        $("#show_icbc_hint").show();
        $("#show_other_hint").hide();
    }else{
        $("#show_icbc_hint").hide();
        $("#show_other_hint").show();
    }
}

function setValiDate(maxRecMoney, minRecMoney){
    $("#textID").html("充值金额(重要提示：范围为"+ minRecMoney +"-"+ maxRecMoney +")");
}

function getValiDate(bankID,payMoney){
    var temp=true;
    for (var j = 0; j < test.length; j++) {
        if(bankID == test[j].id){
            if (parseFloat(payMoney) > test[j].maxRecMoney || parseFloat(payMoney) < test[j].minRecMoney) {
                toastUtils.showToast('充值金额范围'+test[j].minRecMoney+"-"+test[j].maxRecMoney);
                temp=false;
                return;
            }
        }
    }
    return temp;
}

//获取用户名和账户余额
function GetUserAllMoney_charge(data) {
    if (data.state) {
        var info = data.Context;
        var lotteryMoney = data.lotteryMoney;
        $("#welcomeUser").html(data.userName);
        localStorageUtils.setParam("lotteryMoney", parseFloat(lotteryMoney));
        if (lotteryMoney != null || typeof (lotteryMoney) != "undefined") {
            $("#lotteryMoney").html(parseFloat(lotteryMoney) + "元");
        } else {
            $("#lotteryMoney").html("0.0000" + "元");
        }
    }
}

/**
 * Description 查询用户信息回调函数
 * @return data 服务端返数据
 */
function successCallBack_GetUserDetail(data) {
    if (data.SystemState == 64) {
        if (data.UserRealName != "") {
            isHasName = true;
        } else {
            isHasName = false;
        }
    } else if (data.Result == "-1") {
        loginAgain();
    } else if (data.SystemState == "-1") {
        loginAgain();
    } else {
        toastUtils.showToast("当前网络不给力，请稍后再试");
    }
}

//@提交按钮
function postSubmit(){
    var RechargeType = rechargeID[bankID]['typeID'] ? rechargeID[bankID]['typeID'] : 6;
    // 快捷支付方式
    if (rechargeID[bankID]['fastPay'] || rechargeID[bankID]['onlinePay']){
        var message = $('<select></select>');
        $.each(rechargeID[bankID]['name'], function (key, val) {
            message.append('<option value="'+ val +'">'+ bankValue[val].name +'</option>');
        });
        setTimeout(function () {
            $.ui.popup({
                title:"请选择银行",
                message: message,
                cancelText:"关闭",
                cancelCallback:
                    function(){
                    },
                doneText:"确定",
                doneCallback:
                    function(){
                        bank = message.val();
                        submitPaymentInfo(bank,RechargeType);
                    },
                cancelOnly:false
            });
        },300);
    }else{
        bank = rechargeID[bankID]['name'];
        submitPaymentInfo(bank,RechargeType);
    }
}

//@ 提交充值信息
function submitPaymentInfo(bank, RechargeType) {
    payMoney = $("#tonghangpayMoney").val();
    localStorageUtils.setParam("chargetype", bank);

    if (payMoney == "") {
        toastUtils.showToast("请输入充值金额");
        return;
    }
    if(!getValiDate(bankID,payMoney)){
        return;
    }

	//充值详情页充值按钮，置为可点击
	localStorageUtils.setParam("clickChargeBtn",true);

    var param='{"ProjectPublic_PlatformCode":2,"InterfaceName":"AddRechargeInfo",RechargeMoney:"' + payMoney + '",BankCode:"' + bank + '",RechargeType:"' + RechargeType + '"}';
    ajaxUtil.ajaxByAsyncPost(null,param,saveSuccessCallBackAddRechargeInfo,"数据提交中...",null);
}

/**网银支付
 * Description 充值回调函数
 * @return data 服务端返数据
 */
function saveSuccessCallBackAddRechargeInfo(data) {
    if (data.Result == "1") {
        var info = data.Context;
        for (var i = 0; i < info.length; i++) {
            var bankURL = info[i].BankUrl;
            var payBank = info[i].PayBank;  //充值银行
            var payBankName = info[i].PayBankName;
            var payBankAccount = info[i].PayBankAccount;
            var payMoney = info[i].PayMoney;
            var fuyan=info[i].PayFuYan;
            var payName=info[i].PayName;  //从后台获取银行名称
            var pType=info[i].PType;  //获取PType值
            var mValue=info[i].MValue;
            var OrderID = info[i].OrderID;

            if(pType == "15") {   //***** start
                if (bankURL == "" || payBank == "") {
                    toastUtils.showToast("系统繁忙,请稍后再试!");
                } else {
                    localStorageUtils.setParam("bankURL", bankURL);
                    localStorageUtils.setParam("payBank", payBank);
                    localStorageUtils.setParam("payBankName", payBankName);
                    localStorageUtils.setParam("payName", payName);
                    localStorageUtils.setParam("payBankAccount", payBankAccount);
                    localStorageUtils.setParam("payBankMoney", payMoney);
                    localStorageUtils.setParam("fuyan", fuyan);
                    localStorageUtils.setParam("pType", pType); //充值类型
                    localStorageUtils.setParam("OrderID", OrderID);
                    createInitPanel_Fun("chargeDetailConfirm");
                }
            }else {   //在线支付方式
                if (mValue == "" && bankURL == "") {
                    toastUtils.showToast("系统繁忙,请稍后再试!");
                }else{
                    localStorageUtils.setParam("payBankMoney", payMoney); //充值金额
                    localStorageUtils.setParam("pType", pType); //充值类型
                    localStorageUtils.setParam("bankURL", bankURL); //URL
                    localStorageUtils.setParam("mValue", mValue); //URL
	                // 有的支付方式会返回QQ/Alipay 等唤醒链接
                    localStorageUtils.removeParam("AwakenUrl");
                    if(info[i].AwakenUrl != null ){
	                    localStorageUtils.setParam("AwakenUrl", info[i].AwakenUrl); //唤醒Url
                    }
                    createInitPanel_Fun("chargeDetailConfirm");
                }
            }  //**** end
        }
    } else if (data.SystemState == "-1") {
        loginAgain();
    } else if (data.Result == "-5"||data.Result == "-1") {
        toastUtils.showToast("系统繁忙,请稍后再试!");
    } else {
        toastUtils.showToast("充值申请失败，稍候请重试");
    }
}

function jineOcl(el){
    payMoney =el.value;
    if (payMoney == "") {
        toastUtils.showToast("请输入正确的充值金额");
        return;
    }
    var temp=payMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
    $("#tonghangpayMoney").val(temp);
}

function ValidateNumber12(e, pnumber) {
    if (!/^\d+[.]?\d*$/.test(pnumber))
    {
        //检测正则是否匹配
        e.value = /^\d+[.]?\d*/.exec(e.value);
    }
    var payMoney = $("#tonghangpayMoney").val();
    var temp=payMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
    $("#tonghangpayMoney").val(temp);
    return false;
}