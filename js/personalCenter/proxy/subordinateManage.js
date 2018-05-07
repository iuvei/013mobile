
/*离开panel时调用*/
function subordinateManageUnloadedPanel(){
}

/*进入panel时调用*/
function subordinateManageLoadedPanel(){
    catchErrorFun("subordinateManageInit();");
}

var IsTestAccount;
var userName="";
var temp = "0";
var isHaveBankCard = false;
var securityState;

/*入口函数*/
function subordinateManageInit() {
	
	userName = localStorageUtils.getParam("username");
	IsTestAccount = parseInt(localStorageUtils.getParam("IsTestAccount"));
	
    clearSearchTerm("sub");
    isShowProxyCharge();
    var proxyMemberInfo = jsonUtils.toObject(localStorageUtils.getParam("proxyMember"));
    var proxyUsername = proxyMemberInfo.username;
    localStorageUtils.setParam("subordinateName",proxyUsername);// 日工资
    localStorageUtils.setParam("proxyUserName", proxyMemberInfo.username); //下级充值
    localStorageUtils.setParam("proxyUserId", proxyMemberInfo.userId);
    localStorageUtils.setParam("proxyparentID", proxyMemberInfo.parentID);
    ajaxUtil.ajaxByAsyncPost(null, '{"UserName":"'+proxyUsername+'","InterfaceName":"ShowDailyWagesSetting","ProjectPublic_PlatformCode":2}', getDailywages, '正在提交数据中...');

    // 没有资金密码时，无法给下级充值
    $("#IsShowCharge").off('click');
    $("#IsShowCharge").on('click', function(){
//      if(localStorageUtils.getParam("isHasPayPwd") == "0"){
//          toastUtils.showToast("请设置资金密码");
//      } else {
//          createInitPanel_Fun('proxyCharge');
//      }

		//接口调用，判断用户有几张卡已绑定
 		proxy_CheckBankCardNumber();
    });
}

/*是否显示下级充值*/
function isShowProxyCharge() {
    var MYRebate=localStorageUtils.getParam("MYRebate");
    var isShowTran=localStorageUtils.getParam("IsShowTran");
    if (MYRebate >= 1956 && isShowTran == 1){
        $("#IsShowCharge").show();
    }else{
        $("#IsShowCharge").hide();
    }
}

/*获取日工资信息，并返回数据*/
function getDailywages(data) {
    if (data.SystemState == 64) {
        if (data.ShowDailyWages){
            $("#IsShowDailywages").show();
            var MySettlementRatio = data.MySettlementRatio;  //自身日工资比例
            var LowerLevelSettlementRatio = data.LowerLevelSettlementRatio;  //直属下级日工资比例
            var LowerLevelState = data.LowerLevelState;  //直属下级日工资状态 1开启 0关闭
            localStorageUtils.setParam("myDailywages",MySettlementRatio);
            localStorageUtils.setParam("subordinateBili",LowerLevelSettlementRatio);
            localStorageUtils.setParam("dailywagesState",LowerLevelState);
        }else{
            $("#IsShowDailywages").hide();
        }
    } else {
        $("#IsShowDailywages").hide();
        toastUtils.showToast("网络不给力，请稍后再试");
    }
}

//接口调用，判断用户有几张卡已绑定
function proxy_CheckBankCardNumber() {
	ajaxUtil.ajaxByAsyncPost1(null, '{"ProjectPublic_PlatformCode":2,"UserID":'+localStorageUtils.getParam("myUserID")+',"InterfaceName":"GetBankCardList"}',function (data) {
		//生成银行卡列表
		var bankCardList = data["BankCardList"];
		if (bankCardList.length > 0){
			isHaveBankCard = true;
		}
		//检测用户  密保设置   是否填写完毕
	    proxy_CheckGetSecurityPromptingState();
	});
}

//@ 检测用户  密保设置   是否填写完毕
function proxy_CheckGetSecurityPromptingState() {
    // FlagType 类型（1：密保 2：提示语）
	var paramSecurity = '{"ProjectPublic_PlatformCode":2,"InterfaceName":"GetSecurityPromptingState","UserID":' + myUserID + ',"FlagType":1}';
	ajaxUtil.ajaxByAsyncPost1(null, paramSecurity, proxy_securityCallBack_personaInfo,null);
}

// 密保设置  Result ( 1：已设置; 0：未设置 )
function proxy_securityCallBack_personaInfo(data) {
	if (data.SystemState == 64){
		securityState = data.Result;
		localStorageUtils.setParam("securityState",securityState);
		//@ 检测用户支付密码是否填写完毕
		proxy_CheckPayOutPwdAndTransferPwdloaded();
	}
}

