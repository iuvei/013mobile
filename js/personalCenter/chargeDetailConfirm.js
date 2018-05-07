
//返回银行链接地址
var bankURL = "";
//充值银行
var payBank = "";
//充值银行名称
var payBankName = "";
//充值银行账户
var payBankAccount = "";
//充值金额
var payMoney = "";
//币种
var moneyType = "";
//附言
var fuyan="";
//PType
var pType="";
/**
 * 进入页面加载
 * [chargeDetailConfirmLoadedPanel description]
 * @return {[type]} [description]
 */
function chargeDetailConfirmLoadedPanel() {
    catchErrorFun("chargeDetailConfirmInit();");
}
/**
 * 页面离开时加载
 * [chargeDetailConfirmUnloadedPanel description]
 * @return {[type]} [description]
 */
function chargeDetailConfirmUnloadedPanel() {
    $('#changeSubmit').html('立即付款');
    $('#changeSubmit').show();
    $('#shuomingID').hide();
    $('#remitSubmit').show();

    $('#remitName').val('');
    $('#remitTime').val('');
	localStorageUtils.removeParam("AwakenUrl");
}

/**
 * 初始化
 * [chargeDetailConfirmInit description]
 */
function chargeDetailConfirmInit(){
    var chargetype=localStorageUtils.getParam("chargetype");
    moneyType = localStorageUtils.getParam("moneyType");
    bankURL = localStorageUtils.getParam("bankURL");
    payBank = localStorageUtils.getParam("payBank");

    if(payBank){
        if(payBank.indexOf(",")>0){
            payBankVal=payBank.split(",");
        }else{
            payBankVal=payBank;
        }
    }
    payBankName = localStorageUtils.getParam("payBankName");
    payBankAccount = localStorageUtils.getParam("payBankAccount");
    payMoney = localStorageUtils.getParam("payBankMoney");
    fuyan = localStorageUtils.getParam("fuyan");
    pType=localStorageUtils.getParam("pType"); //pType
    mValue=localStorageUtils.getParam("mValue"); //mValue值区分银联或者在线支付方式

    var allRecType = jsonUtils.toJson(localStorageUtils.getParam("allRecType"));
    for(var j=0;j<allRecType.length;j++){
        if(pType==allRecType[j].Pay){
            var payName = allRecType[j].PayName; //后台银行名称
            var payValue = allRecType[j].Pay;  //pay值匹配
        }
    }

    $(".icbc_charge_btn").hide(); //工商银行跳转按钮
    $(".cmbc_charge_btn").hide(); //民生银行跳转按钮

	//按钮依据是否被点击，背景色显示不同
	var clickChargeBtn = localStorageUtils.getParam("clickChargeBtn");
	if(clickChargeBtn == false || clickChargeBtn == "false"){
		$("#changeSubmit").css("background","#999999");
	}else{
		$("#changeSubmit").css("background","linear-gradient(#e12048,#d91e3d)");
	}

    //*************** 银联支付方式 *****************
    if(pType=="15"){
        $("#chargeInfo2").hide();  //隐藏chargeInfo2
        $("#chargeInfo1").show();  //显示chargeInfo1

        $("#shuomingID").hide();  //充值提示信息，暂隐藏
        $("#remitInfo").show();
        $("#changeSubmit").hide();
        $("#remitSubmit").show();
        $('.hint_title').show();

        if(chargetype=="cmb"){  //招商银行
            $('#changeSubmit').html('支付宝转账');
            // $('#changeSubmit').show();
            clickToBank("changeSubmit", "https://shenghuo.alipay.com/send/payment/fill.htm");

        }else if (chargetype == "icbc"){  //工商银行跳转按钮
            // $(".icbc_charge_btn").hide();
            clickToBank("icbc_to_alipay", "https://auth.alipay.com/login/index.htm");
            clickToBank("icbc_to_icbc", "https://mybank.icbc.com.cn/icbc/perbank/index.jsp");
            clickToBank("icbc_to_ccb", "https://ibsbjstar.ccb.com.cn/app/V5/CN/STY1/login.jsp");
            clickToBank("icbc_to_abc", "http://www.abchina.com/cn/wydl/grwydl/default.htm");

        }else if (chargetype == "cmbc"){  //民生银行跳转按钮
            // $(".cmbc_charge_btn").hide();
            clickToBank("cmbc_to_alipay","https://auth.alipay.com/login/index.htm");
            clickToBank("cmbc_to_cmbc","http://www.cmbc.com.cn/");

            $("#cmbc_to_others").off('click');
            $("#cmbc_to_others").on("click", function() {
                var message = $('<select></select>');
                    message.append('<option value="https://mybank.icbc.com.cn/icbc/perbank/index.jsp">中国工商银行</option>' +
                        '<option value="http://www.abchina.com/cn/wydl/grwydl/default.htm">中国农业银行</option>' +
                        '<option value="https://ibsbjstar.ccb.com.cn/app/V5/CN/STY1/login.jsp">中国建设银行</option>' +
                        '<option value="https://pbank.95559.com.cn/personbank/logon.jsp">交通银行</option>' +
                        '<option value="https://pbsz.ebank.cmbchina.com/CmbBank_GenShell/UI/GenShellPC/Login/Login.aspx">招商银行</option>' +
                        '<option value="http://www.boc.cn/">中国银行</option>' +
                        '<option value="http://www.cebbank.com/">光大银行</option>' +
                        '<option value="http://ebank.spdb.com.cn/">上海浦东发展银行</option>' +
                        '<option value="http://www.psbc.com/portal/zh_CN/index.html">邮政银行</option>' +
                        '<option value="http://www.bosc.cn/">上海银行</option>' +
                        '<option value="http://www.hxb.com.cn/home/cn/">华夏银行</option>' +
                        '<option value="http://www.cib.com.cn/cn/index.html">兴业银行</option>' +
                        '<option value="http://www.cgbchina.com.cn/">广发银行</option>' +
                        '<option value="http://bank.pingan.com/">平安银行</option>' +
                        '<option value="http://www.bankofbeijing.com.cn/">北京银行</option>' +
                        '<option value="http://www.citicbank.com/">中信银行</option>' +
                        '<option value="http://www.cbhb.com.cn/bhbank/S101/index.htm">渤海银行</option>' +
                        '<option value="http://www.dongguanbank.cn/Site/Home/CN">东莞银行</option>' +
                        '<option value="http://www.hzbank.com.cn/">杭州银行</option>' +
                        '<option value="https://e.czbank.com/APPINSPECT/index.jsp">浙商银行</option>');
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
                                window.open(message.val(),"_self");
                            },
                        cancelOnly:false
                    });
                },300);
            });
        }

        $("#cashUser").val(payBankName);

        $("#cashBank").val(payBankVal[0]);

        if(payBankVal[1]){
            $("#showKaiHuBank").show();
            $("#kaiHuBank").val(payBankVal[1]);
        }else{
            $("#showKaiHuBank").hide();
        }

        $("#cashBankNo").val(payBankAccount);
        $("#cash").val(payMoney);
        $("#fuyan").val(fuyan);

        if (payBank == "农业银行ABC") {
            $("#khdz").show();
            if (payBankName == "张铸山" || payBankName == "杨玉琴") {
                $("#yhkhdz").val("河南分行营业部管城区支行紫荆山分理处");
            }
        } else if (payBank == "招商银行CMB") {
            $("#khdz").show();
            if (payBankName == "符传林") {
                $("#yhkhdz").val("郑州分行花园路支行");
            } else if (payBankName == "刘玉至") {
                $("#yhkhdz").val("郑州分行紫荆山路支行");
            }
        } else {
            $("#khdz").hide();
        }

        //打款信息
        $('#remitMoney').val(payMoney);

        $("#remitSubmit").off('click');
        $("#remitSubmit").on("click", function() {
            var remitName = $('#remitName').val().trim();
            var remitTime = $('#remitTime').val().trim();
            var OrderID= localStorageUtils.getParam("OrderID");
            if (!remitName || remitName == ''){
                toastUtils.showToast('请填写真实姓名');
                return;
            }
            if (!remitTime || remitTime == ''){
                toastUtils.showToast('请填写转账时间');
                return;
            }else if (!(/^([0-1][0-9]|2[0-3])([0-5][0-9])$/.test(remitTime))){
                toastUtils.showToast('转账时间格式不正确');
                return;
            }

            var param = '{"ProjectPublic_PlatformCode":2,"InterfaceName":"AddOrderReminder","PayRealName":"'+remitName+'","TransferAmount":"' +payMoney+ '","TransferTime":"'+remitTime+'","ReceiveName":"' + payBankName + '","ReceiveBank":"' + payBankVal[0] + '","ReceiveCardNumber":"' + payBankAccount + '","OrderNumber":"' + OrderID + '","PayCarNumber":""}';
            ajaxUtil.ajaxByAsyncPost1(null, param, function (data) {
                if (data.SystemState == 64 && data.Result == 1){
                    toastUtils.showToast("提交审核成功");
                    $('#remitSubmit').hide();
                }else{
                    toastUtils.showToast("提交审核失败");
                }
            },null);
        });


        //************  在线支付方式（区别于my18类的银行充值） ***************
    }else if(rechargeID[pType]['IsOnline']){
        $("#chargeInfo1").hide();  //隐藏chargeInfo1
        $("#chargeInfo2").show();  //显示chargeInfo2
        $("#remitInfo").hide();
        $(".hint_title").hide();

        if(pType==payValue){
            $("#chargeInfo2 #payMethod").html(payName);
            $("#chargeInfo2 #payValue").html(payMoney + "元");
        }

        //点击-立即付款
        $('#changeSubmit').html('立即付款');
        $("#changeSubmit").off('click');
        $("#changeSubmit").on("click", function() {
            // 判断是否可以再次点击按钮
	        var clickChargeBtn = localStorageUtils.getParam("clickChargeBtn");
	        if(clickChargeBtn == "false" || clickChargeBtn == false){
                toastUtils.showToast("不可重复提交订单，请重新充值");
                return;
            }else{
	            clickChargeBtn = false;
	            localStorageUtils.setParam("clickChargeBtn",clickChargeBtn);
	            $("#changeSubmit").css("background","#999999");
            }

	        var awakenUrl = localStorageUtils.getParam("AwakenUrl");  //QQ 或 Alipay 等唤醒功能
            if(awakenUrl != null){
	            if( awakenUrl.indexOf("http") != -1){
		            window.open(awakenUrl, "_self");
	            }else {
                    toastUtils.showToast("请求支付异常，请稍后再试");
                    setTimeout(function () {
                        createInitPanel_Fun("charge");
                    },2000);
	            }
            } else{
	            var param = {};
	            var mvalue2=mValue.split("$");
	            for(var i= 0;i<mvalue2.length;i+=2){
		            param[mvalue2[i]] = mvalue2[i+1];
	            }
	            post(bankURL,param);
            }
        });
    }
}

