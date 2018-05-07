/* 
*追号
* @Author: Administrator
* @Date:   2015-01-20 15:50:31
* @Last Modified by:   Administrator
* @Last Modified time: 2015-12-14 17:25:00
*/
var currentTouzhuInfo_zh;
var lotteryId_zh;
var onkeyup='"this.value=this.value.replace(/\\D/g,\''+'\')"';
var zhuihaoshu_zh=10;
var zongzhushu_zh=0;
var perTotalMoney;
var qihaoList_zh;
//追期倍数
var chaseZhuihaoMultipleList = [];
//flex版期号列表
var issueJsonList = "";
//临时期号
var tempIssueNumber = "";
//中奖后停止追号
var cbvalue = "";
var isAppendNum = 0;
//确保付款同步，即付款按钮不能频繁点击
var syncPay_zh = true;
var initStyle = true;
//当前在哪个追号页面
var currentPage_zh = "";

/**
 * @Author:      muchen
 * @DateTime:    2015-1-12
 * @Description: 进入该页面时调用
 */
function zhuiHaoPageLoadedPanel(){
  catchErrorFun("zhuiHaoPage_init();");
    $("#zhuiHaoContent").scroller({
        verticalScroll : true,
        horizontalScroll : false,
        vScrollCSS: "afScrollbar",
        autoEnable : true
    });
    $("#zhuiHaoContent").scroller().scrollToTop();
    $("#zhuiHaoContent").scroller().clearInfinite();
}
//离开这个页面时调用
function zhuiHaoPageUnloadedPanel(){
   clearData();
}

/**
 * @Author:      muchen
 * @DateTime:    2015-1-12
 * @Description: 入口
 */
function zhuiHaoPage_init(){
      //保存最近一次选号信息
      currentTouzhuInfo_zh = checkoutResult[checkoutResult.length -1];
      //获取彩种标题
      $("#ticcket_name_zhuiHao").html(LotteryInfo.getLotteryNameByTag(currentTouzhuInfo_zh.lotteryType));
      lotteryId_zh=LotteryInfo.getLotteryIdByTag(currentTouzhuInfo_zh.lotteryType);
      //切换追号类型
      changeZhuihaoStyle();
      //停止追号
      $(".stopFolFL").off('click');
      $(".stopFolFL").on('click', function(event) {
        var checkboxObj = document.getElementById("tingZhiZhuiHaoid_zhuihao");
        if (checkboxObj.checked) {
            document.getElementById("tingZhiZhuiHaoid_zhuihao").checked = false;
            cbvalue = "1";
            isAppendNum = 2;
        } else {
            document.getElementById("tingZhiZhuiHaoid_zhuihao").checked = true;
            cbvalue = "";
            isAppendNum = 4;
        }
      });

    $("#tongBeiPlan").off('click');
    $("#tongBeiPlan").on('click', function(event) {
        initStyle = false;
        tongBeiPlan(initStyle);

    });
    $("#fanBeiPlan").off('click');
    $("#fanBeiPlan").on('click', function(event) {
        initStyle = false;
        fanBeiPlan(initStyle);

    });
    $("#liRunLvPlan").off('click');
    $("#liRunLvPlan").on('click', function(event) {
        initStyle = false;
        liRunLvPlan(initStyle);
    });

      // 付款按钮点击
      $("#zhuiHaoPage_payout").unbind('click');
      $("#zhuiHaoPage_payout").bind('click', function(event) {
       checkOutPage_payout_zh();
      });

      // 返回,清空所有数据
      $("#zhuiHaoPage_back").unbind('click');
      $("#zhuiHaoPage_back").bind('click',function(e){
        clearData();
        getPanelBackPage_Fun();
      });
}

