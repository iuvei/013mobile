/* 
* @Author: LY
* @Date:   2016-06-24 11:34:27
*/
//投注模式
var payMode = "";
//返点模式
var fanDianMode = "";
//购买方式： 正常投注/追号投注
var buyMode = "";
//中奖后是否追号
var winIsStop = "";
//判断来源是哪个页面：投注/中奖
var sourceFlag = "";
//订单ID计数
var sum = 0;
//彩种名称
var lotteryType = "";
//订单ID
var orderId = "";
//期号
var bettingqiHao="";
//流水号
var bettingorderID="";
//投注时间
var insertTime = "";
//IsHistory 默认false  是否是历史记录
var IsHistory=false;
/**
 * 进入页面调用
 * [teamBettingOrderDetailsLoadedPanel description]
 * @return {[type]} [description]
 */
function teamBettingOrderDetailsLoadedPanel(){
   catchErrorFun("teamBettingOrderDetailsInit();");
}

/**
 * 离开页面调用
 * [teamBettingOrderDetailsUnloadedPanel description]
 * @return {[type]} [description]
 */
function teamBettingOrderDetailsUnloadedPanel(){
	$("#teamBettingCardContent").empty();
}

/**
 * 初始化
 * [teamBettingOrderDetailsInit description]
 * @return {[type]} [description]
 */
function teamBettingOrderDetailsInit(){
	sourceFlag = localStorageUtils.getParam("sourceFlag");
	if(!(IsHistory=localStorageUtils.getParam("IsHistory"))){
		IsHistory=false;
	}
	var bettingItem = JSON.parse(localStorageUtils.getParam("scheme"));
	lotteryType = bettingItem.lotteryType; //彩种
	insertTime = bettingItem.tzTime;  //投注时间
	orderId = bettingItem.orderId;   //订单ID
	bettingorderID = bettingItem.bettingorderID;  //流水号
	bettingqiHao = bettingItem.qiHao;	  //期号
	$("#teamBettingChaseOrderID").html(bettingItem.orderId);  //订单号
	$("#teamBettingOrderID").html(bettingItem.bettingorderID);  //流水号
	$("#datetime_team").html(bettingItem.tzTime);
	searchTeamBettingOrderDetails(lotteryType, bettingorderID);

	//添加滚动条
	 $("#teamBettingOrderDetailsPage").scroller({
		verticalScroll : true,
		horizontalScroll : false,
		vScrollCSS: "afScrollbar",
		autoEnable : true
	});
}
/**
 * 查询订单详情信息
 * @param lotteryId 彩种ID
 * @param orderId 订单ID号
 */
function searchTeamBettingOrderDetails(lotteryId, orderId) {
	var params='{"InsertTime":"'+insertTime+'","ProjectPublic_PlatformCode":2,"InterfaceName":"GetBetDetailNew","LotteryCode":"' + lotteryId + '","IsHistory":' + IsHistory + ',"OrderID":"' + orderId + '"}';
	ajaxUtil.ajaxByAsyncPost(null, params, searchSuccessTeamBettingOrderDetailsCallBack, '正在加载数据...');
}

/**
 * Description 查询订单记录回调函数
 * @param
 * @return data 服务端返数据
 */