function post(URL, PARAMS) {
	var temp_form = document.createElement("form");
	temp_form .action = URL;
	temp_form .target = "_self";
	temp_form .method = "get";
	temp_form .style.display = "none";
	for (var x in PARAMS) {
		var opt = document.createElement("textarea");
		opt.name = x;
		opt.value = PARAMS[x];
		temp_form .appendChild(opt);
	}
	//添加到body中，解决Firefox中无法打开新窗口的问题
	document.body.appendChild(temp_form);
	temp_form .submit();
}

/*
 *  弹窗再次确认用户是否完成充值。
 * */
function IsChargeSucceed(){
    $.ui.popup(
        {
            title:"提示",
            message:'请您在新打开的网上银行页面完成充值',
            cancelText:"已完成充值",
            cancelCallback:
                function(){
                    createInitPanel_Fun("myChargeRecord",true);
                },
            doneText:"充值遇到问题",
            doneCallback:
                function(){
                    createInitPanel_Fun("charge",true);
                },
            cancelOnly:false
        });
}

// 点击跳转到银行
// @clickID [String] 点击按钮的ID; @url [String] 跳转链接;
function clickToBank(clickID,url) {
    $("#"+clickID+"").off('click');
    $("#"+clickID+"").on('click',function () {
        window.open(url, "_self");
    });
}