//@-0 点击标签页，切换追号类型，初始化默认追号类型
function changeZhuihaoStyle() {
    //Default
    initStyle = true;
    $("#tongBeiPage").siblings("div.follow").hide();
    $("#tongBeiPage").show();
    $("#tongBeiBtn").css({"color":"#dd2936","borderBottom":"1px solid #dd2936"});
    $("#tongBeiBtn").siblings("li").css({"color":"#666666","borderBottom":"1px solid #fff"});
    tongBeiPlan(initStyle);
    currentPage_zh = "tongBei";
    //判断是否显示利润率追号
    if (checkoutResult.length > 1 || checkoutResult[0].maxAward || (LotteryInfo.getLotteryTypeByTag(checkoutResult[0].lotteryType))=='k3' && checkoutResult[0].playMethodIndex == 0){
        $("#liRunLvBtn").hide();
        $("#liRunLvPage").hide();
        $("#zhuiHaoStyle > ul li").css('width','50%');
    } else{
        $("#liRunLvBtn").show();
        $("#zhuiHaoStyle > ul li").css('width','calc(100% / 3)');
        $("#zhuiHaoStyle > ul li").css('-moz-width','calc(100% / 3)');
        $("#zhuiHaoStyle > ul li").css('-o-width','calc(100% / 3)');
        $("#zhuiHaoStyle > ul li").css('-webkit-width','calc(100% / 3)');
    }
    //Click To Change
    $("#zhuiHaoStyle > ul li").off("click");
    $("#zhuiHaoStyle > ul li").on("click",function () {
        $(this).css({"color":"#dd2936","borderBottom":"1px solid #dd2936"});
        $(this).siblings("li").css({"color":"#666666","borderBottom":"1px solid #fff"});
        var clickedID = $(this).context.id;
        currentPage_zh = clickedID.replace('Btn','');
        var content = clickedID.replace('Btn',"Page");
        var initData = clickedID.replace('Btn','Plan');
        $("#"+content+"").siblings("div.follow").hide();
        $("#"+content+"").show();
        $("#zhuiHaoContent").scroller().scrollToTop();
        $("#zhuiHaoContent").scroller().clearInfinite();
        initStyle = true;
        switch (initData){
            case "tongBeiPlan": tongBeiPlan(initStyle); break;
            case "fanBeiPlan" : fanBeiPlan(initStyle);  break;
            case "liRunLvPlan": liRunLvPlan(initStyle); break;
        }
    });
}

//@-1 同倍追号请求
function tongBeiPlan(initStyle) {
    //切换标签页初始化
    if (initStyle){
        $("#tongBeiMultiple").val('1');
        $("#tongZhuiQi").val('10');
    }
    var tongQiHao = parseInt($("#tongZhuiQi").val());
    var rowArray = $('#tongBeiTable').children();
    $.each(rowArray, function(index, item) {
        if (0 != index) {//不删除表头
            $(item).remove();
        }
    });
    chaseZhuihaoMultipleList = []; //追期数初始化
    //查询期号
    var params='{"LotteryCode":'+ lotteryId_zh +',"Num":' + tongQiHao +',"ProjectPublic_PlatformCode":2,"InterfaceName":"GetLotteryIssueByNum"}';
    ajaxUtil.ajaxByAsyncPost1(null,params,tongBeiCallBack,null);
}
//@-1 同倍追号返回
function tongBeiCallBack(data) {
    $("#zhuiHaoContent").scroller().scrollToTop();
    $("#zhuiHaoContent").scroller().clearInfinite();
    var tongBeiMultiple = $("#tongBeiMultiple").val();
    if(data.SystemState == 64){
        perTotalMoney = 0;
        zongzhushu_zh = 0;
        $.each(checkoutResult, function(k, v){
            zongzhushu_zh = bigNumberUtil.add(zongzhushu_zh,v.notes).toString();
            perTotalMoney = bigNumberUtil.add(perTotalMoney,bigNumberUtil.divided(v.money,v.multiple).toString()).toString();
        });
        var item = data.LottI;
        for (var i = 0; i < item.length; i++) {
            var temp = "";
            temp += '<tr>';
            temp += '<td>' + (i + 1) + '</td>';
            temp += '<td>' + item[i].IssueNumber + '</td>';
            temp += '<td>';
            temp += '<div class="beishu" data-role="controlgroup" data-type="horizontal" data-mini="true" >';
            temp += '<input id="inputZhuiHaoId_tong'+i+'" value="'+tongBeiMultiple+'" type="tel" maxLength="4" onblur="getbeishu(this)" onkeyup='+'"this.value=this.value.replace(/\\D/g,\''+'\')"'+' style="color:#000;text-align:center;width:55px;height:25px;border:solid 1px #7B7373"/>';
            temp += '</div>';
            temp += '</td>';
            temp += '<td style="word-break:break-all;word-wrap:break-word;white-space:normal;"><span>' + perTotalMoney + '</span><span>元</span></td>';
            temp += '</tr>';
            $('#tongBeiTable').append(temp);
            chaseZhuihaoMultipleList.push("1");
        }
        $("#zhuiHaoPage_zhushu").html(zongzhushu_zh);
        calTotalMoney("tongBei");
    }else if(data.SystemState == -1){
        loginAgain();
    }else{
        toastUtils.showToast("期号获取失败",2000);
    }
}