function searchSuccessTeamBettingOrderDetailsCallBack(data) {
	// console.log("查询订单记录返回的数据：" + JSON.stringify(data));

	// $("#teamBettingCancelOrder").empty();
	$("#teamBettingOrderListCard").empty();
	$("#teamBettingCardContent").empty();

//*********  现在的 Start  标题 ***********
//	$("#teamBettingOrderListCard").append('<li id="cardTitle" style="text-align: left;font-size:14px;font-weight:100;color:snow;background:#ba142b;padding:6px;border-radius: 5px;margin:5px 8px 0px 8px;">投 注 详 单</li>');
//*********  现在的 End ***********

	if (data.SystemState == 64) {
		var info = data.UserBetInfo;
	    var bet = info.Bet;
		if(bet == ""){
			return;
		}	    
		fanDianMode = info.BetRebate;
		payMode = bet[0].BetMode;
		buyMode = bet[0].BetMode;
		winIsStop = bet[0].BetMode;

		$("#payMode_team").html(IsLongHuDou(lotteryType,bet[0].PlayCode) ? "元模式" : getPayMode(payMode));
		$("#fanDian_team").html(IsLongHuDou(lotteryType,bet[0].PlayCode) ? "1800" : fanDianMode);

		if ((Number(winIsStop) & 2) == 2) {
			$("#winIsStop_team").html("是");
		} else if ((Number(winIsStop) & 4) == 4) {
			$("#winIsStop_team").html("否");
		} else {
			$("#winIsStop_team").html("---");
		}

		for (var i = 0; i < bet.length; i++) {
			var text = "";
			var dataSet = new Object();
			dataSet.betId = bet[i].ChaseOrderID;
			dataSet.orderId = bet[i].ChaseOrderID;
			dataSet.liushuiorderID = bet[i].OrderID;
			dataSet.qiHao = bet[i].IssueNumber;
			dataSet.beiShu = bet[i].BetMultiple;
			dataSet.money = parseFloat(bet[i].BetMoney);
			dataSet.operateType = bet[i].BetOrderState;
			dataSet.betState = bet[i].BetOrderState;  //订单状态
			dataSet.DrawContent = bet[i].DrawContent;  //开奖号码
			dataSet.prizeNum = bet[i].AwContent; //中奖注数
			dataSet.tzZhuShu = bet[i].BetCount; //投注注数

			dataSet.prizeMoney = bet[i].AwMoney;//changeTwoDecimal_f(bet[i].AwMoney); //奖金
			dataSet.tzcontent = bet[i].BetContent; //投注号码
			dataSet.lotteryType = info.LotteryCode;
			dataSet.ticketType = bet[i].PlayCode; //玩法
			dataSet.isDT = bet[i].BetMode;
			if(bettingqiHao==dataSet.qiHao){
			var listitem = JSON.stringify(dataSet);
			sum++;
			localStorageUtils.setParam("order" + sum, listitem);
				var liId="order"+sum;
			var $itemdetailLi = $('<li id='+liId+'></li>').data('itemdetailLi',dataSet);
				$itemdetailLi.on('click',function() {
					localStorageUtils.setParam("orderIndex",JSON.stringify($(this).data('itemdetailLi')));
					setPanelBackPage_Fun('bettingDetil');
				});

			   var yingKui = '--';
			   var $delete_;
			   var operateType_='';
			   if((Number(dataSet.betState) & 1048577) == 1048577){
                   $delete_=$('<div  class="loginBtn" style="border-radius:17px 17px 17px 17px; margin-top:20px; margin-bottom:20px;" id='+dataSet.liushuiorderID+' onclick="createInitPanel_team(this);">撤单</div>');
                   operateType_='<span class="perOrderState">购买成功</span>';
			   }else{
				   if ((Number(dataSet.operateType) & 1) == 1) {
					   operateType_ = '<span class="perOrderState">购买成功</span>';
				   } else if ((Number(dataSet.operateType) & 32768) == 32768) {
					   operateType_ = '<span class="perOrderState">已撤奖</span>';
					   yingKui = bigNumberUtil.minus(dataSet.prizeMoney, dataSet.money) +'元';
				   } else if ((Number(dataSet.operateType) & 64) == 64) {
					   operateType_ = '<span class="perOrderState">已出票</span>';
				   } else if ((Number(dataSet.operateType) & 16777216) == 16777216) {
					   operateType_ = '<span class="perOrderState">已派奖</span>';
					   yingKui = bigNumberUtil.minus(dataSet.prizeMoney, dataSet.money) +'元';
				   } else if ((Number(dataSet.operateType) & 33554432) == 33554432) {
					   operateType_ = '<span class="perOrderState">未中奖</span>';
					   yingKui = bigNumberUtil.minus(dataSet.prizeMoney, dataSet.money) +'元';
				   } else if ((Number(dataSet.operateType) & 4096) == 4096) {
					   operateType_ = '<span class="perOrderState">已结算</span>';
					   yingKui = bigNumberUtil.minus(dataSet.prizeMoney, dataSet.money) +'元';
				   } else if ((Number(dataSet.operateType) & 512) == 512) {
					   operateType_ = '<span class="perOrderState">强制结算</span>';
					   yingKui = bigNumberUtil.minus(dataSet.prizeMoney, dataSet.money) +'元';
				   } else if ((Number(dataSet.operateType) & 4) == 4) {
					   operateType_ = '<span class="perOrderState">已撤单</span>';
				   } else {
					   operateType_ = '<span class="perOrderState">订单异常</span>';
				   }
			   }

//*******  contentDetails Start ***********
			var $contentDetails = $('<ul class="mylist"><li>投注期号 : <span id="qiHao" class="redtext">' + bettingqiHao +
			'</span></li><li>彩&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种：<span id="lotteryCodeID" class="redtext">' + LotteryInfo.getLotteryNameById(lotteryType) +
			'</span></li><li>玩&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;法：<span id="playCodeID" class="redtext">' + LotteryInfo.getPlayMethodName(lotteryType + "", dataSet.ticketType + "", dataSet.isDT) +
			'</span></li><li>购彩金额：<span id="tzmoney" class="redtext">' + dataSet.money + '元' +
			'</span></li>' +
			'<li>投注倍数：<span id="beiShu" class="redtext">' + (IsLongHuDou(lotteryType,dataSet.ticketType)?"1" :dataSet.beiShu) +
			'</span><SPAN class="redtext">倍</SPAN></li><li>投注注数：<span id="betCount" class="redtext">' + dataSet.tzZhuShu +
			'</span><SPAN class="redtext">注</SPAN></li><li>订单状态：<span id="orderState" class="redtext">' + getOrderState(dataSet.betState) +
			'</span></li><li>中奖注数：<span id="prizeNums" class="redtext" style="white-space:pre-wrap;table-layout:fixed; word-break : break-all; word-wrap : break-word;">' + prizeNum_team(dataSet.prizeNum) +
			'</span><SPAN class="redtext">注</SPAN></li><li>奖&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金：<span id="prizeMoney" class="redtext">' + dataSet.prizeMoney + '元' +
			'</span></li><li style="word-break: break-all;word-wrap:break-word;white-space:normal;">开奖号码：<span id="prizeResult" class="redtext">' + getPrizeResults(dataSet,lotteryType) +
			'</span></li><li style="word-break: break-all;word-wrap:break-word;white-space:normal;">投注号码：<span id="betContent" class="redtext">' + tzContentToChinese(dataSet.lotteryType, dataSet.ticketType + "", dataSet.tzcontent) + '</span></li></ul>');

//*******  contentDetails End ***********

				$("#teamBettingCardContent").append($contentDetails); // contentcard Details
				// $("#teamBettingCancelOrder").append($delete_);//撤单
		  }
	  }
	} else if (data.SystemState == -1) {
		loginAgain();
	} else {
		toastUtils.showToast("当前网络不给力，请稍后再试");
	}
}

//调用--撤掉单条记录回调函数
function createInitPanel_team(id){
	deleteSingleOrderByOrderId(id);
	event.stopPropagation();
}

/**
 * Description 撤掉单条记录回调函数
 * @return data 服务端返数据
 */
function deleteSingleOrderByOrderId(id) {
  	 var params = '{"InterfaceName":"CancelOrder","ProjectPublic_PlatformCode":2,"Code":"' + lotteryType + '","OrderID":"' + id.id + '"}';
	ajaxUtil.ajaxByAsyncPost(null, params, function(data){
			if (data.SystemState == 64) {
				if (data.CarryStateResult) {
					toastUtils.showToast("撤单成功");
					searchTeamBettingOrderDetails(lotteryType, bettingorderID);
				} else if(data.OrderState == -1){
					toastUtils.showToast("该期已封单，不能撤单！");
				} else {
					toastUtils.showToast("撤单失败");
				}
			} else if (data.SystemState == -1) {
				loginAgain();
			} else {
		        toastUtils.showToast("当前网络不给力，请稍后再试");
			}
	}, '正在加载数据...');   
}

/*@ Function for contentDetails
** 中奖注数
*/
function prizeNum_team(num){
	if (num=="") {
		return '0';
	} else {
		return num;
	}
}

