
'use strict';

//旧密码、新密码、确认密码、旧提款密码、新提款密码、确认提款密码
var oldPassword, newPassword, confirmPassword = "";
//用户名
var userName = "";
//是否为强制修改密码，loginPage - setParam.
var LoginPwdForced;

//@ 进入页面加载
function modifyPasswordLoadedPanel(){
  catchErrorFun("modifyPasswordInit();");
}

//@ 页面离开时加载
function modifyPasswordUnloadedPanel(){
	$("#oldPassword").val("");
	$("#newPassword").val("");
	$("#confirmPassword").val("");
}

//@ 初始化
function modifyPasswordInit(){
	userName = localStorageUtils.getParam("username");
	LoginPwdForced = localStorageUtils.getParam('LoginPwdForced');
	if (!LoginPwdForced){
		LoginPwdForced = "false";
	}

	if (LoginPwdForced == 'true'){
		$('#modifyPasswordHeader >a').hide();
		$('#oldPassword').hide();
		$('#oldPassword').prev('p').html('温馨提示：您的登录密码强度过低，请修改后重新登录！<br>请勿设置"123456"，"123456a","a123456"等低强度密码.').css({'color':'#b89a48','padding':'5px 10px'});
	}else {
		$('#modifyPasswordHeader >a').show();
		$('#oldPassword').show();
		$('#oldPassword').prev('p').html('原登录密码:').css({'color':'#666','padding':'0 10px'});
	}

	//密码强度默认隐藏
	$(".pwd-strong").hide();

	//修改按钮点击事件
    $("#loginSubmitId").off('click');
	$("#loginSubmitId").on('click', function() {
		oldPassword = LoginPwdForced == "true" ? localStorageUtils.getParam("LoginPasswd") : $("#oldPassword").val();
		newPassword = $("#newPassword").val();
		confirmPassword = $("#confirmPassword").val();

		if (oldPassword == "" && LoginPwdForced == "false") {
			toastUtils.showToast("原始密码不能为空");
			return;
		}

		if (newPassword == "") {
			toastUtils.showToast("新密码不能为空");
			return;
		} else if (newPassword.length < 6) {
			toastUtils.showToast("新密码长度不能小于6位");
			return;
		} else if(pwd_strong < 2){
			toastUtils.showToast("您设置的密码强度太低，请重新设置！");
			return;
		}

		if (confirmPassword == "") {
			toastUtils.showToast("确认密码不能为空");
			return;
		} else if (confirmPassword != newPassword) {
			toastUtils.showToast("确认密码与新密码不一致");
			return;
		}
		var test = /^[a-zA-Z0-9]{6,20}$/;
		//正则表达式
		if (!test.exec(confirmPassword)) {
			toastUtils.showToast("密码只能为字母和数字");
			return false;
		}
           //字母验证
			var zm =/^[a-zA-Z]+$/;
			//数字验证
			var sz =/^[0-9]*$/;
			//有数字和英文字母组合
			var zmsz =/^[0-9a-zA-Z]+$/;
			var newPwd = confirmPassword;
			var zm1 = zm.test(newPwd);
			var sz1 = sz.test(newPwd);
			var zmsz1 = zmsz.test(newPwd);
			//提取字符串中的数字
            var shuzi = newPwd.replace(/[^0-9]/ig,""); 
            //提取字符串中的字母
			var zimu=newPwd.match(/^[a-z|A-Z]+/gi,"");
			if(isChina(newPwd)){
				toastUtils.showToast("密码只能为(6-16)位字母和数字混合组成");
				return false;
			}								
			if(zm1){
				toastUtils.showToast("密码只能为(6-16)位字母和数字混合组成");
				return false;
			}
			if(sz1){
				toastUtils.showToast("密码只能为(6-16)位字母和数字混合组成");
				return false;
			}
			if(shuzi=="" && zimu==null){
				toastUtils.showToast("密码只能为(6-16)位字母和数字混合组成");
				return false;
			}
			if(newPwd.length < 6){
				toastUtils.showToast("密码只能为(6-16)位字母和数字混合组成");
				return false;
			}
			
			if (newPassword == confirmPassword){
					if(newPassword == "a123456" || newPassword == "123456a" || newPassword == "123456"){
							toastUtils.showToast("您设置的密码强度太低，请重新输入密码！");
							return;
					}
			}
			
		//Type:0 -- 登录和资金密码可以一致，Type:1 -- 登录和资金密码不可一致。
		 var param = '{"ProjectPublic_PlatformCode":2,"Type":0,"UserName":"' + userName + '","LogPassword":"' + oldPassword + '","NewPassword":"' + confirmPassword + '","InterfaceName":"ModifyPwdInfo"}';
		    ajaxUtil.ajaxByAsyncPost1(null, param, changeWithdrawalPwdCallBack,null);
			});
}	/**
	 * Description 修改密码回调函数
	 * @param
	 * @return data 服务端返数据
	 */
	function changeWithdrawalPwdCallBack(data) {
		//隐藏动画
		if (data.SystemState == 64) {
			if (data.ModifyComplete) {
				toastUtils.showToast("登录密码修改成功");
				$("#oldPassword").val("");
				$("#newPassword").val("");
				$("#confirmPassword").val("");

				localStorageUtils.setParam('LoginPwdForced',false);
				localStorageUtils.removeParam('LoginPasswd');
				$("#passwd").val('');
				loginAgain();
			} else {
				toastUtils.showToast("原始密码不正确");
			}
		} else if (data.Result == "-1") {
			toastUtils.showToast("原始密码不正确");
		} else if (data.Result == "-2") {
			toastUtils.showToast("登录密码不能和资金密码一致!");
		} else if(data.ErrorState == "-4"){
			toastUtils.showToast("当前用户已被冻结!");
		} else if(data.ErrorState == "-5"){
			toastUtils.showToast("密码输错次数过多，用户已被冻结!");
		}else {
			toastUtils.showToast("当前网络不给力，请稍后再试");
		}
	}