//@-2 翻倍追号请求
function fanBeiPlan(initStyle) {
    //切换标签页初始化
    if (initStyle){
        $("#fanBeiMultiple").val('1');
        $("#jumpQi").val('1');
        $("#jumpBei").val('2');
        $("#fanZhuiQi").val('10');
    }
    var fanQiHao = parseInt($("#fanZhuiQi").val());
    var rowArray = $('#fanBeiTable').children();
    $.each(rowArray, function(index, item) {
        if (0 != index) {//不删除表头
            $(item).remove();
        }
    });
    chaseZhuihaoMultipleList = [];
    //查询期号
    var params='{"LotteryCode":'+ lotteryId_zh +',"Num":' + fanQiHao +',"ProjectPublic_PlatformCode":2,"InterfaceName":"GetLotteryIssueByNum"}';
    ajaxUtil.ajaxByAsyncPost1(null,params,fanBeiCallBack,null);
}
//@-2 翻倍追号返回
function fanBeiCallBack(data) {
    $("#zhuiHaoContent").scroller().scrollToTop();
    $("#zhuiHaoContent").scroller().clearInfinite();
    var jumpQi = parseInt($("#jumpQi").val());
    var jumpBei = parseInt($("#jumpBei").val());
    var fanBeiMultiple = parseInt($("#fanBeiMultiple").val());
    if(data.SystemState == 64){
        perTotalMoney = 0;
        zongzhushu_zh = 0;
        $.each(checkoutResult, function(k, v){
            zongzhushu_zh = bigNumberUtil.add(zongzhushu_zh,v.notes).toString();
            perTotalMoney = bigNumberUtil.add(perTotalMoney,bigNumberUtil.divided(v.money,v.multiple).toString()).toString();
        });
        var item = data.LottI;
        for (var i = 0; i < item.length; i++) {
            var temp = "";
            temp += '<tr>';
            temp += '<td>' + (i + 1) + '</td>';
            temp += '<td>' + item[i].IssueNumber + '</td>';
            temp += '<td>';
            temp += '<div class="beishu" data-role="controlgroup" data-type="horizontal" data-mini="true">';
            for (var k=0;k<jumpQi;k++){
                if ((i+k)%jumpQi == 0 ){
                temp += '<input id="inputZhuiHaoId_fan'+i+'" value="'+ calcFanBeiMultiple(fanBeiMultiple,jumpBei,i,jumpQi) +'" type="tel" maxLength="4" onblur="getbeishu(this)" onkeyup='+'"this.value=this.value.replace(/\\D/g,\''+'\')"'+' style="color:#000;text-align:center;width:55px;height:25px;border:solid 1px #7B7373"/>';
                }
            }
            temp += '</div>';
            temp += '</td>';
            temp += '<td style="word-break:break-all;word-wrap:break-word;white-space:normal;"><span>' + perTotalMoney + '</span><span>元</span></td>';
            temp += '</tr>';
            $('#fanBeiTable').append(temp);
            chaseZhuihaoMultipleList.push("1");
        }
        $("#zhuiHaoPage_zhushu").html(zongzhushu_zh);
        calTotalMoney("fanBei");
    }else if(data.SystemState == -1){
        loginAgain();
    }else{
        toastUtils.showToast("期号获取失败",2000);
    }
}
//@-2 计算翻倍追号的倍数，并做最大倍数限制
function calcFanBeiMultiple(fanBeiMultiple,jumpBei,counter,jumpQi) {
    var result = new BigNumber(fanBeiMultiple).times(new BigNumber(jumpBei).toPower(new BigNumber(counter).dividedToIntegerBy(jumpQi)));
    if(!isFinite(new BigNumber(result)) || new BigNumber(result).minus(new BigNumber(9999)).toNumber() > 0){
        toastUtils.showToast("当前倍数超过了最大倍数限制！<br/>系统将自动调整为最大可设置倍数");
        return 9999;
    }else {
        return result;
    }
}