//@ 检测用户支付密码是否填写完毕
function proxy_CheckPayOutPwdAndTransferPwdloaded() {
    var param = '{"ProjectPublic_PlatformCode":2,"UserName":"' + userName + '","InterfaceName":"CheckPayOutPwdAndTransferPwd"}';
    ajaxUtil.ajaxByAsyncPost1(null, param, proxy_successCallBack_CheckPayOutPwdAndTransferPwd,null);
}

//@ 查询是否有提款密码
function proxy_successCallBack_CheckPayOutPwdAndTransferPwd(data) {
    if (data.Result == "1") {
        var context = data.Context;
        temp = context[0].PayOutPassWord;
        // temp == 1:有资金密码
        if (temp == "1" && isHaveBankCard == true) {
            if (IsTestAccount){
                toastUtils.showToast("试玩账户不能转账");
            }else{
                createInitPanel_Fun('proxyCharge');
            }
            return;
        } else {
        	if(isHaveBankCard == false){
                if (IsTestAccount){
                    toastUtils.showToast("试玩账户不能转账");
                }else{
                    toastUtils.showToast("请完善银行资料");
                    createInitPanel_Fun('showBankInfo');
                }
	            return;
        	}
        	if(temp != "1"){
                if (IsTestAccount){
                    toastUtils.showToast("试玩账户不能转账");
                }else{
                    toastUtils.showToast("请设置资金密码");
                    proxy_SetBankPassword();
                }
	            return;
        	}
        }
        localStorageUtils.setParam("isHasPayPwd", context[0].PayOutPassWord);
    } 
}

//设置资金密码;
function proxy_SetBankPassword(){
	if (securityState){
		proxy_loadSetSecurityPage('modifyBankPassword');
	}else{
//		toastUtils.showToast('请先设置密保问题');
		createInitPanel_Fun('setSecurity');
	}
}

function proxy_loadSetSecurityPage(nextPage) {
	if (securityState){
		var Security = '{"ProjectPublic_PlatformCode":2,"InterfaceName":"GetRandomSecurity","UserID":' + myUserID + ',"FlagType":1,"SecurityCount":1}';
		ajaxUtil.ajaxByAsyncPost1(null, Security, function(data){
			if (data.SystemState == 64){
				var info = data.SecurityQuestionAnswerModels[0];
				var message = '<p>'+ info.Question +'</p><input type="text" minlength="4" maxlength="20" id="security_randomAnswer"/>';
				setTimeout(function () {
					$.ui.popup(
						{
							title:"验证密保问题",
							message:message,
							cancelText:"关闭",
							cancelCallback:
								function(){
								},
							doneText:"确定",
							doneCallback:
								function(){
									var randomAnswer = $("#security_randomAnswer").val();
									//验证答案是否正确
									if (randomAnswer.trim() == ""){
										toastUtils.showToast("请输入验证答案");
									}else{
										// RecoveryMode -- 找回方式（1：按资金密码 2：通过密保答案找回）
										var paramAnwser = '{"ProjectPublic_PlatformCode":2,"InterfaceName":"RetrievePassword","UserName":"' + userName + '","RecoveryMode":2,"SecurityID":'+ info.ID +',"Answer":"'+ randomAnswer +'"}';
										ajaxUtil.ajaxByAsyncPost1(null, paramAnwser, function (dataAnswer) {
											if (dataAnswer.SystemState == 64){
												if (dataAnswer.Result == 1){
													toastUtils.showToast('验证通过');
													createInitPanel_Fun(nextPage);

												}else if (dataAnswer.Result == -1){
													toastUtils.showToast('资金密码错误');
												}else if (dataAnswer.Result == -2){
													toastUtils.showToast('用户不存在');
												}else if (dataAnswer.Result == -3){
													toastUtils.showToast('密保问题回答错误');
												}else if (dataAnswer.Result == -4){
													toastUtils.showToast('该用户没有设置密保');
												}else if (dataAnswer.Result == -5){
													toastUtils.showToast('该用户没有设置资金密码');
												}else {
													toastUtils.showToast('验证失败');
												}
											} else {
												toastUtils.showToast("当前网络不给力，请稍后再试");
											}
										},null);
									}
								},
							cancelOnly:false
						});
				},300);
			}else if (data.Result == "-1") {
				loginAgain();
			}
		},null);
	}else {
		createInitPanel_Fun(nextPage);
	}
}