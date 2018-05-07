var dbsdwfc_playType = 2;
var dbsdwfc_playMethod = 15;
var dbsdwfc_sntuo = 0;
var dbsdwfc_rebate;
var dbsdwfcScroll;

//进入这个页面时调用
function dbsdwfcPageLoadedPanel() {
	catchErrorFun("dbsdwfc_init();");
}

//离开这个页面时调用
function dbsdwfcPageUnloadedPanel(){
	$("#dbsdwfc_queding").off('click');
	$("#dbsdwfcPage_back").off('click');
	$("#dbsdwfc_ballView").empty();
	$("#dbsdwfcSelect").empty();
	var $select = $('<select class="cs-select cs-skin-overlay" id="dbsdwfcPlaySelect"></select>');
	$("#dbsdwfcSelect").append($select);
}

//入口函数
function dbsdwfc_init(){
	$("#dbsdwfc_title").html(LotteryInfo.getLotteryNameByTag("dbsdwfc"));
	for(var i = 0; i< LotteryInfo.getPlayLength("ssc");i++){
		if(i == 15){//去掉骰宝龙虎
			continue;
		}
		var $play = $('<optgroup label="'+LotteryInfo.getPlayName("ssc",i)+'"></optgroup>');
		for(var j = 0; j < LotteryInfo.getMethodLength("ssc");j++){
			if(LotteryInfo.getMethodTypeId("ssc",j) == LotteryInfo.getPlayTypeId("ssc",i)){
				var name = LotteryInfo.getMethodName("ssc",j);
				if(i == dbsdwfc_playType && j == dbsdwfc_playMethod){
					$play.append('<option value="dbsdwfc'+LotteryInfo.getMethodIndex("ssc",j)+'" selected="selected">' + name +'</option>');
				}else{
					$play.append('<option value="dbsdwfc'+LotteryInfo.getMethodIndex("ssc",j)+'">' + name +'</option>');
				}
			}
		}
		$("#dbsdwfcPlaySelect").append($play);
	}

	[].slice.call( document.getElementById("dbsdwfcSelect").querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el, {
			stickyPlaceholder: true,
			onChange:dbsdwfcChangeItem
		});
	});

	//添加滑动条
	new IScroll('.cs-options',{
		click:true,
		scrollbars: true,
		mouseWheel: true,
		interactiveScrollbars: true,
		shrinkScrollbars: 'scale',
		fadeScrollbars: true
	});

	GetLotteryInfo("dbsdwfc",function (){
		dbsdwfcChangeItem("dbsdwfc"+dbsdwfc_playMethod);
	});

	//添加滑动条
	if(!dbsdwfcScroll){
		dbsdwfcScroll = new IScroll('#dbsdwfcContent',{
			click:true,
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
	}

	//获取期号
	getQihao("dbsdwfc",LotteryInfo.getLotteryIdByTag("dbsdwfc"));

	//获取上一期开奖
	queryLastPrize("dbsdwfc");

	//获取单挑和单期最高奖金
	getLotteryMaxBonus('dbsdwfc');

	//机选选号
	$("#dbsdwfc_random").on('click', function(event) {
		dbsdwfc_randomOne();
	});

	//返回
	$("#dbsdwfcPage_back").on('click', function(event) {
		// dbsdwfc_playType = 2;
		// dbsdwfc_playMethod = 15;
		$("#dbsdwfc_ballView").empty();
		localStorageUtils.removeParam("playMode");
		localStorageUtils.removeParam("playBeiNum");
		localStorageUtils.removeParam("playFanDian");
		dbsdwfc_qingkongAll();
		setPanelBackPage_Fun('lotteryHallPage');
	});

	qingKong("dbsdwfc");//清空
	dbsdwfc_submitData();
}

function dbsdwfcResetPlayType(){
	dbsdwfc_playType = 2;
	dbsdwfc_playMethod = 15;
}

function dbsdwfcChangeItem(val) {
	dbsdwfc_qingkongAll();
	var temp = val.substring("dbsdwfc".length,val.length);
	if(val == "dbsdwfc0"){
		//直选复式
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 0;
		createFiveLineLayout("dbsdwfc", function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc1"){
		//直选单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 1;
		$("#dbsdwfc_ballView").empty();
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>五星直选:12345<br/>1)每注必须是5个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc2"){
		//组选120
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 2;
		createOneLineLayout("dbsdwfc","至少选择5个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc3"){
		//组选60
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 3;
		var tips = ["二重号:至少选择1个号码","单号:至少选择3个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc4"){
		//组选30
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 4;
		var tips = ["二重号:至少选择2个号码","单号:至少选择1个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc5"){
		//组选20
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 5;
		var tips = ["三重号:至少选择1个号码","单号:至少选择2个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc6"){
		//组选10
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 6;
		var tips = ["三重号:至少选择1个号码","二重号:至少选择1个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc7"){
		//组选5
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 7
		var tips = ["四重号:至少选择1个号码","单号:至少选择1个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc8"){
		//总和大小单双
		$("#dbsdwfc_random").show();
		var num = ["大","小","单","双"];
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 0;
		dbsdwfc_playMethod = 8;
		createNonNumLayout("dbsdwfc",dbsdwfc_playMethod,num,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc9"){
		//直选复式
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 1;
		dbsdwfc_playMethod = 9;
		var tips = ["千位:至少选择1个号码","百位:至少选择1个号码","十位:至少选择1个号码","个位:至少选择1个号码"];
		createFourLineLayout("dbsdwfc",tips, function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc10"){
		//直选单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 1;
		dbsdwfc_playMethod = 10;
		$("#dbsdwfc_ballView").empty();
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>后四直选:1234<br/>1)每注必须是4个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc11"){
		//组选24
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 1;
		dbsdwfc_playMethod = 11;
		createOneLineLayout("dbsdwfc","至少选择4个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc12"){
		//组选12
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 1;
		dbsdwfc_playMethod = 12;
		var tips = ["二重号:至少选择1个号码","单号:至少选择2个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc13"){
		//组选6
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 1;
		dbsdwfc_playMethod = 13;
		createOneLineLayout("dbsdwfc","二重号:至少选择2个号码",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc14"){
		//组选4
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 1;
		dbsdwfc_playMethod = 14;
		var tips = ["三重号:至少选择1个号码","单号:至少选择1个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc15"){
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 15;
		var tips = ["百位:至少选择1个号码","十位:至少选择1个号码","个位:至少选择1个号码"];
		createThreeLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc16"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 16;
		$("#dbsdwfc_ballView").empty();
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>后三直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc17"){
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 17;
		createSumLayout("dbsdwfc",0,27,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc18"){
		//直选跨度
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 18;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc19"){
		//后三组三
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 19;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc20"){
		//后三组六
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 20;
		createOneLineLayout("dbsdwfc","至少选择3个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc21"){
		//后三和值
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 21;
		createSumLayout("dbsdwfc",1,26,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc22"){
		//后三组选包胆
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 22;
		dbsdwfc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbsdwfc",array,["请选择一个号码"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc23"){
		//后三混合组选
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 23;
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>后三混合组选(含组三、组六):123或者223<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc24"){
		//和值尾数
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 24;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc25"){
		//特殊号
		$("#dbsdwfc_random").show();
		var num = ["豹子","顺子","对子","半顺","杂六"];
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 2;
		dbsdwfc_playMethod = 25;
		createNonNumLayout("dbsdwfc",dbsdwfc_playMethod,num,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc26"){
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 26;
		var tips = ["千位:至少选择1个号码","百位:至少选择1个号码","十位:至少选择1个号码"];
		createThreeLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc27"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 27;
		$("#dbsdwfc_ballView").empty();
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>中三直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc28"){
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 28;
		createSumLayout("dbsdwfc",0,27,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc29"){
		//直选跨度
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 29;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc30"){
		//中三组三
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 30;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc31"){
		//中三组六
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 31;
		createOneLineLayout("dbsdwfc","至少选择3个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc32"){
		//中三和值
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 32;
		createSumLayout("dbsdwfc",1,26,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc33"){
		//中三组选包胆
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 33;
		dbsdwfc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbsdwfc",array,["请选择一个号码"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc34"){
		//中三混合组选
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 34;
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>中三混合组选(含组三、组六):123或者223<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc35"){
		//和值尾数
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 35;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc36"){
		//特殊号
		$("#dbsdwfc_random").show();
		var num = ["豹子","顺子","对子","半顺","杂六"];
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 3;
		dbsdwfc_playMethod = 36;
		createNonNumLayout("dbsdwfc",dbsdwfc_playMethod,num,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc37"){
		//直选复式
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 37;
		var tips = ["万位:至少选择1个号码","千位:至少选择1个号码","百位:至少选择1个号码"];
		createThreeLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc38"){
		//直选单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 38;
		$("#dbsdwfc_ballView").empty();
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>前三直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc39"){
		//和值
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 39;
		createSumLayout("dbsdwfc",0,27,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc40"){
		//直选跨度
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 40;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc41"){
		//前三组三
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 41;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc42"){
		//前三组六
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 42;
		createOneLineLayout("dbsdwfc","至少选择3个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc43"){
		//前三和值
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 43;
		createSumLayout("dbsdwfc",1,26,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc44"){
		//前三组选包胆
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 44;
		dbsdwfc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbsdwfc",array,["请选择一个号码"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc45"){
		//前三混合组选
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 45;
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>前三混合组选(含组三、组六):123或者223<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc46"){
		//和值尾数
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 46;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc47"){
		//特殊号
		$("#dbsdwfc_random").show();
		var num = ["豹子","顺子","对子","半顺","杂六"];
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 4;
		dbsdwfc_playMethod = 47;
		createNonNumLayout("dbsdwfc",dbsdwfc_playMethod,num,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc48"){
		//后二复式
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 5;
		dbsdwfc_playMethod = 48;
		var tips = ["十位：可选1-10个","个位：可选1-10个"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc49"){
		//后二单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 5;
		dbsdwfc_playMethod = 49;
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>后二直选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc50"){
		//后二和值
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 5;
		dbsdwfc_playMethod = 50;
		createSumLayout("dbsdwfc",0,18,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc51"){
		//直选跨度
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 5;
		dbsdwfc_playMethod = 51;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc52"){
		//后二组选
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 5;
		dbsdwfc_playMethod = 52;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc53"){
		//后二和值
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 5;
		dbsdwfc_playMethod = 53;
		createSumLayout("dbsdwfc",1,17,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc54"){
		//后二组选包胆
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 5;
		dbsdwfc_playMethod = 54;
		dbsdwfc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbsdwfc",array,["请选择一个号码"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc55"){
		//前二复式
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 6;
		dbsdwfc_playMethod = 55;
		var tips = ["万位：可选1-10个","千位：可选1-10个"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc56"){
		//前二单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 6;
		dbsdwfc_playMethod = 56;
		dbsdwfc_qingkongAll();
		var tips = "<p>格式说明<br/>前二直选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
	}else if(val == "dbsdwfc57"){
		//前二和值
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 6;
		dbsdwfc_playMethod = 57;
		createSumLayout("dbsdwfc",0,18,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc58"){
		//直选跨度
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 6;
		dbsdwfc_playMethod = 58;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc59"){
		//前二组选
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 6;
		dbsdwfc_playMethod = 59;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc60"){
		//前二和值
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 6;
		dbsdwfc_playMethod = 60;
		createSumLayout("dbsdwfc",1,17,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc61"){
		//前二组选包胆
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 6;
		dbsdwfc_playMethod = 61;
		dbsdwfc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbsdwfc",array,["请选择一个号码"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc62"){
		//定位复式
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 7;
		dbsdwfc_playMethod = 62;
		createFiveLineLayout("dbsdwfc", function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc63"){
		//后三一码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 63;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc64"){
		//后三二码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 64;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc65"){
		//前三一码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 65;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc66"){
		//前三二码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 66;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc67"){
		//后四一码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 67;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc68"){
		//后四二码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 68;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc69"){
		//前四一码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 69;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc70"){
		//前四二码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 70;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc71"){
		//五星一码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 71;
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc72"){
		//五星二码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 72;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc73"){
		//五星三码
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 8;
		dbsdwfc_playMethod = 73;
		createOneLineLayout("dbsdwfc","至少选择3个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc74"){
		//后二大小单双
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 9;
		dbsdwfc_playMethod = 74;
		createTextBallTwoLayout("dbsdwfc",["大","小","单","双"],["十位:至少选择一个","个位:至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc75"){
		//后三大小单双
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 9;
		dbsdwfc_playMethod = 75;
		createTextBallThreeLayout("dbsdwfc",["大","小","单","双"],["百位:至少选择一个","十位:至少选择一个","个位:至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc76"){
		//前二大小单双
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 9;
		dbsdwfc_playMethod = 76;
		createTextBallTwoLayout("dbsdwfc",["大","小","单","双"],["万位:至少选择一个","千位:至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc77"){
		//前三大小单双
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 9;
		dbsdwfc_playMethod = 77;
		createTextBallThreeLayout("dbsdwfc",["大","小","单","双"],["万位:至少选择一个","千位:至少选择一个","百位:至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc78"){
		//直选复式
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 10;
		dbsdwfc_playMethod = 78;
		createFiveLineLayout("dbsdwfc",function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc79"){
		//直选单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 10;
		dbsdwfc_playMethod = 79;
		var tips = "<p>格式说明<br/>任选二直选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
		createRenXuanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc80"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 10;
		dbsdwfc_playMethod = 80;
		createSumLayout("dbsdwfc",0,18,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc81"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 10;
		dbsdwfc_playMethod = 81;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc82"){
		//组选单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 10;
		dbsdwfc_playMethod = 82;
		var tips = "<p>格式说明<br/>任选二组选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割，每注号码不能相同;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
		createRenXuanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc83"){
		//组选和值
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 10;
		dbsdwfc_playMethod = 83;
		createSumLayout("dbsdwfc",1,17,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc84"){
		//直选复式
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 84;
		createFiveLineLayout("dbsdwfc", function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc85"){
		//直选单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 85;
		var tips = "<p>格式说明<br/>任选三直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
		createRenXuanSanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc86"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 86;
		createSumLayout("dbsdwfc",0,27,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanSanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc87"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 87;
		createOneLineLayout("dbsdwfc","至少选择2个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanSanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc88"){
		//组选单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 88;
		var tips = "<p>格式说明<br/>任选三组三:122<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
		createRenXuanSanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc89"){
		//组选和值
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 89;
		createOneLineLayout("dbsdwfc","至少选择3个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanSanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc90"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 90;
		var tips = "<p>格式说明<br/>任选三组六:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割，每注号码各不相同;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
		createRenXuanSanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc91"){
		//混合组选
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 91;
		var tips = "<p>格式说明<br/>任选三混合组选:122或123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
		createRenXuanSanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc92"){
		//组选和值
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 11;
		dbsdwfc_playMethod = 92;
		createSumLayout("dbsdwfc",1,26,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanSanLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc93"){
		$("#dbsdwfc_random").show();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 12;
		dbsdwfc_playMethod = 93;
		createFiveLineLayout("dbsdwfc", function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc94"){
		//直选单式
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 3;
		dbsdwfc_playType = 12;
		dbsdwfc_playMethod = 94;
		var tips = "<p>格式说明<br/>任选四直选:1234<br/>1)每注必须是4个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbsdwfc",tips);
		createRenXuanSiLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc95"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 12;
		dbsdwfc_playMethod = 95;
		createOneLineLayout("dbsdwfc","至少选择4个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanSiLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc96"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 12;
		dbsdwfc_playMethod = 96;
		var tips = ["二重号:至少选择1个号码","单号:至少选择2个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanSiLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc97"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 12;
		dbsdwfc_playMethod = 97;
		$("#dbsdwfc_ballView").empty();
		createOneLineLayout("dbsdwfc","二重号:至少选择2个号码",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanSiLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc98"){
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 12;
		dbsdwfc_playMethod = 98;
		$("#dbsdwfc_ballView").empty();
		var tips = ["三重号:至少选择1个号码","单号:至少选择1个号码"];
		createTwoLineLayout("dbsdwfc",tips,0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		createRenXuanSiLayout("dbsdwfc",dbsdwfc_playMethod,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc99"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 13;
		dbsdwfc_playMethod = 99;
		$("#dbsdwfc_ballView").empty();
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc100"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 13;
		dbsdwfc_playMethod = 100;
		$("#dbsdwfc_ballView").empty();
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc101"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 13;
		dbsdwfc_playMethod = 101;
		$("#dbsdwfc_ballView").empty();
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc102"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 13;
		dbsdwfc_playMethod = 102;
		$("#dbsdwfc_ballView").empty();
		createOneLineLayout("dbsdwfc","至少选择1个",0,9,false,function(){
			dbsdwfc_calcNotes();
		});
		dbsdwfc_qingkongAll();
	}else if(val == "dbsdwfc103"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 103;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc104"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 104;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc105"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 105;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc106"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 106;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc107"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 107;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc108"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 108;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc109"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 109;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc110"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 110;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc111"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 111;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}else if(val == "dbsdwfc112"){
		dbsdwfc_qingkongAll();
		$("#dbsdwfc_random").hide();
		dbsdwfc_sntuo = 0;
		dbsdwfc_playType = 14;
		dbsdwfc_playMethod = 112;
		createTextBallOneLayout("dbsdwfc",["龙","虎","和"],["至少选择一个"],function(){
			dbsdwfc_calcNotes();
		});
	}

	if(dbsdwfcScroll){
		dbsdwfcScroll.refresh();
	}
	initFooterData("dbsdwfc",temp);
	hideRandomWhenLi("dbsdwfc",dbsdwfc_sntuo,dbsdwfc_playMethod);
	dbsdwfc_calcNotes();
}
/**
 * [dbsdwfc_initFooterButton 初始化底部Button显示隐藏]
 * @return {[type]} [description]
 */
function dbsdwfc_initFooterButton(){
	if(dbsdwfc_playMethod == 0 || dbsdwfc_playMethod == 62 || dbsdwfc_playMethod == 78
		|| dbsdwfc_playMethod == 84 || dbsdwfc_playMethod == 93 || dbsdwfc_playType == 7){
		if(LotteryStorage["dbsdwfc"]["line1"].length > 0 || LotteryStorage["dbsdwfc"]["line2"].length > 0 ||
			LotteryStorage["dbsdwfc"]["line3"].length > 0 || LotteryStorage["dbsdwfc"]["line4"].length > 0 ||
			LotteryStorage["dbsdwfc"]["line5"].length > 0){
			$("#dbsdwfc_qingkong").css("opacity",1.0);
		}else{
			$("#dbsdwfc_qingkong").css("opacity",0.4);
		}
	}else if(dbsdwfc_playMethod == 9){
		if(LotteryStorage["dbsdwfc"]["line1"].length > 0 || LotteryStorage["dbsdwfc"]["line2"].length > 0 ||
			LotteryStorage["dbsdwfc"]["line3"].length > 0 || LotteryStorage["dbsdwfc"]["line4"].length > 0 ){
			$("#dbsdwfc_qingkong").css("opacity",1.0);
		}else{
			$("#dbsdwfc_qingkong").css("opacity",0.4);
		}
	}else if(dbsdwfc_playMethod == 37 || dbsdwfc_playMethod == 4 || dbsdwfc_playMethod == 6
		|| dbsdwfc_playMethod == 26 || dbsdwfc_playMethod == 15 || dbsdwfc_playMethod == 75 || dbsdwfc_playMethod == 77){
		if(LotteryStorage["dbsdwfc"]["line1"].length > 0 || LotteryStorage["dbsdwfc"]["line2"].length > 0
			|| LotteryStorage["dbsdwfc"]["line3"].length > 0){
			$("#dbsdwfc_qingkong").css("opacity",1.0);
		}else{
			$("#dbsdwfc_qingkong").css("opacity",0.4);
		}
	}else if(dbsdwfc_playMethod == 3 || dbsdwfc_playMethod == 4 || dbsdwfc_playMethod == 5
		|| dbsdwfc_playMethod == 6 || dbsdwfc_playMethod == 7 || dbsdwfc_playMethod == 12
		|| dbsdwfc_playMethod == 14 || dbsdwfc_playMethod == 48 || dbsdwfc_playMethod == 55
		|| dbsdwfc_playMethod == 74 || dbsdwfc_playMethod == 76 || dbsdwfc_playMethod == 96 || dbsdwfc_playMethod == 98){
		if(LotteryStorage["dbsdwfc"]["line1"].length > 0 || LotteryStorage["dbsdwfc"]["line2"].length > 0){
			$("#dbsdwfc_qingkong").css("opacity",1.0);
		}else{
			$("#dbsdwfc_qingkong").css("opacity",0.4);
		}
	}else if(dbsdwfc_playMethod == 2 || dbsdwfc_playMethod == 8 || dbsdwfc_playMethod == 11 || dbsdwfc_playMethod == 13 || dbsdwfc_playMethod == 39
		|| dbsdwfc_playMethod == 28 || dbsdwfc_playMethod == 17 || dbsdwfc_playMethod == 18 || dbsdwfc_playMethod == 24 || dbsdwfc_playMethod == 41
		|| dbsdwfc_playMethod == 25 || dbsdwfc_playMethod == 29 || dbsdwfc_playMethod == 42 || dbsdwfc_playMethod == 43 || dbsdwfc_playMethod == 30
		|| dbsdwfc_playMethod == 35 || dbsdwfc_playMethod == 36 || dbsdwfc_playMethod == 31 || dbsdwfc_playMethod == 32 || dbsdwfc_playMethod == 19
		|| dbsdwfc_playMethod == 40 || dbsdwfc_playMethod == 46 || dbsdwfc_playMethod == 20 || dbsdwfc_playMethod == 21 || dbsdwfc_playMethod == 50
		|| dbsdwfc_playMethod == 47 || dbsdwfc_playMethod == 51 || dbsdwfc_playMethod == 52 || dbsdwfc_playMethod == 53 || dbsdwfc_playMethod == 57 || dbsdwfc_playMethod == 63
		|| dbsdwfc_playMethod == 58 || dbsdwfc_playMethod == 59 || dbsdwfc_playMethod == 60 || dbsdwfc_playMethod == 65 || dbsdwfc_playMethod == 80 || dbsdwfc_playMethod == 81 || dbsdwfc_playType == 8
		|| dbsdwfc_playMethod == 83 || dbsdwfc_playMethod == 86 || dbsdwfc_playMethod == 87 || dbsdwfc_playMethod == 22 || dbsdwfc_playMethod == 33 || dbsdwfc_playMethod == 44
		|| dbsdwfc_playMethod == 89 || dbsdwfc_playMethod == 92 || dbsdwfc_playMethod == 95 || dbsdwfc_playMethod == 54 || dbsdwfc_playMethod == 61
		|| dbsdwfc_playMethod == 97 || dbsdwfc_playType == 13  || dbsdwfc_playType == 14){
		if(LotteryStorage["dbsdwfc"]["line1"].length > 0){
			$("#dbsdwfc_qingkong").css("opacity",1.0);
		}else{
			$("#dbsdwfc_qingkong").css("opacity",0.4);
		}
	}else{
		$("#dbsdwfc_qingkong").css("opacity",0);
	}

	if($("#dbsdwfc_qingkong").css("opacity") == "0"){
		$("#dbsdwfc_qingkong").css("display","none");
	}else{
		$("#dbsdwfc_qingkong").css("display","block");
	}

	if($('#dbsdwfc_zhushu').html() > 0){
		$("#dbsdwfc_queding").css("opacity",1.0);
	}else{
		$("#dbsdwfc_queding").css("opacity",0.4);
	}
}

/**
 * @Author:      muchen
 * @DateTime:    2014-12-13 14:40:19
 * @Description: 清空所有记录
 */
function  dbsdwfc_qingkongAll(){
	$("#dbsdwfc_ballView span").removeClass('redBalls_active');
	LotteryStorage["dbsdwfc"]["line1"] = [];
	LotteryStorage["dbsdwfc"]["line2"] = [];
	LotteryStorage["dbsdwfc"]["line3"] = [];
	LotteryStorage["dbsdwfc"]["line4"] = [];
	LotteryStorage["dbsdwfc"]["line5"] = [];

	localStorageUtils.removeParam("dbsdwfc_line1");
	localStorageUtils.removeParam("dbsdwfc_line2");
	localStorageUtils.removeParam("dbsdwfc_line3");
	localStorageUtils.removeParam("dbsdwfc_line4");
	localStorageUtils.removeParam("dbsdwfc_line5");

	$('#dbsdwfc_zhushu').text(0);
	$('#dbsdwfc_money').text(0);
	clearAwardWin("dbsdwfc");
	dbsdwfc_initFooterButton();
}

/**
 * [dbsdwfc_calcNotes 计算注数]
 * @return {[type]} [description]
 */
function dbsdwfc_calcNotes(){
	var notes = 0;

	if(dbsdwfc_playMethod == 0){
		notes = LotteryStorage["dbsdwfc"]["line1"].length *
			LotteryStorage["dbsdwfc"]["line2"].length *
			LotteryStorage["dbsdwfc"]["line3"].length *
			LotteryStorage["dbsdwfc"]["line4"].length *
			LotteryStorage["dbsdwfc"]["line5"].length;
	}else if(dbsdwfc_playMethod == 2){
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,5);
	}else if(dbsdwfc_playMethod == 3){
		if (LotteryStorage["dbsdwfc"]["line1"].length >= 1 && LotteryStorage["dbsdwfc"]["line2"].length >= 3) {
			notes = getArraySelect(3,LotteryStorage["dbsdwfc"]["line1"],LotteryStorage["dbsdwfc"]["line2"]);
		}else{
			notes = 0;
		}
	}else if(dbsdwfc_playMethod == 4){
		if (LotteryStorage["dbsdwfc"]["line1"].length >= 2 && LotteryStorage["dbsdwfc"]["line2"].length >= 1) {
			notes = getArraySelect(2,LotteryStorage["dbsdwfc"]["line2"],LotteryStorage["dbsdwfc"]["line1"]);
		}else{
			notes = 0;
		}
	}else if(dbsdwfc_playMethod == 5 || dbsdwfc_playMethod == 12){
		if (LotteryStorage["dbsdwfc"]["line1"].length >= 1 && LotteryStorage["dbsdwfc"]["line2"].length >= 2) {
			notes = getArraySelect(2,LotteryStorage["dbsdwfc"]["line1"],LotteryStorage["dbsdwfc"]["line2"]);
		}else{
			notes = 0;
		}
	}else if(dbsdwfc_playMethod == 6 || dbsdwfc_playMethod == 7 || dbsdwfc_playMethod == 14){
		if (LotteryStorage["dbsdwfc"]["line1"].length >= 1 && LotteryStorage["dbsdwfc"]["line2"].length >= 1) {
			notes = getArraySelect(1,LotteryStorage["dbsdwfc"]["line1"],LotteryStorage["dbsdwfc"]["line2"]);
		}else{
			notes = 0;
		}
	}else if(dbsdwfc_playMethod == 9){
		notes = LotteryStorage["dbsdwfc"]["line1"].length *
			LotteryStorage["dbsdwfc"]["line2"].length *
			LotteryStorage["dbsdwfc"]["line3"].length *
			LotteryStorage["dbsdwfc"]["line4"].length;
	}else if(dbsdwfc_playMethod == 18 || dbsdwfc_playMethod == 29 || dbsdwfc_playMethod == 40){
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			var temp = parseInt(LotteryStorage["dbsdwfc"]["line1"][i]);
			if(temp == 0){
				notes += 10;
			}else {
				notes += mathUtil.getCCombination(10 - temp,1) * 6 * temp;
			}
		}
	}else if(dbsdwfc_playMethod == 22 || dbsdwfc_playMethod == 33 || dbsdwfc_playMethod == 44 ){
		notes = 54;
	}else if(dbsdwfc_playMethod == 54 || dbsdwfc_playMethod == 61){
		notes = 9;
	}else if(dbsdwfc_playMethod == 51 || dbsdwfc_playMethod == 58){
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			var temp = parseInt(LotteryStorage["dbsdwfc"]["line1"][i]);
			if(temp == 0){
				notes += 10;
			}else {
				notes += mathUtil.getCCombination(10 - temp,1) * 2;
			}
		}
	}else if(dbsdwfc_playMethod == 11){
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,4);
	}else if(dbsdwfc_playMethod == 13|| dbsdwfc_playMethod == 64 || dbsdwfc_playMethod == 66 || dbsdwfc_playMethod == 68 || dbsdwfc_playMethod == 70 || dbsdwfc_playMethod == 72){
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,2);
	}else if(dbsdwfc_playMethod == 37 || dbsdwfc_playMethod == 26 || dbsdwfc_playMethod == 15 || dbsdwfc_playMethod == 75 || dbsdwfc_playMethod == 77){
		notes = LotteryStorage["dbsdwfc"]["line1"].length *
			LotteryStorage["dbsdwfc"]["line2"].length *
			LotteryStorage["dbsdwfc"]["line3"].length ;
	}else if(dbsdwfc_playMethod == 39 || dbsdwfc_playMethod == 28 || dbsdwfc_playMethod == 17){
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			notes += mathUtil.getZhiXuanHeZhiNote(LotteryStorage["dbsdwfc"]["line1"][i]);
		};
	}else if(dbsdwfc_playMethod == 41 || dbsdwfc_playMethod == 30 || dbsdwfc_playMethod == 19){
		notes = mathUtil.getACombination(LotteryStorage["dbsdwfc"]["line1"].length,2);
	}else if(dbsdwfc_playMethod == 42 || dbsdwfc_playMethod == 31 || dbsdwfc_playMethod == 20 || dbsdwfc_playMethod == 68 || dbsdwfc_playMethod == 73){
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,3);
	}else if(dbsdwfc_playMethod == 43 || dbsdwfc_playMethod == 32 || dbsdwfc_playMethod == 21){
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			notes += mathUtil.getSanXingZuXuanHeZhiNote(LotteryStorage["dbsdwfc"]["line1"][i]);
		};
	}else if(dbsdwfc_playMethod == 48 || dbsdwfc_playMethod == 55 || dbsdwfc_playMethod == 74 || dbsdwfc_playMethod == 76){
		notes = LotteryStorage["dbsdwfc"]["line1"].length *
			LotteryStorage["dbsdwfc"]["line2"].length ;
	}else if(dbsdwfc_playMethod == 50 || dbsdwfc_playMethod == 57){
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			notes += mathUtil.getErXingZhiXuanHeZhiNote(LotteryStorage["dbsdwfc"]["line1"][i]);
		};
	}else if(dbsdwfc_playMethod == 52 || dbsdwfc_playMethod == 59){
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,2);
	}else if(dbsdwfc_playMethod == 53 || dbsdwfc_playMethod == 60){
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			notes += mathUtil.getErXingZuXuanHeZhiNote(LotteryStorage["dbsdwfc"]["line1"][i]);
		};
	}else if(dbsdwfc_playMethod == 62){
		notes = LotteryStorage["dbsdwfc"]["line1"].length +
			LotteryStorage["dbsdwfc"]["line2"].length +
			LotteryStorage["dbsdwfc"]["line3"].length +
			LotteryStorage["dbsdwfc"]["line4"].length +
			LotteryStorage["dbsdwfc"]["line5"].length;
	}else if(dbsdwfc_playType == 13 || dbsdwfc_playType == 14 || dbsdwfc_playMethod == 8 || dbsdwfc_playMethod == 71
		|| dbsdwfc_playMethod == 24 || dbsdwfc_playMethod == 25 || dbsdwfc_playMethod == 35 || dbsdwfc_playMethod == 36 || dbsdwfc_playMethod == 46
		|| dbsdwfc_playMethod == 47 || dbsdwfc_playMethod == 63 || dbsdwfc_playMethod == 65 || dbsdwfc_playMethod == 67 || dbsdwfc_playMethod == 69 ){
		notes = LotteryStorage["dbsdwfc"]["line1"].length ;
	}else if(dbsdwfc_playMethod == 78){
		notes = LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line2"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line3"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line4"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line3"].length +
			LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line4"].length +
			LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line4"].length +
			LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line4"].length * LotteryStorage["dbsdwfc"]["line5"].length;
	}else if (dbsdwfc_playMethod == 80) {
		if ($("#dbsdwfc_tab .button.red").size() < 2) {
			notes = 0;
		}else{
			for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
				notes += mathUtil.getErXingZhiXuanHeZhiNote(LotteryStorage["dbsdwfc"]["line1"][i]);
			};
			notes *= mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,2);
		}
	}else if (dbsdwfc_playMethod == 81) {
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,2) * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,2);
	}else if (dbsdwfc_playMethod == 83) {
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			notes += mathUtil.getErXingZuXuanHeZhiNote(LotteryStorage["dbsdwfc"]["line1"][i]);
		};
		notes *= mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,2);
	}else if (dbsdwfc_playMethod == 84) {
		notes = LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line3"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line4"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line4"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line4"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line4"].length +
			LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line4"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line4"].length * LotteryStorage["dbsdwfc"]["line5"].length ;
	}else if (dbsdwfc_playMethod == 86) {
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			notes += mathUtil.getZhiXuanHeZhiNote(LotteryStorage["dbsdwfc"]["line1"][i]);
		};
		notes *= mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,3);
	}else if (dbsdwfc_playMethod == 87) {
		notes = mathUtil.getACombination(LotteryStorage["dbsdwfc"]["line1"].length,2) * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,3);
	}else if (dbsdwfc_playMethod == 89) {
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,3) * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,3);
	}else if (dbsdwfc_playMethod == 92) {
		for (var i = 0; i < LotteryStorage["dbsdwfc"]["line1"].length; i++) {
			notes += mathUtil.getSanXingZuXuanHeZhiNote(LotteryStorage["dbsdwfc"]["line1"][i]);
		};
		notes *= mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,3);
	}else if (dbsdwfc_playMethod == 93) {
		notes = LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line4"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line4"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line1"].length * LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line4"].length * LotteryStorage["dbsdwfc"]["line5"].length +
			LotteryStorage["dbsdwfc"]["line2"].length * LotteryStorage["dbsdwfc"]["line3"].length * LotteryStorage["dbsdwfc"]["line4"].length * LotteryStorage["dbsdwfc"]["line5"].length;
	}else if (dbsdwfc_playMethod == 95) {
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,4)
			* mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,4);
	}else if (dbsdwfc_playMethod == 96) {
		if (LotteryStorage["dbsdwfc"]["line1"].length >= 1 && LotteryStorage["dbsdwfc"]["line2"].length >= 2) {
			notes = getArraySelect(2,LotteryStorage["dbsdwfc"]["line1"],LotteryStorage["dbsdwfc"]["line2"])
				* mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,4);
		}else{
			notes = 0;
		}
	}else if (dbsdwfc_playMethod == 97) {
		notes = mathUtil.getCCombination(LotteryStorage["dbsdwfc"]["line1"].length,2) * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,4);
	}else if (dbsdwfc_playMethod == 98) {
		if (LotteryStorage["dbsdwfc"]["line1"].length >= 1 && LotteryStorage["dbsdwfc"]["line2"].length >= 1) {
			notes = getArraySelect(1,LotteryStorage["dbsdwfc"]["line1"],LotteryStorage["dbsdwfc"]["line2"]) * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,4);
		}else{
			notes = 0;
		}
	}else{
		notes = dbsdwfcValidData($("#dbsdwfc_single").val());
	}

	if(dbsdwfc_sntuo == 3 || dbsdwfc_sntuo == 1 || getplayid(LotteryInfo.getId("ssc","dbsdwfc"),LotteryInfo.getMethodId("ssc",dbsdwfc_playMethod))){
	}else{
		if(parseInt($('#dbsdwfc_modeId').val()) == 8){
			$("#dbsdwfc_random").hide();
		}else{
			$("#dbsdwfc_random").show();
		}
	}

	//验证是否为空
	if( $("#dbsdwfc_beiNum").val() =="" || parseInt($("#dbsdwfc_beiNum").val()) == 0){
		$("#dbsdwfc_beiNum").val(1);
	}

	//验证慢彩最大倍数为9999
	if($("#dbsdwfc_beiNum").val() > 9999){
		$("#dbsdwfc_beiNum").val(9999);
	}

	if(notes > 0) {
		$('#dbsdwfc_zhushu').text(notes);
		if($("#dbsdwfc_modeId").val() == "8"){
			$('#dbsdwfc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbsdwfc_beiNum").val()),0.002));
		}else if ($("#dbsdwfc_modeId").val() == "2"){
			$('#dbsdwfc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbsdwfc_beiNum").val()),0.2));
		}else if ($("#dbsdwfc_modeId").val() == "1"){
			$('#dbsdwfc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbsdwfc_beiNum").val()),0.02));
		}else{
			$('#dbsdwfc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbsdwfc_beiNum").val()),2));
		}
	} else {
		$('#dbsdwfc_zhushu').text(0);
		$('#dbsdwfc_money').text(0);
	}
	dbsdwfc_initFooterButton();
	// 计算奖金盈利
	calcAwardWin('dbsdwfc',dbsdwfc_playMethod);
}

/**
 * [dbsdwfc_submitData 确认提交数据]
 * @return {[type]} [description]
 */
function dbsdwfc_submitData(){
	var submitParams = new LotterySubmitParams();
	$("#dbsdwfc_queding").bind('click', function(event) {
		dbsdwfc_rebate = $("#dbsdwfc_fandian option:last").val();
		if(parseInt($('#dbsdwfc_zhushu').html()) <= 0){
			toastUtils.showToast('请至少选择一注');
			return;
		}
		dbsdwfc_calcNotes();

		if(parseInt($('#dbsdwfc_modeId').val()) == 8){
			if (Number($('#dbsdwfc_money').html()) < 0.02){
				toastUtils.showToast('请至少选择0.02元');
				return;
			}
		}
		//提示单挑奖金
		getDanTiaoBonus('dbsdwfc',dbsdwfc_playMethod);

		submitParams.lotteryType = "dbsdwfc";
		var play = LotteryInfo.getPlayName("ssc",dbsdwfc_playType);
		var playMethod = LotteryInfo.getMethodName("ssc",dbsdwfc_playMethod);
		submitParams.playType = play;
		submitParams.playMethod = playMethod;
		submitParams.playTypeIndex = dbsdwfc_playType;
		submitParams.playMethodIndex = dbsdwfc_playMethod;
		var selectedBalls = [];
		if(dbsdwfc_playMethod == 0 || dbsdwfc_playMethod == 3 || dbsdwfc_playMethod == 4
			|| dbsdwfc_playMethod == 5 || dbsdwfc_playMethod == 6 || dbsdwfc_playMethod == 7
			|| dbsdwfc_playMethod == 9 || dbsdwfc_playMethod == 12 || dbsdwfc_playMethod == 14
			|| dbsdwfc_playMethod == 37 || dbsdwfc_playMethod == 26 || dbsdwfc_playMethod == 15
			|| dbsdwfc_playMethod == 48 || dbsdwfc_playMethod == 55 || dbsdwfc_playMethod == 74 || dbsdwfc_playType == 9){
			$("#dbsdwfc_ballView div.ballView").each(function(){
				var arr = [];
				$(this).find("span.redBalls_active").each(function(){
					arr.push($(this).text());
				});
				selectedBalls.push(arr.join(","));
			});
			submitParams.nums = selectedBalls.join("|");
		}else if(dbsdwfc_playMethod == 2 || dbsdwfc_playMethod == 8 || dbsdwfc_playMethod == 11 || dbsdwfc_playMethod == 13 || dbsdwfc_playMethod == 24
			|| dbsdwfc_playMethod == 39 || dbsdwfc_playMethod == 28 || dbsdwfc_playMethod == 17 || dbsdwfc_playMethod == 18 || dbsdwfc_playMethod == 25
			|| dbsdwfc_playMethod == 22 || dbsdwfc_playMethod == 33 || dbsdwfc_playMethod == 44 || dbsdwfc_playMethod == 54 || dbsdwfc_playMethod == 61
			|| dbsdwfc_playMethod == 41 || dbsdwfc_playMethod == 42 || dbsdwfc_playMethod == 43 || dbsdwfc_playMethod == 29 || dbsdwfc_playMethod == 35
			|| dbsdwfc_playMethod == 30 || dbsdwfc_playMethod == 31 || dbsdwfc_playMethod == 32 || dbsdwfc_playMethod == 40 || dbsdwfc_playMethod == 36
			|| dbsdwfc_playMethod == 19 || dbsdwfc_playMethod == 20 || dbsdwfc_playMethod == 21 || dbsdwfc_playMethod == 46 || dbsdwfc_playMethod == 47
			|| dbsdwfc_playMethod == 50 || dbsdwfc_playMethod == 57 || dbsdwfc_playType == 8 || dbsdwfc_playMethod == 51 || dbsdwfc_playMethod == 58
			|| dbsdwfc_playMethod == 52 || dbsdwfc_playMethod == 53|| dbsdwfc_playMethod == 59 || dbsdwfc_playMethod == 60 || dbsdwfc_playType == 13 || dbsdwfc_playType == 14){
			$("#dbsdwfc_ballView div.ballView").each(function(){
				$(this).find("span.redBalls_active").each(function(){
					selectedBalls.push($(this).text());
				});
			});
			submitParams.nums = selectedBalls.join(",");
		}else if(dbsdwfc_playType == 7 || dbsdwfc_playMethod == 78 || dbsdwfc_playMethod == 84 || dbsdwfc_playMethod == 93){
			$("#dbsdwfc_ballView div.ballView").each(function(){
				var arr = [];
				$(this).find("span.redBalls_active").each(function(){
					arr.push($(this).text());
				});
				if (arr.length == 0) {
					selectedBalls.push("*");
				}else{
					selectedBalls.push(arr.join(","));
				}
			});
			submitParams.nums = selectedBalls.join("|");
		}else if(dbsdwfc_playMethod == 80 || dbsdwfc_playMethod == 81 || dbsdwfc_playMethod == 83
			|| dbsdwfc_playMethod == 86 || dbsdwfc_playMethod == 87 || dbsdwfc_playMethod == 89
			|| dbsdwfc_playMethod == 92 || dbsdwfc_playMethod == 95 || dbsdwfc_playMethod == 97){
			$("#dbsdwfc_ballView div.ballView").each(function(){
				$(this).find("span.redBalls_active").each(function(){
					selectedBalls.push($(this).text());
				});
			});
			var temp = selectedBalls.join(",") + "#";

			if ($("#dbsdwfc_tab1").hasClass("button red")) {
				temp += "万";
			};
			if ($("#dbsdwfc_tab2").hasClass("button red")) {
				temp += "千";
			};
			if ($("#dbsdwfc_tab3").hasClass("button red")) {
				temp += "百";
			};
			if ($("#dbsdwfc_tab4").hasClass("button red")) {
				temp += "十";
			};
			if ($("#dbsdwfc_tab5").hasClass("button red")) {
				temp += "个";
			};

			submitParams.nums = temp;
		}else if (dbsdwfc_playMethod == 96 || dbsdwfc_playMethod == 98) {
			$("#dbsdwfc_ballView div.ballView").each(function(){
				var arr = [];
				$(this).find("span.redBalls_active").each(function(){
					arr.push($(this).text());
				});
				selectedBalls.push(arr.join(","));
			});
			var temp = selectedBalls.join("|") + "#";
			if ($("#dbsdwfc_tab1").hasClass("button red")) {
				temp += "万";
			};
			if ($("#dbsdwfc_tab2").hasClass("button red")) {
				temp += "千";
			};
			if ($("#dbsdwfc_tab3").hasClass("button red")) {
				temp += "百";
			};
			if ($("#dbsdwfc_tab4").hasClass("button red")) {
				temp += "十";
			};
			if ($("#dbsdwfc_tab5").hasClass("button red")) {
				temp += "个";
			};
			submitParams.nums = temp;
		}else{
			var array = handleSingleStr($("#dbsdwfc_single").val());
			if(dbsdwfc_playMethod == 1 ){
				submitParams.nums = array.join(" ");
			}else if(dbsdwfc_playMethod == 10 || dbsdwfc_playMethod == 38 || dbsdwfc_playMethod == 27
				|| dbsdwfc_playMethod == 16 || dbsdwfc_playMethod == 49 || dbsdwfc_playMethod == 56){
				var temp = "";
				for(var i = 0;i < array.length;i++){
					if(i == array.length - 1){
						temp = temp + array[i].split("").join("|");
					}else{
						temp = temp + array[i].split("").join("|") + " ";
					}
				}
				submitParams.nums = temp;
			}else if(dbsdwfc_playMethod == 45 || dbsdwfc_playMethod == 34 || dbsdwfc_playMethod == 23){
				var temp = "";
				for(var i = 0;i < array.length;i++){
					if(i == array.length - 1){
						temp = temp + array[i].split("").join(",");
					}else{
						temp = temp + array[i].split("").join(",") + " ";
					}
				}
				submitParams.nums = temp;
			}else if(dbsdwfc_playMethod == 79 || dbsdwfc_playMethod == 82 || dbsdwfc_playMethod == 85 || dbsdwfc_playMethod == 88 ||
				dbsdwfc_playMethod == 89 || dbsdwfc_playMethod == 90 || dbsdwfc_playMethod == 91 || dbsdwfc_playMethod == 94){
				var temp = "";
				for(var i = 0;i < array.length;i++){
					if(i == array.length - 1){
						temp = temp + array[i].split("").join(",");
					}else{
						temp = temp + array[i].split("").join(",") + " ";
					}
				}
				temp +="#";
				if ($("#dbsdwfc_tab1").hasClass("button red")) {
					temp += "万";
				};
				if ($("#dbsdwfc_tab2").hasClass("button red")) {
					temp += "千";
				};
				if ($("#dbsdwfc_tab3").hasClass("button red")) {
					temp += "百";
				};
				if ($("#dbsdwfc_tab4").hasClass("button red")) {
					temp += "十";
				};
				if ($("#dbsdwfc_tab5").hasClass("button red")) {
					temp += "个";
				};

				submitParams.nums = temp;
			}
		}
		localStorageUtils.setParam("playMode",$("#dbsdwfc_modeId").val());
		localStorageUtils.setParam("playBeiNum",$("#dbsdwfc_beiNum").val());
		localStorageUtils.setParam("playFanDian",$("#dbsdwfc_fandian").val());
		submitParams.notes = $('#dbsdwfc_zhushu').html();
		submitParams.sntuo = dbsdwfc_sntuo;
		submitParams.multiple = $('#dbsdwfc_beiNum').val();  //requirement
		submitParams.rebates = $('#dbsdwfc_fandian').val();  //requirement
		submitParams.playMode = $('#dbsdwfc_modeId').val();  //requirement
		submitParams.money = $('#dbsdwfc_money').html();  //requirement
		submitParams.award = $('#dbsdwfc_minAward').html();  //奖金
		submitParams.maxAward = $('#dbsdwfc_maxAward').html();  //多级奖金
		submitParams.submit();
		$("#dbsdwfc_ballView").empty();
		dbsdwfc_qingkongAll();
	});
}

/**
 * [dbsdwfc_randomOne 随机一注]
 * @return {[type]} [description]
 */
function dbsdwfc_randomOne(){
	dbsdwfc_qingkongAll();
	if(dbsdwfc_playMethod == 0){
		var redBallArray = mathUtil.getNums(5,10);
		LotteryStorage["dbsdwfc"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["dbsdwfc"]["line2"].push(redBallArray[1]+"");
		LotteryStorage["dbsdwfc"]["line3"].push(redBallArray[2]+"");
		LotteryStorage["dbsdwfc"]["line4"].push(redBallArray[3]+"");
		LotteryStorage["dbsdwfc"]["line5"].push(redBallArray[4]+"");

		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line2"], function(k, v){
			$("#" + "dbsdwfc_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line3"], function(k, v){
			$("#" + "dbsdwfc_line3" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line4"], function(k, v){
			$("#" + "dbsdwfc_line4" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line5"], function(k, v){
			$("#" + "dbsdwfc_line5" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 8){
		var number = mathUtil.getRandomNum(0,4);
		LotteryStorage["dbsdwfc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 9){
		var redBallArray = mathUtil.getNums(4,10);
		LotteryStorage["dbsdwfc"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["dbsdwfc"]["line2"].push(redBallArray[1]+"");
		LotteryStorage["dbsdwfc"]["line3"].push(redBallArray[2]+"");
		LotteryStorage["dbsdwfc"]["line4"].push(redBallArray[3]+"");

		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line2"], function(k, v){
			$("#" + "dbsdwfc_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line3"], function(k, v){
			$("#" + "dbsdwfc_line3" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line4"], function(k, v){
			$("#" + "dbsdwfc_line4" + v).toggleClass("redBalls_active");
		});

	}else if(dbsdwfc_playMethod == 37 || dbsdwfc_playMethod == 26 || dbsdwfc_playMethod == 15){
		var redBallArray = mathUtil.getNums(3,10);
		LotteryStorage["dbsdwfc"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["dbsdwfc"]["line2"].push(redBallArray[1]+"");
		LotteryStorage["dbsdwfc"]["line3"].push(redBallArray[2]+"");

		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line2"], function(k, v){
			$("#" + "dbsdwfc_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line3"], function(k, v){
			$("#" + "dbsdwfc_line3" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 41 || dbsdwfc_playMethod == 30 || dbsdwfc_playMethod == 19 || dbsdwfc_playMethod == 68
		|| dbsdwfc_playMethod == 52 || dbsdwfc_playMethod == 64 || dbsdwfc_playMethod == 66
		|| dbsdwfc_playMethod == 59 || dbsdwfc_playMethod == 70 || dbsdwfc_playMethod == 72){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,redBallArray);
		$.each(array,function (k,v) {
			LotteryStorage["dbsdwfc"]["line1"].push(v+"");
		});
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 42 || dbsdwfc_playMethod == 31 || dbsdwfc_playMethod == 20 || dbsdwfc_playMethod == 73){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(3,redBallArray);
		$.each(array,function (k,v) {
			LotteryStorage["dbsdwfc"]["line1"].push(v+"");
		});
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 39 || dbsdwfc_playMethod == 28 || dbsdwfc_playMethod == 17){
		var number = mathUtil.getRandomNum(0,28);
		LotteryStorage["dbsdwfc"]["line1"].push(number+'');
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 43 || dbsdwfc_playMethod == 32 || dbsdwfc_playMethod == 21){
		var number = mathUtil.getRandomNum(1,27);
		LotteryStorage["dbsdwfc"]["line1"].push(number+'');
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 48 || dbsdwfc_playMethod == 55){
		var redBallArray = mathUtil.getNums(2,10);
		LotteryStorage["dbsdwfc"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["dbsdwfc"]["line2"].push(redBallArray[1]+"");

		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line2"], function(k, v){
			$("#" + "dbsdwfc_line2" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 25 || dbsdwfc_playMethod == 36 || dbsdwfc_playMethod == 47){
		var number = mathUtil.getRandomNum(0,5);
		LotteryStorage["dbsdwfc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 50 || dbsdwfc_playMethod == 57){
		var number = mathUtil.getRandomNum(0,19);
		LotteryStorage["dbsdwfc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 53 || dbsdwfc_playMethod == 60){
		var number = mathUtil.getRandomNum(1,18);
		LotteryStorage["dbsdwfc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 62){
		var line = mathUtil.getRandomNum(1,6);
		var number = mathUtil.getRandomNum(0,10);
		LotteryStorage["dbsdwfc"]["line"+line].push(number+"");
		$.each(LotteryStorage["dbsdwfc"]["line"+line], function(k, v){
			$("#" + "dbsdwfc_line" + line + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 63 || dbsdwfc_playMethod == 67 || dbsdwfc_playMethod == 69 || dbsdwfc_playMethod == 71 || dbsdwfc_playType == 13
		|| dbsdwfc_playMethod == 65 || dbsdwfc_playMethod == 18 || dbsdwfc_playMethod == 29 || dbsdwfc_playMethod == 40 || dbsdwfc_playMethod == 22
		|| dbsdwfc_playMethod == 33 || dbsdwfc_playMethod == 44 || dbsdwfc_playMethod == 54 || dbsdwfc_playMethod == 61
		|| dbsdwfc_playMethod == 24 || dbsdwfc_playMethod == 35 || dbsdwfc_playMethod == 46 || dbsdwfc_playMethod == 51 || dbsdwfc_playMethod == 58){
		var number = mathUtil.getRandomNum(0,10);
		LotteryStorage["dbsdwfc"]["line1"].push(number+'');
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 74 || dbsdwfc_playMethod == 76){
		var array = mathUtil.getNums(2,4);
		LotteryStorage["dbsdwfc"]["line1"].push(array[0]+"");
		LotteryStorage["dbsdwfc"]["line2"].push(array[1]+"");
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line2"], function(k, v){
			$("#" + "dbsdwfc_line2" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 75 || dbsdwfc_playMethod == 77){
		var array = mathUtil.getNums(3,4);
		LotteryStorage["dbsdwfc"]["line1"].push(array[0]+"");
		LotteryStorage["dbsdwfc"]["line2"].push(array[1]+"");
		LotteryStorage["dbsdwfc"]["line3"].push(array[2]+"");
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line2"], function(k, v){
			$("#" + "dbsdwfc_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line3"], function(k, v){
			$("#" + "dbsdwfc_line3" + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 78){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(2,lineArray);
		var array = mathUtil.getNums(2,10);
		LotteryStorage["dbsdwfc"]["line"+lines[0]].push(array[0]+"");
		LotteryStorage["dbsdwfc"]["line"+lines[1]].push(array[1]+"");
		$.each(LotteryStorage["dbsdwfc"]["line"+lines[0]], function(k, v){
			$("#" + "dbsdwfc_line" + lines[0] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line"+lines[1]], function(k, v){
			$("#" + "dbsdwfc_line"+ lines[1] + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 84){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(3,lineArray);
		var array = mathUtil.getNums(3,10);
		LotteryStorage["dbsdwfc"]["line"+lines[0]].push(array[0]+"");
		LotteryStorage["dbsdwfc"]["line"+lines[1]].push(array[1]+"");
		LotteryStorage["dbsdwfc"]["line"+lines[2]].push(array[2]+"");

		$.each(LotteryStorage["dbsdwfc"]["line"+lines[0]], function(k, v){
			$("#" + "dbsdwfc_line"+ lines[0] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line"+lines[1]], function(k, v){
			$("#" + "dbsdwfc_line"+ lines[1] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line"+lines[0]], function(k, v){
			$("#" + "dbsdwfc_line"+ lines[2] + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playMethod == 93){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(4,lineArray);
		var array = mathUtil.getNums(4,10);
		LotteryStorage["dbsdwfc"]["line"+lines[0]].push(array[0]+"");
		LotteryStorage["dbsdwfc"]["line"+lines[1]].push(array[1]+"");
		LotteryStorage["dbsdwfc"]["line"+lines[2]].push(array[2]+"");
		LotteryStorage["dbsdwfc"]["line"+lines[3]].push(array[3]+"");

		$.each(LotteryStorage["dbsdwfc"]["line"+lines[0]], function(k, v){
			$("#" + "dbsdwfc_line"+ lines[0] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line"+lines[1]], function(k, v){
			$("#" + "dbsdwfc_line"+ lines[1] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line"+lines[2]], function(k, v){
			$("#" + "dbsdwfc_line"+ lines[2] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbsdwfc"]["line"+lines[3]], function(k, v){
			$("#" + "dbsdwfc_line"+ lines[3] + v).toggleClass("redBalls_active");
		});
	}else if(dbsdwfc_playType == 14){
		var number = mathUtil.getRandomNum(0,2);
		LotteryStorage["dbsdwfc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbsdwfc"]["line1"], function(k, v){
			$("#" + "dbsdwfc_line1" + v).toggleClass("redBalls_active");
		});
	}
	dbsdwfc_calcNotes();
}

/**
 * 出票机选
 * @param playMethod
 */
function dbsdwfc_checkOutRandom(playMethod){
	var obj = new Object();
	if(dbsdwfc_playMethod == 0){
		var redBallArray = mathUtil.getNums(5,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 8){
		var number = mathUtil.getRandomNum(0,4);
		var array = ["大","小","单","双"];
		obj.nums = array[number];
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 18 || dbsdwfc_playMethod == 29 || dbsdwfc_playMethod == 40){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		if(number == 0){
			obj.notes = 10;
		}else {
			obj.notes = mathUtil.getCCombination(10 - number,1) * 6 * number;
		}
	}else if(dbsdwfc_playMethod == 22 || dbsdwfc_playMethod == 33 || dbsdwfc_playMethod == 44){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		obj.notes = 54;
	}else if(dbsdwfc_playMethod == 54 || dbsdwfc_playMethod == 61){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		obj.notes = 9;
	}
	else if(dbsdwfc_playMethod == 9){
		var redBallArray = mathUtil.getNums(4,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 37 || dbsdwfc_playMethod == 26 || dbsdwfc_playMethod == 15){
		var redBallArray = mathUtil.getNums(3,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 39 || dbsdwfc_playMethod == 28 || dbsdwfc_playMethod == 17){
		var number = mathUtil.getRandomNum(0,28);
		obj.nums = number;
		obj.notes = mathUtil.getZhiXuanHeZhiNote(number);
	}else if(dbsdwfc_playMethod == 41 || dbsdwfc_playMethod == 30 || dbsdwfc_playMethod == 19){
		var lineArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,lineArray);
		obj.nums = array.join(",");
		obj.notes = 2;
	}else if(dbsdwfc_playMethod == 52 || dbsdwfc_playMethod == 59 || dbsdwfc_playMethod == 64 || dbsdwfc_playMethod == 66 || dbsdwfc_playMethod == 68
		||dbsdwfc_playMethod == 70 || dbsdwfc_playMethod == 72){
		var lineArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,lineArray);
		obj.nums = array.join(",");
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 42 || dbsdwfc_playMethod == 31 || dbsdwfc_playMethod == 20 || dbsdwfc_playMethod == 73){
		var lineArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(3,lineArray);
		obj.nums = array.join(",");
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 43 || dbsdwfc_playMethod == 32 || dbsdwfc_playMethod == 21){
		var number = mathUtil.getRandomNum(1,27);
		obj.nums = number;
		obj.notes = mathUtil.getSanXingZuXuanHeZhiNote(number);
	}else if(dbsdwfc_playMethod == 48 || dbsdwfc_playMethod == 55){
		var redBallArray = mathUtil.getNums(2,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 50 || dbsdwfc_playMethod == 57){
		var number = mathUtil.getRandomNum(0,19);
		obj.nums = number;
		obj.notes = mathUtil.getErXingZhiXuanHeZhiNote(number);
	}else if(dbsdwfc_playMethod == 53 || dbsdwfc_playMethod == 60){
		var number = mathUtil.getRandomNum(1,18);
		obj.nums = number;
		obj.notes = mathUtil.getErXingZuXuanHeZhiNote(number);
	}else if(dbsdwfc_playMethod == 62){
		var line = mathUtil.getRandomNum(1,6);
		var number = mathUtil.getRandomNum(0,10);
		if(line == 1){
			obj.nums = number + "|*|*|*|*";
		}else if(line == 2){
			obj.nums = "*|"+ number +"|*|*|*";
		}else if(line == 3){
			obj.nums = "*|*|"+number +"|*|*";
		}else if(line == 4){
			obj.nums = "*|*|*|"+ number +"|*";
		}else if(line == 5){
			obj.nums = "*|*|*|*|" + number;
		}
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 63 || dbsdwfc_playMethod == 65 || dbsdwfc_playMethod == 67 || dbsdwfc_playMethod == 69 || dbsdwfc_playMethod == 71
		|| dbsdwfc_playMethod == 24 || dbsdwfc_playMethod == 35 || dbsdwfc_playMethod == 46){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 25 || dbsdwfc_playMethod == 36 || dbsdwfc_playMethod == 47){
		var number = mathUtil.getRandomNum(0,5);
		var array = ["豹子","顺子","对子","半顺","杂六"];
		obj.nums = array[number];
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 51 || dbsdwfc_playMethod == 58){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		if(number == 0){
			obj.notes = 10;
		}else {
			obj.notes = mathUtil.getCCombination(10 - number,1) * 2;
		}
	}else if(dbsdwfc_playMethod == 74 || dbsdwfc_playMethod == 76){
		var array = mathUtil.getNums(2,4);
		var temp = [];
		for(var i = 0; i < array.length;i++){
			if(array[i] == 0){
				temp.push("大");
			}else if(array[i] == 1){
				temp.push("小");
			}else if(array[i] == 2){
				temp.push("单");
			}else if(array[i] == 3){
				temp.push("双");
			}
		}
		obj.nums = temp.join("|");
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 75 || dbsdwfc_playMethod == 77){
		var array = mathUtil.getNums(3,4);
		var temp = [];
		for(var i = 0; i < array.length;i++){
			if(array[i] == 0){
				temp.push("大");
			}else if(array[i] == 1){
				temp.push("小");
			}else if(array[i] == 2){
				temp.push("单");
			}else if(array[i] == 3){
				temp.push("双");
			}
		}
		obj.nums = temp.join("|");
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 78){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(2,lineArray);
		var array = mathUtil.getNums(2,10);

		if(isContained([1,2],lines)){
			obj.nums = array[0]+"|"+array[1]+"|*|*|*";
		}else if(isContained([1,3],lines)){
			obj.nums = array[0]+"|*|"+array[1]+"|*|*";
		}else if(isContained([1,4],lines)){
			obj.nums = array[0]+"|*|*|"+array[1]+"|*";
		}else if(isContained([1,5],lines)){
			obj.nums = array[0]+"|*|*|*|"+array[1];
		}else if(isContained([2,3],lines)){
			obj.nums = "*|"+array[0]+"|"+array[1]+"|*|*";
		}else if(isContained([2,4],lines)){
			obj.nums = "*|"+array[0]+"|*|"+array[1]+"|*";
		}else if(isContained([2,5],lines)){
			obj.nums = "*|"+array[0]+"|*|*|"+array[1];
		}else if(isContained([3,4],lines)){
			obj.nums = "*|*|"+array[0]+"|"+array[1]+"|*";
		}else if(isContained([3,5],lines)){
			obj.nums = "*|*|"+array[0]+"|*|"+array[1];
		}else if(isContained([4,5],lines)){
			obj.nums = "*|*|*|"+array[0]+"|"+array[1];
		}
		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 84){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(3,lineArray);
		var array = mathUtil.getNums(3,10);
		if(isContained([1,2,3],lines)){
			obj.nums = array[0]+"|"+array[1]+"|"+array[2]+"|*|*";
		}else if(isContained([1,2,4],lines)){
			obj.nums = array[0]+"|"+array[1]+"|*|"+array[2]+"|*";
		}else if(isContained([1,2,5],lines)){
			obj.nums = array[0]+"|"+array[1]+"|*|*|"+array[2];
		}else if(isContained([1,3,4],lines)){
			obj.nums = array[0]+"|*|"+array[1]+"|"+array[2]+"|*";
		}else if(isContained([1,3,5],lines)){
			obj.nums = array[0]+"|*|"+array[1]+"|*|"+array[2];
		}else if(isContained([1,4,5],lines)){
			obj.nums = array[0]+"|*|*|"+array[1]+"|"+array[2];
		}else if(isContained([2,3,4],lines)){
			obj.nums = "*|"+array[0]+"|"+array[1]+"|"+array[2]+"|*";
		}else if(isContained([2,3,5],lines)){
			obj.nums = "*|"+array[0]+"|"+array[1]+"|*|"+array[2];
		}else if(isContained([2,4,5],lines)){
			obj.nums = "*|"+array[0]+"|*|"+array[1]+"|"+array[2];
		}else if(isContained([3,4,5],lines)){
			obj.nums = "*|*|"+array[0]+"|"+array[1]+"|"+array[2];
		}

		obj.notes = 1;
	}else if(dbsdwfc_playMethod == 93){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(4,lineArray);
		var array = mathUtil.getNums(4,10);
		if(isContained([1,2,3,4],lines)){
			obj.nums = array[0]+"|"+array[1]+"|"+array[2]+"|"+array[3]+"|*";
		}else if(isContained([1,2,3,5],lines)){
			obj.nums = array[0]+"|"+array[1]+"|"+array[2]+"|*|"+array[3];
		}else if(isContained([1,2,4,5],lines)){
			obj.nums = array[0]+"|"+array[1]+"|*|"+array[2]+"|"+array[3];
		}else if(isContained([1,3,4,5],lines)){
			obj.nums = array[0]+"|*|"+array[1]+"|"+array[2]+"|"+array[3];
		}else if(isContained([2,3,4,5],lines)){
			obj.nums = "*|"+array[0]+"|"+array[1]+"|"+array[2]+"|"+array[3];
		}
		obj.notes = 1;
	}
	obj.sntuo = dbsdwfc_sntuo;
	obj.multiple = 1;
	obj.rebates = dbsdwfc_rebate;
	obj.playMode = "4";
	obj.money = bigNumberUtil.multiply(obj.notes,2).toString();
	calcAwardWin('dbsdwfc',dbsdwfc_playMethod,obj);  //机选奖金计算
	obj.award = $('#dbsdwfc_minAward').html();     //奖金
	obj.maxAward = $('#dbsdwfc_maxAward').html();  //多级奖金
	return obj;
}

/**
 * [dbsdwfcValidateData 单式数据验证]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function dbsdwfcValidateData(data){
	dbsdwfcValidData(data.value);
}

function dbsdwfcValidData(str){
	var notes = 0;
	var array;
	if(dbsdwfc_playMethod == 1){
		array = handleSingleStrNew({
			str:str,
			weishu:5
		});
		notes = array.length;
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 10){
		array = handleSingleStrNew({
			str:str,
			weishu:4
		});
		notes = array.length;
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 38 || dbsdwfc_playMethod == 27 || dbsdwfc_playMethod == 16){
		array = handleSingleStrNew({
			str:str,
			weishu:3
		});
		notes = array.length;
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 45 || dbsdwfc_playMethod == 34 || dbsdwfc_playMethod == 23){
		// baozi : 是否要过滤豹子号
		array = handleSingleStrNew({
			str:str,
			weishu:3,
			baozi:true
		});
		notes = array.length;
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 49 || dbsdwfc_playMethod == 56){
		array = handleSingleStrNew({
			str:str,
			weishu:2
		});
		notes = array.length;
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 79){
		array = handleSingleStrNew({
			str:str,
			weishu:2
		});
		notes = array.length * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,2);
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 82){
		array = handleSingleStrNew({
			str:str,
			weishu:2,
			duizi:true
		});
		notes = array.length * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,2);
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 85){
		array = handleSingleStrNew({
			str:str,
			weishu:3
		});
		notes = array.length * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,3);
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 88){
		array = handleSingleStrNew({
			str:str,
			weishu:3,
			zusan:true
		});
		notes = array.length * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,3);
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 90){
		array = handleSingleStrNew({
			str:str,
			weishu:3,
			zuliu:true
		});
		notes = array.length * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,3);
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 91){
		array = handleSingleStrNew({
			str:str,
			weishu:3,
			baozi:true
		});
		notes = array.length * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,3);
		dbsdwfcShowFooter(true,notes);
	}else if(dbsdwfc_playMethod == 94){
		array = handleSingleStrNew({
			str:str,
			weishu:4
		});
		notes = array.length * mathUtil.getCCombination($("#dbsdwfc_tab .button.red").size() ,4);
		dbsdwfcShowFooter(true,notes);
	}
	$("#dbsdwfc_single").val(array.join(" "));
	return notes;
}

function dbsdwfcShowFooter(isValid,notes){
	$('#dbsdwfc_zhushu').text(notes);
	if($("#dbsdwfc_modeId").val() == "8"){
		$('#dbsdwfc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbsdwfc_beiNum").val()),0.002));
	}else if ($("#dbsdwfc_modeId").val() == "2"){
		$('#dbsdwfc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbsdwfc_beiNum").val()),0.2));
	}else if ($("#dbsdwfc_modeId").val() == "1"){
		$('#dbsdwfc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbsdwfc_beiNum").val()),0.02));
	}else{
		$('#dbsdwfc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbsdwfc_beiNum").val()),2));
	}
	if(!isValid){
		toastUtils.showToast('格式不正确');
	}
	dbsdwfc_initFooterButton();
	calcAwardWin('dbsdwfc',dbsdwfc_playMethod);  //计算奖金和盈利
}