//@-3 利润率追号请求
function liRunLvPlan(initStyle) {
    //切换标签页初始化
    if (initStyle){
        $("#liRunLvMultiple").val('1');
        $("#minYield").val('50');
        $("#liRunLvZhuiQi").val('10');
    }
    var liRunlvQiHao = parseInt($("#liRunLvZhuiQi").val());
    var rowArray = $('#liRunLvTable').children();
    $.each(rowArray, function(index, item) {
        if (0 != index) {//不删除表头
            $(item).remove();
        }
    });
    chaseZhuihaoMultipleList = []; //追期数初始化
    //查询期号
    var params='{"LotteryCode":'+ lotteryId_zh +',"Num":' + liRunlvQiHao +',"ProjectPublic_PlatformCode":2,"InterfaceName":"GetLotteryIssueByNum"}';
    ajaxUtil.ajaxByAsyncPost1(null,params,liRunLvCallBack,null);
}
//@-3 利润率追号返回
function liRunLvCallBack(data) {
    $("#zhuiHaoContent").scroller().scrollToTop();
    $("#zhuiHaoContent").scroller().clearInfinite();
    var liRunLvMultiple = parseInt($("#liRunLvMultiple").val());
    var minYield = parseInt($("#minYield").val());
    if(data.SystemState == 64){
        perTotalMoney = 0;
        zongzhushu_zh = 0;
        $.each(checkoutResult, function(k, v){
            zongzhushu_zh = bigNumberUtil.add(zongzhushu_zh,v.notes);
            perTotalMoney = bigNumberUtil.add(perTotalMoney,bigNumberUtil.divided(v.money,v.multiple).toString());
            playAward = v.award;
            firstMoney = v.money;
            firstMultiple = v.multiple;
        });
        var item = data.LottI;
        var inFrontOfAll = firstMoney;
        for (var i = 0; i < item.length; i++) {
            var temp = "";
            temp += '<tr>';
            temp += '<td >' + (i + 1) + '</td>';  // rowspan="2"
            temp += '<td><span>' + item[i].IssueNumber + '</span></td>';
            temp += '<td>';
            temp += '<div class="beishu" data-role="controlgroup" data-type="horizontal" data-mini="true" >';
            if (i == 0){
                var firstTouZhu = Number(bigNumberUtil.divided(firstMoney,firstMultiple));
                firstTouZhu = Number(bigNumberUtil.multiply(firstTouZhu,liRunLvMultiple));
                var result = bigNumberUtil.divided(bigNumberUtil.minus(bigNumberUtil.multiply(playAward,liRunLvMultiple),firstTouZhu),firstTouZhu);
                if (Number(result) < Number(bigNumberUtil.divided(minYield,100))){
                    toastUtils.showToast("您设置的利润率过高，无法达到您的预期目标值，请重新修改参数设置");
                    calTotalMoney('liRunLv');
                    $("#zhuiHaoPage_zhushu").text('0');
                    return;
                }else {
                    temp += '<input id="inputZhuiHaoId_li' + i + '" value="' + liRunLvMultiple + '" type="tel" maxLength="4" onblur="getbeishu(this)" onkeyup=' + '"this.value=this.value.replace(/\\D/g,\''+'\')"' +' style="color:#000;text-align:center;width:55px;height:25px;border:solid 1px #7B7373"/>'
                }
            }else{
                if(calcLiRunLvMultiple(minYield,inFrontOfAll,playAward,liRunLvMultiple) > 9999 ){
                    // toastUtils.showToast("当前倍数超过了最大倍数限制！<br/>系统将自动调整为最大可设置倍数");
                    return;
                }
            temp += '<input id="inputZhuiHaoId_li'+i+'" value="'+ calcLiRunLvMultiple(minYield,inFrontOfAll,playAward,liRunLvMultiple) +'" type="tel" maxLength="4" onblur="getbeishu(this)" onkeyup='+'"this.value=this.value.replace(/\\D/g,\''+'\')"'+' style="color:#000;text-align:center;width:55px;height:25px;border:solid 1px #7B7373"/>';
            }
            temp += '</div>';
            temp += '</td>';
            temp += '<td><span>' + perTotalMoney + '</span><span> 元</span></td>';
            temp += '</tr>';
            temp += '<tr>';

            $('#liRunLvTable').append(temp);
            chaseZhuihaoMultipleList.push("1");
            calTotalMoney("liRunLv");  //每一注都会计算金额
            inFrontOfAll = $("#zhuiHaoPage_money").html();
        }
        $("#zhuiHaoPage_zhushu").html(zongzhushu_zh);

    }else if(data.SystemState == -1){
        loginAgain();
    }else{
        toastUtils.showToast("期号获取失败",2000);
    }
}
//@-3 计算利润率追号的倍数
function calcLiRunLvMultiple(minYield,inFront,playAward,liRunLvMultiple) {
    var Yield = Number(bigNumberUtil.divided(minYield,100))+1;

	//处理 Yield 小数点后过长导致 bigNumber 报错的问题（bigNumber最大处理15位数）。
	if( (Yield+'').length > 15 ){
		Yield = strSliceToNum(Yield,10);  //小数点后保留10位
	}

    var inFrontOfAll = Number(inFront);
    var touzhuMoney = Number(bigNumberUtil.divided(checkoutResult[0].money,checkoutResult[0].multiple));
    var dividend = Number(bigNumberUtil.multiply(Yield,inFrontOfAll));
    var divisor = Number(bigNumberUtil.minus(playAward,bigNumberUtil.multiply(Yield,touzhuMoney)));
    var result = Math.ceil(bigNumberUtil.divided(dividend,divisor));
    return result < liRunLvMultiple ? liRunLvMultiple : result;
}

