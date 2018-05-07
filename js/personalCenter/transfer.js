'use strict';
var userName = "";
//@ 进入页面加载
function transferLoadedPanel(){
	catchErrorFun("transferLoadedinit();");
}

//@ 页面离开时加载
function transferUnloadedPanel(){
	flag=6;
	$("#transferMoney").val("");
	$("#fundPassword").val("");
	$("#fundTransfer").val("5");
}

//@ 初始化
function transferLoadedinit(){
	$("#fundTransfer").val("5");
	changeTransferType();
	//lotteryBalance 彩票余额
	$("#lotteryBalance").html(localStorageUtils.getParam("lotteryMoney"));

	//GameBalance 棋牌余额
	userName = localStorageUtils.getParam("username");
	var param = '{"ProjectPublic_PlatformCode":2,"InterfaceName":"KYGetGamerBalance","UserName":"'+ userName +'"}';
	ajaxUtil.ajaxByAsyncPost1(null, param, function (data) {
		if(data.SystemState == 64){
			data.KYBalance ? $("#gameBalance").html(data.KYBalance) : $("#gameBalance").html('0');
		} else if (data.SystemState == "-1") {
			loginAgain();
		}
	},null);

	//提交按钮
	$("#transferSubmit").off('click');
	$("#transferSubmit").on("click", function() {
		postTransferSubmit();
	});
}

//@ 输入全部金额
function inputAllMoney() {
	var type = $("#fundTransfer").val();
	if(type == "5" && parseInt(strSliceToNum($("#lotteryBalance").text(),2)) > 0){
		$("#transferMoney").val(strSliceToNum($("#lotteryBalance").text(),2));
	}else if (type == "6" && parseInt(strSliceToNum($("#gameBalance").text(),2)) > 0){
		$("#transferMoney").val(strSliceToNum($("#gameBalance").text(),2));
	}
}

function changeTransferType() {
	$("#transferMoney").val("");
	$("#fundPassword").val("");
}

//@ Submit Button
function postTransferSubmit() {
	var type = $("#fundTransfer").val();
	var transferMoney = Number($("#transferMoney").val());
	var fundPassword = $("#fundPassword").val();

	if(transferMoney == ''){
		toastUtils.showToast("请输入转账金额");
		return;
	} else if(transferMoney > 50000){
		toastUtils.showToast("转账金额不能大于 50000");
		return;
	}else if(transferMoney <= 0){
		toastUtils.showToast("转账金额需大于等于0");
		return;
	} else{
		if (type == "5"){
			if ( transferMoney > Number($("#lotteryBalance").text()) ){
				toastUtils.showToast("彩票余额不足");
				return;
			}
		}else if (type == "6"){
			if ( transferMoney > Number($("#gameBalance").text()) ){
				toastUtils.showToast("棋牌余额不足");
				return;
			}
		}
	}

	if(fundPassword == ''){
		toastUtils.showToast("请输入资金密码");
		return;
	}else{
	}

	var param = '{"ProjectPublic_PlatformCode":2,"InterfaceName":"KYTransefer","UserName":"'+ userName +'","TranseferType":"'+ type +'","TranseferMoney":'+ transferMoney +',"PayPassWord":"'+ fundPassword +'"}';
	ajaxUtil.ajaxByAsyncPost1(null, param, function (data) {
		if (data.SystemState == 64){
			if (data.ResultCode == "0"){
				toastUtils.showToast("转账成功");
				$("#transferMoney").val("");
				$("#fundPassword").val("");
				setPanelBackPage_Fun("myLottery");
			}else if (data.OrderState == -3){
				toastUtils.showToast("支付密码错误");
				$("#fundPassword").val("");
		    }else if (data.OrderState == -1){
				toastUtils.showToast("转账金额不足");
			}else if (data.OrderState == -6){
				toastUtils.showToast("调用棋牌转账失败");
			}else if (data.OrderState == -7){
				toastUtils.showToast("正在游戏中，不能转账");
			}else if (data.OrderState == -8){
				toastUtils.showToast("当前用户已被冻结无法进行转账操作");
		    }
		} else if (data.SystemState == "-1") {
			loginAgain();
		} else if(data.SystemState == 128) {
			toastUtils.showToast("转账失败，稍候请重试");
		} else {
			toastUtils.showToast("转账失败，稍候请重试");
		}
	},null);
}
