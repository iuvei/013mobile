/**
 *页面初始化
 */
function loginPageLoadedPanel() {
    // showCode();
    //读取存储的用户名，在表单自动填写
    showLoginUsername();
    $("#loginInput p").off('click');
    $("#loginInput p").on('click', function() {
        $(this).addClass('active');
    });
    $("#passwd").off('click');  //点击自动填写上个登录用户的密码，新用户密码为空
    $("#passwd").on('click',function(){
        $("#username").val() == localStorageUtils.getParam("LoginUsername") ? (showLoginPasswd()) : ($("#passwd").val(''));
    });

    var _urlHistory = $.ui.urlHistory;
    if(_urlHistory == "#lotteryHallPage" || _urlHistory == "#loginPage" || _urlHistory == "" || _urlHistory =="#zhuce")
    {
        _urlHistory = "myLottery";
    }
    $("#loginbtn").off('click');
    $("#loginbtn").on('click', function() {
        if($.trim($("#username").val()) != "" && $.trim($("#passwd").val()) != ""){
            var params = '{"SecCode":"58324","UserLoginName":"' + $("#username").val() + '","InterfaceName":"AddUserLoginLogNew","UserPassWord":"' + $("#passwd").val() + '","ProjectPublic_PlatformCode":2,"PlatformCode":2}';
            ajaxUtil.ajaxByAsyncPost(null,params,function(data){
                if (data.LoginState == true) {
                    $("#validateCode").val("");
                    localStorageUtils.setParam("isLogin","true");
                    localStorageUtils.setParam("username",data.UserName);
                    localStorageUtils.setParam("myUserID",data.UserDetail.MyUserID);
                    localStorageUtils.setParam("MyRebateDifference", data.UserDetail.MyRebateDifference);
                    localStorageUtils.setParam("MYRebate",data.UserDetail.MyRebate);
                    localStorageUtils.setParam("IsContract",data.IsContract);  //是否已签约分红
                    localStorageUtils.setParam("IsDayWages",data.IsDayWages);  //是否已签约日工资
                    localStorageUtils.setParam("WEBUrl",data.UserDetail.WEBUrl);// 013 注册链接
                    localStorageUtils.setParam("IsTestAccount",data.UserType);//0为正式账户，1为试玩账户
                    localStorageUtils.setParam("userPhone", data.UserDetail.Mobile);//手机号；
                    //登录后   提示绑定手机号；
                    localStorageUtils.setParam("myLottery_enterType","0");
                    //获取彩种
                    var params = '{"ProjectPublic_PlatformCode":2,"InterfaceName":"GetAllMerchantInfo"}';
                    ajaxUtil.ajaxByAsyncPost(null,params,function(data){
                        maxRebate=data.MaxRebate;
                        minRebate=data.MinRebate;
                        isCloseFandian = false;//data.CanRebate == true ?false:true;

                        if(((Number(data.Mode))&8)==8){
                            isLiModeClosed = false;
                        }else{
                            isLiModeClosed = true;
                        }

                        if(((Number(data.Mode))&2)==2){
                            isJiaoModeClosed = false;
                        }else{
                            isJiaoModeClosed = true;
                        }

                        if(((Number(data.Mode))&1)==1){
                            isFenModeClosed = false;
                        }else{
                            isFenModeClosed = true;
                        }
                        isCloseFandian = false;
                        localStorageUtils.setParam("XRebate", data.XRebate);
                        localStorageUtils.setParam("MerchantCode", data.MerchantCode);
                        localStorageUtils.setParam("kefuURL", data.CS_Site);
                        localStorageUtils.setParam("Mode", data.Mode);
                        var arr = new Array();
                        var prizeArr = new Array();
                        var FCArr = new Array();
                        var  result = data.LotteryList;
                        var haltSaleId = [];
                        $.each(result, function(index, item) {
                            localStorageUtils.removeParam("lotteryID_");
                            // localStorageUtils.setParam(item.LotteryCode + "SaleState", item.SaleState);
                            if(item.LotteryCode!='99'){
                                if('50'==item.LotteryCode){
                                    localStorageUtils.setParam("MmcLottery","50");
                                }
                                if('51'!=item.LotteryCode || '53'!=item.LotteryCode || '55' != item.LotteryCode || '61'!=item.LotteryCode || '63' != item.LotteryCode){
                                    prizeArr.push(item.LotteryCode);
                                }
                                if('51'==item.LotteryCode || '53'==item.LotteryCode || '55' == item.LotteryCode || '61'==item.LotteryCode || '63' == item.LotteryCode){
                                    FCArr.push(item.LotteryCode);
                                }
                                arr.push(item.LotteryCode);
                                if(data.MinRebate > (item.MaxRebate - localStorageUtils.getParam("MyRebateDifference"))){
                                    localStorageUtils.setParam(item.LotteryCode + "", data.MinRebate);
                                }else{
                                    localStorageUtils.setParam(item.LotteryCode + "", (item.MaxRebate - localStorageUtils.getParam("MyRebateDifference")));
                                }
                                localStorageUtils.setParam("MinRebate", data.MinRebate);
                                localStorageUtils.setParam("MaxRebate", data.MaxRebate);
                                //判断某彩种是否停售，并保存
                                if (item.SaleState == 0){
                                    haltSaleId.push(item.LotteryCode);
                                }
                            }
                        });
                        var saleLottery = arr.join(",");
                        var prizeLottery = prizeArr.join(",");
                        localStorageUtils.setParam("lotteryID_", arr);
                        localStorageUtils.setParam("saleLottery", saleLottery.substring(0,saleLottery.length));
                        localStorageUtils.setParam("prizeLottery", prizeLottery.substring(0,prizeLottery.length));
                        localStorageUtils.setParam("FCLottery", FCArr);
                        localStorageUtils.setParam("HaltSale_ID",haltSaleId);  //是否停售

                        //强制修改密码
                        var login_pwd = $("#passwd").val().trim();
	                    if (login_pwd == 'a123456' || login_pwd == '123456' || login_pwd == '123456a'){
                            localStorageUtils.setParam('LoginPwdForced',true);
                            localStorageUtils.setParam('isLogin',false);
		                    createInitPanel_Fun('modifyPassword');
                        }else {
                            localStorageUtils.setParam('LoginPwdForced',false);
                            getPanelBackPage_Fun();  //正常登录
                        }
                    },'正在加载数据');
                }else{
                    if (data.ErrorCode == 2) {
                        toastUtils.showToast("用户名或密码错误!");
                        // showCode();
                    } else if (data.ErrorCode == 3) {
                        toastUtils.showToast("您的账户被锁定!");
                    }else if(data.ErrorCode == 4 || data.ErrorCode == 5){
                        toastUtils.showToast("您的账号被限制登录!");
                    }else if(data.ErrorCode == 6){
                        toastUtils.showToast("您的账号被冻结!");
                    }else if(data.SystemState=="-99"){
                        // toastUtils.showToast("您输入的验证码有误，请重新输入");
                        // showCode();
                    }else if(data.SystemState==2){
                        toastUtils.showToast("登录异常!");
                    }else{
                        toastUtils.showToast("网络异常!");
                    }
                }

            },'正在登录...');
        } else if($.trim($("#username").val()) == ""){
            toastUtils.showToast("用户名不能为空!");
        } else if($.trim($("#passwd").val()) == ""){
            toastUtils.showToast("密码不能为空!");
        } else if($.trim($("#validateCode").val()) == ""){
            toastUtils.showToast("验证码不能为空!");
        }
    });
}

function loginPageUnloadedPanel() {
    //存储最近一次的用户名和密码
    saveLoginInfo();
}

function showCode() {
    $("#myCode").attr("src","/checkimage.jpg?"+Math.random());
}

/*
 * 获取用户名和密码并保存
 * */
function saveLoginInfo(){
    if($("#username").val()){
        localStorageUtils.setParam("LoginUsername", $("#username").val());
    }
    if($("#passwd").val()){
        localStorageUtils.setParam("LoginPasswd", $("#passwd").val());
    }
}
/*
 *  自动填充用户名到表单
 * */
function showLoginUsername(){
    var loginUsername=localStorageUtils.getParam("LoginUsername");
    if(!loginUsername || loginUsername == "null"){
        $("#username").val('');
        $("#passwd").val('');
    }else{
        $("#username").val(loginUsername);
    }
}
/*
 *  自动填充密码到表单
 * */
function showLoginPasswd(){
    var loginPasswd=localStorageUtils.getParam("LoginPasswd");
    if(!loginPasswd){
        $("#passwd").val('');
    }else{
        if($("#username").val()){
            $("#passwd").val(loginPasswd);
        }else{
            $("#passwd").val("");
        }
    }
}