/** 清空数据 **/
function clearData(){
    document.getElementById('tingZhiZhuiHaoid_zhuihao').checked = true;
    currentTouzhuInfo_zh=[];
    lotteryId_zh;
    zhuihaoshu_zh=10;
    zongzhushu_zh=0;
    qihaoList_zh;
    //追期倍数
    chaseZhuihaoMultipleList = [];
    //flex版期号列表
    issueJsonList = "";
    //临时期号
    tempIssueNumber = "";
    //中奖后停止追号
    cbvalue = "";
    isAppendNum = 0;
    //确保付款同步，即付款按钮不能频繁点击
    syncPay_zh = true;
}

/**
 * @Author:      muchen
 * @DateTime:    2014-12-03 14:18:03
 * @Description: 付款按钮点击
 */
function checkOutPage_payout_zh() {
     if(!syncPay_zh){
        return;
    }
     syncPay_zh=false;
    // 判断厘模式金额
     var stop;
     $.each(checkoutResult,function (key,val) {
        if(val.playMode == 8){
            $("#"+currentPage_zh+"Table input[type='tel']").each(function(i){
               var perMultiple = $('#' + this.id + '').val();
               var perMultiMoney = bigNumberUtil.multiply(bigNumberUtil.multiply(0.002,val.notes),Number(perMultiple));
               if (perMultiMoney != 0 && perMultiMoney < 0.02){
                   toastUtils.showToast('厘模式每单最少投注0.02元，请修改投注倍数');
                   stop = true;
                   resetFukanFlag_zh();
                   return false;
                }
            });
        }
     });
    if (stop){
        return;
    }
     calTotalMoney(currentPage_zh);
     if ( $('#zhuiHaoPage_money').text() ==0) {
            toastUtils.showToast("至少选择一期",2000);
            resetFukanFlag_zh();
            $.ui.blockUI(.1);
            setTimeout(function () {
                $.unblockUI();
            }, 2000);
            return;
     }

    //提示
    var danQiMsg = getDanQiBonus(currentTouzhuInfo_zh.lotteryType);
     $.ui.popup({
            title:"提示：",
            message:''+ danQiMsg +'您共追' +  getchaseZhuihaoMultipleList() +'期,共' + $('#zhuiHaoPage_money').text() +'元，请确认！',
            cancelText:"关闭",
            cancelCallback:
            function(){
                resetFukanFlag_zh();
            },
            doneText:"确定",
            doneCallback:
            function(){
                getQiHao_zhuihao();
            },
            cancelOnly:false
     });
}

/**
 * 获取最新期号
 */
function getQiHao_zhuihao(){
    zhuihaoshu_zh = chaseZhuihaoMultipleList.length; //获取追号数

    var params='{"LotteryCodeEnum": ' + lotteryId_zh + ',"ProjectPublic_PlatformCode":2,"InterfaceName":"GetCurrLotteryIssue"}';
    ajaxUtil.ajaxByAsyncPost1(null,params,function(data){
        if(data.SystemState == 64) {
            newFactCNumber=data.IssueNumber;
            //追号按钮被点击
            if (zhuihaoshu_zh > 1) {
                searchQiHaoList_zh();
            }else{
                fukuanPost_zh();
            }
        } else if(data.SystemState == -1){
            loginAgain();
        }else{//如果查询期号失败则提示并返回购彩大厅
            toastUtils.showToast("期号获取失败");
            resetFukanFlag_zh();
        }
    },null);
}

/**
 * @Author:      muchen
 * @DateTime:    2014-12-03 14:21:00
 * @Description:  付款时的post请求
 */
function fukuanPost_zh(){
        //判断中奖后是否停止追号的字段值
        var winstopstyle;
        if (zhuihaoshu_zh > 1) {
            if (cbvalue == "1") {
                winstopstyle = 3;
            } else {
                winstopstyle = 2;
            }
        } else {
            winstopstyle = 1;
        }

       //装载向服务器提交的数据
        var paramList = [];
        zhuihaoshu_zh = (zhuihaoshu_zh <= qihaoList_zh.length) ? zhuihaoshu_zh : qihaoList_zh.length;
        var issueList = [];
        var qi = "";
        var bei = "";
        var jsonTemp = "";
        for (var i = 0; i < zhuihaoshu_zh; i++) {
            qi = "" + qihaoList_zh[i];
            bei = "" + chaseZhuihaoMultipleList[i];
            if(bei !=0){
              issueList.push('"' + qi + '"' + ":" + '"' + bei + '"');
              jsonTemp = issueList.join(",");
            }
        }

        if(1 == zhuihaoshu_zh){
            issueJsonList = "{}";
        }else{
            issueJsonList = "{" + jsonTemp + "}";
        }
           $.each(checkoutResult, function(index, objStr) {
               var checkoutParam = {
                   toString : function() {
                       return JSON.stringify(this);
                   }
               };
               var obj = objStr;
               var playMethod=LotteryInfo.getPlayMethodId(LotteryInfo.getLotteryTypeByTag(checkoutResult[index].lotteryType),checkoutResult[index].lotteryType,checkoutResult[index].playMethodIndex);
               checkoutParam.BetContent = tzContentToNum(LotteryInfo.getLotteryIdByTag(checkoutResult[index].lotteryType), playMethod, obj.nums);
               checkoutParam.BetCount = obj.notes;
               checkoutParam.PlayCode = playMethod;
               tempIssueNumber = '"' + newFactCNumber + '"';
               checkoutParam.IssueNumber = "" + newFactCNumber;
               checkoutParam.BetRebate = obj.rebates.split(",")[0];
               checkoutParam.BetMultiple = obj.multiple;
               if (obj.multiple != "") {
                   if(1 == zhuihaoshu_zh){
                       checkoutParam.BetMultiple = obj.multiple;
                   }else{
                       checkoutParam.BetMultiple = 1;
                   }
               } else {
                   checkoutParam.BetMultiple = 1;
               }

               checkoutParam.BetMoney = bigNumberUtil.multiply(checkoutParam.BetMultiple,bigNumberUtil.divided(obj.money,obj.multiple).toString()).toString();

               if(1 < zhuihaoshu_zh){
                   var checkboxObj = document.getElementById("tingZhiZhuiHaoid_zhuihao");
                   if (checkboxObj.checked) {
                       isAppendNum = 2;
                   } else {
                       isAppendNum = 4;
                   }
               }

               if(obj.sntuo==1){
                   checkoutParam.BetMode = 1+isAppendNum;
               }else if(obj.sntuo==2){
                   checkoutParam.BetMode = 16+isAppendNum;
               }else if(obj.sntuo==3){
                   checkoutParam.BetMode = 8+isAppendNum;
               }else{
                   checkoutParam.BetMode = 0+isAppendNum;
               }
               paramList.push(checkoutParam);
            });

        if (1000 < paramList.length) {
            resetFukanFlag_zh();
            toastUtils.showToast("您的订单不能超过1000条!");
            return;
        }

        if (paramList.length <= 0) {
            resetFukanFlag_zh();
            toastUtils.showToast("您当前网速不给力，建议稍后重新操作!");
            return;
        }
   ajaxUtil.ajaxByAsyncPost1(null, '{"UserIDList":[0],"ProjectPublic_PlatformCode":2,"InterfaceName":"GetUserAllMoney"}', function(response) {
         if (true == response.state) {
              var yue = response.lotteryMoney;
              var totalMoney = $('#zhuiHaoPage_money').html();
              var result = bigNumberUtil.minus(yue, totalMoney);
              var zero = new BigNumber("0");
              if (result >= zero) {
                      //向服务器提交投注的数据
                      postParams(paramList, function(data) {
                          if (null == data) {
                              resetFukanFlag_zh();
                               toastUtils.showToast("您当前网速不给力，建议稍后重新操作!");
                              return;
                          }
                          if(true == data.state){
                              var childrens = $("#listviewid").children();
                              $.each(childrens, function(index, item) {
                                      $(item).remove();
                              });
                              //计算显示总注数金额
                               getCheckOutNotesAndMoney();

                              ajaxUtil.ajaxByAsyncPost(null, '{"UserIDList":[0],"ProjectPublic_PlatformCode":2,"InterfaceName":"GetUserAllMoney"}', function(response) {
                                  if (true == response.state) {
                                      var yue = response.lotteryMoney;
                                      localStorageUtils.setParam("lotteryMoney", yue); //保存余额
                                  }
                              });

                              //弹窗查看记录的弹出框
                              $.ui.popup(
                                  {
                                      title:"提示：",
                                      message:'投注成功',
                                      cancelText:"查看记录",
                                      cancelCallback:
                                          function(){
                                              //@ 重置为默认玩法
                                              /*if(currentTouzhuInfo.lotteryType){
                                                  eval(currentTouzhuInfo.lotteryType+"ResetPlayType()");
                                              }*/
                                              localStorageUtils.removeParam("playMode");
                                              localStorageUtils.removeParam("playBeiNum");
                                              localStorageUtils.removeParam("playFanDian");
                                              createInitPanel_Fun("myZhuihaoRecords",false);
                                              //清除数据
                                              clearData();
                                              checkOut_clearData();
                                              if($.query("BODY DIV#mask")){
                                                  $.query("BODY DIV#mask").unbind("touchstart");
                                                  $.query("BODY DIV#mask").unbind("touchmove");
                                                  $("BODY DIV#mask").remove();
                                              }
                                          },
                                      doneText:"继续投注",
                                      onShow:function(){
                                          setTimeout(function(){
                                              if($.query("BODY DIV#mask").length == 0){
                                                  opacity = " style='opacity:0.8;'";
                                                  $.query("BODY").prepend($("<div id='mask'" + opacity + "></div>"));
                                                  $.query("BODY DIV#mask").bind("touchstart", function (e) {
                                                      e.preventDefault();
                                                  });
                                                  $.query("BODY DIV#mask").bind("touchmove", function (e) {
                                                      e.preventDefault();
                                                  });
                                              }
                                          },50);
                                      },
                                      doneCallback:
                                          function(){
                                              createInitPanel_Fun(currentTouzhuInfo.lotteryType+"Page",true);
                                              //清除数据
                                              clearData();
                                              checkOut_clearData();
                                              localStorageUtils.removeParam("resultList_checkout");
                                              currentTouzhuInfo=[];
                                              checkoutResult=[];
                                              if( $.query("BODY DIV#mask")){
                                                  $.query("BODY DIV#mask").unbind("touchstart");
                                                  $.query("BODY DIV#mask").unbind("touchmove");
                                                  $("BODY DIV#mask").remove();
                                              }
                                          },
                                      cancelOnly:false
                                  });
                          }else{
                              if (data.mark == -1){
                                  toastUtils.showToast("您还没有完成与下级的分红契约，无法投注！");
                              }else{
                                  resetFukanFlag_zh();
                                  toastUtils.showToast("投注失败");
                              }
                          }
                      }, function() {
                          resetFukanFlag_zh();
                      },lotteryId_zh,tempIssueNumber,issueJsonList);
                  } else {
                      resetFukanFlag_zh();
                      toastUtils.showToast("余额不足！");
                  }
              }else if (-1 == response.state){
                  loginAgain();
              }else {
                  resetFukanFlag_zh();
                  toastUtils.showToast("获取余额失败！");
              }
       },null);
}
/** 点击“付款”按钮时，如果提交数据异常中断，则需重置某些数据 **/
function resetFukanFlag_zh() {
    //表示用户可以点击“付款”按钮
    syncPay_zh = true;
}
//中奖后停止追号
function checkbox_zh() {
    var checkboxObj = document.getElementById("tingZhiZhuiHaoid_zhuihao");
    if (checkboxObj.checked) {
        cbvalue = "1";
        isAppendNum = 2;
    } else {
        cbvalue = "";
        isAppendNum = 4;
    }
}

/**
 * 计算每期的金额
 * [getbeishu description]
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
*/
function getbeishu(el){
      var value=el.value;
      var patrn=/^\d+(\.\d{1})?$/;
      var pattern=/^0\.\d{1}$/;
      var re = /^[0-9]+[0-9]*]*$/;
       if(!re.exec(value)){
           value=1;
           $('#' + el.id + '').val(1);
           $(moneyTxt).html("0");
      }
      var moneyTxt = $(el).parents('.beishu').parent().next().children(':first');
      if (value > 9999) {
         value=9999;
       toastUtils.showToast("倍数最大9999",2000);
      }
      $('#' + el.id + '').val(parseInt(value));
      $(moneyTxt).html(value * zongzhushu_zh *  2);
      calTotalMoney(currentPage_zh);
}

/**
 *查询期号列表
 */
function searchQiHaoList_zh() {
    ajaxUtil.ajaxByAsyncPost1(null, '{"LotteryCode":'+ lotteryId_zh +',"Num":' + zhuihaoshu_zh +',"ProjectPublic_PlatformCode":2,"InterfaceName":"GetLotteryIssueByNum"}', function(response) {
        if(64 == response.SystemState){
            qihaoList_zh = [];
            $.each(response.LottI, function(index, item) {
                qihaoList_zh.push(item.IssueNumber);
            });
            fukuanPost_zh();
        }else if(response.SystemState == -1){
            loginAgain();
        }else{
            resetFukanFlag_zh();
            toastUtils.showToast("期号获取失败");
        }
    },null);
}

//根据倍投、追号计算总投注金额
function calTotalMoney(style) {
    //总金额
    var zongjine_sum = 0;
    //计算总金额
    $("#"+style+"Table input[type='tel']").each(function(i){
        var moneyTxt = $(this).parents('.beishu').parent().next().children(':first');
        $('#' + this.id + '').val(parseInt(this.value));
        $(moneyTxt).html(bigNumberUtil.multiply(this.value,perTotalMoney).toString());
        if (i != 0 && isNaN(this.value) || this.value == 0) {
            $('#'+this.id).val(0);
        } else{
            zongjine_sum = bigNumberUtil.add(zongjine_sum,$(moneyTxt).html());
        }
        chaseZhuihaoMultipleList[i]=parseInt(this.value);
    });

    $("#zhuiHaoPage_money").text(parseFloat(zongjine_sum));
    $("#zhuiHaoPage_zhushu").text(zongzhushu_zh);
    $("#zhuiHaoQiShuId").text(getchaseZhuihaoMultipleList());
    $("#zhuiHao_lottery_money").html(localStorageUtils.getParam("lotteryMoney"));
}

function getchaseZhuihaoMultipleList(){
   var s=0;
   for(var i=0;chaseZhuihaoMultipleList.length > i;i++){
      if(chaseZhuihaoMultipleList[i]!=0){
         s++;
      }
   }
   return s;
}

/* Click Button to Plus 1 (When It's prev Element is a Input )*/
function plusOne(click,limit) {
    var inputValue = parseInt($(click).prev('input').val());
    if (inputValue < limit){  // 最大限制
        inputValue = parseInt(inputValue + 1);
        $(click).prev('input').val(inputValue);
    }
}

/* Click Button to Minus 1 (When It's next Element is a Input )*/
function minusOne(click,limit) {
    var inputValue = parseInt($(click).next('input').val());
    if (inputValue > limit){ // 最小限制
        inputValue = parseInt(inputValue - 1);
        $(click).next('input').val(inputValue);
    }
}

//验证不可为空，并设置最小值,最大值
function setMinMaxNum(input,minNum,maxNum) {
    if( input.value =="" || parseInt(input.value) == 0 || parseInt(input.value) < minNum){
        return input.value = minNum;
    }else if (parseInt(input.value) > maxNum){
        return input.value = maxNum;
    }else{
        return input.value = Number(input.value);
    }
}

