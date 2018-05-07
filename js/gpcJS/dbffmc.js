var dbffmc_playType = 2;
var dbffmc_playMethod = 15;
var dbffmc_sntuo = 0;
var dbffmc_rebate;
var dbffmcScroll;

//进入这个页面时调用
function dbffmcPageLoadedPanel() {
	catchErrorFun("dbffmc_init();");
}

//离开这个页面时调用
function dbffmcPageUnloadedPanel(){
	$("#dbffmc_queding").off('click');
	$("#dbffmcPage_back").off('click');
	$("#dbffmc_ballView").empty();
	$("#dbffmcSelect").empty();
	var $select = $('<select class="cs-select cs-skin-overlay" id="dbffmcPlaySelect"></select>');
	$("#dbffmcSelect").append($select);
}

//入口函数
function dbffmc_init(){
	$("#dbffmc_title").html(LotteryInfo.getLotteryNameByTag("dbffmc"));
	for(var i = 0; i< LotteryInfo.getPlayLength("ssc");i++){
		if(i == 15){//去掉骰宝龙虎
			continue;
		}
		var $play = $('<optgroup label="'+LotteryInfo.getPlayName("ssc",i)+'"></optgroup>');
		for(var j = 0; j < LotteryInfo.getMethodLength("ssc");j++){
			if(LotteryInfo.getMethodTypeId("ssc",j) == LotteryInfo.getPlayTypeId("ssc",i)){
				var name = LotteryInfo.getMethodName("ssc",j);
				if(i == dbffmc_playType && j == dbffmc_playMethod){
					$play.append('<option value="dbffmc'+LotteryInfo.getMethodIndex("ssc",j)+'" selected="selected">' + name +'</option>');
				}else{
					$play.append('<option value="dbffmc'+LotteryInfo.getMethodIndex("ssc",j)+'">' + name +'</option>');
				}
			}
		}
		$("#dbffmcPlaySelect").append($play);
	}

	[].slice.call( document.getElementById("dbffmcSelect").querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el, {
			stickyPlaceholder: true,
			onChange:dbffmcChangeItem
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

	GetLotteryInfo("dbffmc",function (){
		dbffmcChangeItem("dbffmc"+dbffmc_playMethod);
	});

	//添加滑动条
	if(!dbffmcScroll){
		dbffmcScroll = new IScroll('#dbffmcContent',{
			click:true,
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
	}

	//获取期号
	getQihao("dbffmc",LotteryInfo.getLotteryIdByTag("dbffmc"));

	//获取上一期开奖
	queryLastPrize("dbffmc");

	//获取单挑和单期最高奖金
	getLotteryMaxBonus('dbffmc');

	//机选选号
	$("#dbffmc_random").on('click', function(event) {
		dbffmc_randomOne();
	});

	//返回
	$("#dbffmcPage_back").on('click', function(event) {
		// dbffmc_playType = 2;
		// dbffmc_playMethod = 15;
		$("#dbffmc_ballView").empty();
		localStorageUtils.removeParam("playMode");
		localStorageUtils.removeParam("playBeiNum");
		localStorageUtils.removeParam("playFanDian");
		dbffmc_qingkongAll();
		setPanelBackPage_Fun('lotteryHallPage');
	});

	qingKong("dbffmc");//清空
	dbffmc_submitData();
}

function dbffmcResetPlayType(){
	dbffmc_playType = 2;
	dbffmc_playMethod = 15;
}

function dbffmcChangeItem(val) {
	dbffmc_qingkongAll();
	var temp = val.substring("dbffmc".length,val.length);
	if(val == "dbffmc0"){
		//直选复式
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 0;
		dbffmc_playMethod = 0;
		createFiveLineLayout("dbffmc", function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc1"){
		//直选单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 0;
		dbffmc_playMethod = 1;
		$("#dbffmc_ballView").empty();
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>五星直选:12345<br/>1)每注必须是5个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc2"){
		//组选120
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 0;
		dbffmc_playMethod = 2;
		createOneLineLayout("dbffmc","至少选择5个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc3"){
		//组选60
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 0;
		dbffmc_playMethod = 3;
		var tips = ["二重号:至少选择1个号码","单号:至少选择3个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc4"){
		//组选30
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 0;
		dbffmc_playMethod = 4;
		var tips = ["二重号:至少选择2个号码","单号:至少选择1个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc5"){
		//组选20
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 0;
		dbffmc_playMethod = 5;
		var tips = ["三重号:至少选择1个号码","单号:至少选择2个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc6"){
		//组选10
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 0;
		dbffmc_playMethod = 6;
		var tips = ["三重号:至少选择1个号码","二重号:至少选择1个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc7"){
		//组选5
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 0;
		dbffmc_playMethod = 7
		var tips = ["四重号:至少选择1个号码","单号:至少选择1个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc8"){
		//总和大小单双
		$("#dbffmc_random").show();
		var num = ["大","小","单","双"];
		dbffmc_sntuo = 0;
		dbffmc_playType = 0;
		dbffmc_playMethod = 8;
		createNonNumLayout("dbffmc",dbffmc_playMethod,num,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc9"){
		//直选复式
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 1;
		dbffmc_playMethod = 9;
		var tips = ["千位:至少选择1个号码","百位:至少选择1个号码","十位:至少选择1个号码","个位:至少选择1个号码"];
		createFourLineLayout("dbffmc",tips, function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc10"){
		//直选单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 1;
		dbffmc_playMethod = 10;
		$("#dbffmc_ballView").empty();
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>后四直选:1234<br/>1)每注必须是4个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc11"){
		//组选24
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 1;
		dbffmc_playMethod = 11;
		createOneLineLayout("dbffmc","至少选择4个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc12"){
		//组选12
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 1;
		dbffmc_playMethod = 12;
		var tips = ["二重号:至少选择1个号码","单号:至少选择2个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc13"){
		//组选6
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 1;
		dbffmc_playMethod = 13;
		createOneLineLayout("dbffmc","二重号:至少选择2个号码",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc14"){
		//组选4
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 1;
		dbffmc_playMethod = 14;
		var tips = ["三重号:至少选择1个号码","单号:至少选择1个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc15"){
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 15;
		var tips = ["百位:至少选择1个号码","十位:至少选择1个号码","个位:至少选择1个号码"];
		createThreeLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc16"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 2;
		dbffmc_playMethod = 16;
		$("#dbffmc_ballView").empty();
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>后三直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc17"){
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 17;
		createSumLayout("dbffmc",0,27,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc18"){
		//直选跨度
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 18;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc19"){
		//后三组三
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 19;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc20"){
		//后三组六
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 20;
		createOneLineLayout("dbffmc","至少选择3个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc21"){
		//后三和值
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 21;
		createSumLayout("dbffmc",1,26,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc22"){
		//后三组选包胆
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 22;
		dbffmc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbffmc",array,["请选择一个号码"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc23"){
		//后三混合组选
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 2;
		dbffmc_playMethod = 23;
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>后三混合组选(含组三、组六):123或者223<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc24"){
		//和值尾数
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 24;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc25"){
		//特殊号
		$("#dbffmc_random").show();
		var num = ["豹子","顺子","对子","半顺","杂六"];
		dbffmc_sntuo = 0;
		dbffmc_playType = 2;
		dbffmc_playMethod = 25;
		createNonNumLayout("dbffmc",dbffmc_playMethod,num,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc26"){
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 26;
		var tips = ["千位:至少选择1个号码","百位:至少选择1个号码","十位:至少选择1个号码"];
		createThreeLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc27"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 3;
		dbffmc_playMethod = 27;
		$("#dbffmc_ballView").empty();
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>中三直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc28"){
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 28;
		createSumLayout("dbffmc",0,27,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc29"){
		//直选跨度
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 29;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc30"){
		//中三组三
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 30;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc31"){
		//中三组六
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 31;
		createOneLineLayout("dbffmc","至少选择3个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc32"){
		//中三和值
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 32;
		createSumLayout("dbffmc",1,26,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc33"){
		//中三组选包胆
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 33;
		dbffmc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbffmc",array,["请选择一个号码"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc34"){
		//中三混合组选
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 3;
		dbffmc_playMethod = 34;
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>中三混合组选(含组三、组六):123或者223<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc35"){
		//和值尾数
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 35;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc36"){
		//特殊号
		$("#dbffmc_random").show();
		var num = ["豹子","顺子","对子","半顺","杂六"];
		dbffmc_sntuo = 0;
		dbffmc_playType = 3;
		dbffmc_playMethod = 36;
		createNonNumLayout("dbffmc",dbffmc_playMethod,num,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc37"){
		//直选复式
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 37;
		var tips = ["万位:至少选择1个号码","千位:至少选择1个号码","百位:至少选择1个号码"];
		createThreeLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc38"){
		//直选单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 4;
		dbffmc_playMethod = 38;
		$("#dbffmc_ballView").empty();
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>前三直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc39"){
		//和值
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 39;
		createSumLayout("dbffmc",0,27,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc40"){
		//直选跨度
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 40;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc41"){
		//前三组三
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 41;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc42"){
		//前三组六
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 42;
		createOneLineLayout("dbffmc","至少选择3个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc43"){
		//前三和值
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 43;
		createSumLayout("dbffmc",1,26,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc44"){
		//前三组选包胆
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 44;
		dbffmc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbffmc",array,["请选择一个号码"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc45"){
		//前三混合组选
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 4;
		dbffmc_playMethod = 45;
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>前三混合组选(含组三、组六):123或者223<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc46"){
		//和值尾数
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 46;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc47"){
		//特殊号
		$("#dbffmc_random").show();
		var num = ["豹子","顺子","对子","半顺","杂六"];
		dbffmc_sntuo = 0;
		dbffmc_playType = 4;
		dbffmc_playMethod = 47;
		createNonNumLayout("dbffmc",dbffmc_playMethod,num,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc48"){
		//后二复式
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 5;
		dbffmc_playMethod = 48;
		var tips = ["十位：可选1-10个","个位：可选1-10个"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc49"){
		//后二单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 5;
		dbffmc_playMethod = 49;
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>后二直选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc50"){
		//后二和值
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 5;
		dbffmc_playMethod = 50;
		createSumLayout("dbffmc",0,18,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc51"){
		//直选跨度
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 5;
		dbffmc_playMethod = 51;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc52"){
		//后二组选
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 5;
		dbffmc_playMethod = 52;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc53"){
		//后二和值
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 5;
		dbffmc_playMethod = 53;
		createSumLayout("dbffmc",1,17,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc54"){
		//后二组选包胆
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 5;
		dbffmc_playMethod = 54;
		dbffmc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbffmc",array,["请选择一个号码"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc55"){
		//前二复式
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 6;
		dbffmc_playMethod = 55;
		var tips = ["万位：可选1-10个","千位：可选1-10个"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc56"){
		//前二单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 6;
		dbffmc_playMethod = 56;
		dbffmc_qingkongAll();
		var tips = "<p>格式说明<br/>前二直选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
	}else if(val == "dbffmc57"){
		//前二和值
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 6;
		dbffmc_playMethod = 57;
		createSumLayout("dbffmc",0,18,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc58"){
		//直选跨度
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 6;
		dbffmc_playMethod = 58;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc59"){
		//前二组选
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 6;
		dbffmc_playMethod = 59;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc60"){
		//前二和值
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 6;
		dbffmc_playMethod = 60;
		createSumLayout("dbffmc",1,17,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc61"){
		//前二组选包胆
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 6;
		dbffmc_playMethod = 61;
		dbffmc_qingkongAll();
		var array = ["0","1","2","3","4","5","6","7","8","9"];
		createMutexBallLayout("dbffmc",array,["请选择一个号码"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc62"){
		//定位复式
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 7;
		dbffmc_playMethod = 62;
		createFiveLineLayout("dbffmc", function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc63"){
		//后三一码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 63;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc64"){
		//后三二码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 64;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc65"){
		//前三一码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 65;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc66"){
		//前三二码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 66;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc67"){
		//后四一码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 67;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc68"){
		//后四二码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 68;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc69"){
		//前四一码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 69;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc70"){
		//前四二码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 70;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc71"){
		//五星一码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 71;
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc72"){
		//五星二码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 72;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc73"){
		//五星三码
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 8;
		dbffmc_playMethod = 73;
		createOneLineLayout("dbffmc","至少选择3个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc74"){
		//后二大小单双
		dbffmc_qingkongAll();
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 9;
		dbffmc_playMethod = 74;
		createTextBallTwoLayout("dbffmc",["大","小","单","双"],["十位:至少选择一个","个位:至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc75"){
		//后三大小单双
		dbffmc_qingkongAll();
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 9;
		dbffmc_playMethod = 75;
		createTextBallThreeLayout("dbffmc",["大","小","单","双"],["百位:至少选择一个","十位:至少选择一个","个位:至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc76"){
		//前二大小单双
		dbffmc_qingkongAll();
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 9;
		dbffmc_playMethod = 76;
		createTextBallTwoLayout("dbffmc",["大","小","单","双"],["万位:至少选择一个","千位:至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc77"){
		//前三大小单双
		dbffmc_qingkongAll();
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 9;
		dbffmc_playMethod = 77;
		createTextBallThreeLayout("dbffmc",["大","小","单","双"],["万位:至少选择一个","千位:至少选择一个","百位:至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc78"){
		//直选复式
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 10;
		dbffmc_playMethod = 78;
		createFiveLineLayout("dbffmc",function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc79"){
		//直选单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 10;
		dbffmc_playMethod = 79;
		var tips = "<p>格式说明<br/>任选二直选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
		createRenXuanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc80"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 10;
		dbffmc_playMethod = 80;
		createSumLayout("dbffmc",0,18,function(){
			dbffmc_calcNotes();
		});
		createRenXuanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc81"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 10;
		dbffmc_playMethod = 81;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		createRenXuanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc82"){
		//组选单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 10;
		dbffmc_playMethod = 82;
		var tips = "<p>格式说明<br/>任选二组选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割，每注号码不能相同;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
		createRenXuanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc83"){
		//组选和值
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 10;
		dbffmc_playMethod = 83;
		createSumLayout("dbffmc",1,17,function(){
			dbffmc_calcNotes();
		});
		createRenXuanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc84"){
		//直选复式
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 11;
		dbffmc_playMethod = 84;
		createFiveLineLayout("dbffmc", function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc85"){
		//直选单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 11;
		dbffmc_playMethod = 85;
		var tips = "<p>格式说明<br/>任选三直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
		createRenXuanSanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc86"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 11;
		dbffmc_playMethod = 86;
		createSumLayout("dbffmc",0,27,function(){
			dbffmc_calcNotes();
		});
		createRenXuanSanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc87"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 11;
		dbffmc_playMethod = 87;
		createOneLineLayout("dbffmc","至少选择2个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		createRenXuanSanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc88"){
		//组选单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 11;
		dbffmc_playMethod = 88;
		var tips = "<p>格式说明<br/>任选三组三:122<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
		createRenXuanSanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc89"){
		//组选和值
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 11;
		dbffmc_playMethod = 89;
		createOneLineLayout("dbffmc","至少选择3个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		createRenXuanSanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc90"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 11;
		dbffmc_playMethod = 90;
		var tips = "<p>格式说明<br/>任选三组六:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割，每注号码各不相同;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
		createRenXuanSanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc91"){
		//混合组选
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 11;
		dbffmc_playMethod = 91;
		var tips = "<p>格式说明<br/>任选三混合组选:122或123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
		createRenXuanSanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc92"){
		//组选和值
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 11;
		dbffmc_playMethod = 92;
		createSumLayout("dbffmc",1,26,function(){
			dbffmc_calcNotes();
		});
		createRenXuanSanLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc93"){
		$("#dbffmc_random").show();
		dbffmc_sntuo = 0;
		dbffmc_playType = 12;
		dbffmc_playMethod = 93;
		createFiveLineLayout("dbffmc", function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc94"){
		//直选单式
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 3;
		dbffmc_playType = 12;
		dbffmc_playMethod = 94;
		var tips = "<p>格式说明<br/>任选四直选:1234<br/>1)每注必须是4个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("dbffmc",tips);
		createRenXuanSiLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc95"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 12;
		dbffmc_playMethod = 95;
		createOneLineLayout("dbffmc","至少选择4个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		createRenXuanSiLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc96"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 12;
		dbffmc_playMethod = 96;
		var tips = ["二重号:至少选择1个号码","单号:至少选择2个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		createRenXuanSiLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc97"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 12;
		dbffmc_playMethod = 97;
		$("#dbffmc_ballView").empty();
		createOneLineLayout("dbffmc","二重号:至少选择2个号码",0,9,false,function(){
			dbffmc_calcNotes();
		});
		createRenXuanSiLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc98"){
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 12;
		dbffmc_playMethod = 98;
		$("#dbffmc_ballView").empty();
		var tips = ["三重号:至少选择1个号码","单号:至少选择1个号码"];
		createTwoLineLayout("dbffmc",tips,0,9,false,function(){
			dbffmc_calcNotes();
		});
		createRenXuanSiLayout("dbffmc",dbffmc_playMethod,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc99"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 13;
		dbffmc_playMethod = 99;
		$("#dbffmc_ballView").empty();
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc100"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 13;
		dbffmc_playMethod = 100;
		$("#dbffmc_ballView").empty();
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc101"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 13;
		dbffmc_playMethod = 101;
		$("#dbffmc_ballView").empty();
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc102"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 13;
		dbffmc_playMethod = 102;
		$("#dbffmc_ballView").empty();
		createOneLineLayout("dbffmc","至少选择1个",0,9,false,function(){
			dbffmc_calcNotes();
		});
		dbffmc_qingkongAll();
	}else if(val == "dbffmc103"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 103;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc104"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 104;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc105"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 105;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc106"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 106;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc107"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 107;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc108"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 108;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc109"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 109;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc110"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 110;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc111"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 111;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}else if(val == "dbffmc112"){
		dbffmc_qingkongAll();
		$("#dbffmc_random").hide();
		dbffmc_sntuo = 0;
		dbffmc_playType = 14;
		dbffmc_playMethod = 112;
		createTextBallOneLayout("dbffmc",["龙","虎","和"],["至少选择一个"],function(){
			dbffmc_calcNotes();
		});
	}

	if(dbffmcScroll){
		dbffmcScroll.refresh();
	}
	initFooterData("dbffmc",temp);
	hideRandomWhenLi("dbffmc",dbffmc_sntuo,dbffmc_playMethod);
	dbffmc_calcNotes();
}
/**
 * [dbffmc_initFooterButton 初始化底部Button显示隐藏]
 * @return {[type]} [description]
 */
function dbffmc_initFooterButton(){
	if(dbffmc_playMethod == 0 || dbffmc_playMethod == 62 || dbffmc_playMethod == 78
		|| dbffmc_playMethod == 84 || dbffmc_playMethod == 93 || dbffmc_playType == 7){
		if(LotteryStorage["dbffmc"]["line1"].length > 0 || LotteryStorage["dbffmc"]["line2"].length > 0 ||
			LotteryStorage["dbffmc"]["line3"].length > 0 || LotteryStorage["dbffmc"]["line4"].length > 0 ||
			LotteryStorage["dbffmc"]["line5"].length > 0){
			$("#dbffmc_qingkong").css("opacity",1.0);
		}else{
			$("#dbffmc_qingkong").css("opacity",0.4);
		}
	}else if(dbffmc_playMethod == 9){
		if(LotteryStorage["dbffmc"]["line1"].length > 0 || LotteryStorage["dbffmc"]["line2"].length > 0 ||
			LotteryStorage["dbffmc"]["line3"].length > 0 || LotteryStorage["dbffmc"]["line4"].length > 0 ){
			$("#dbffmc_qingkong").css("opacity",1.0);
		}else{
			$("#dbffmc_qingkong").css("opacity",0.4);
		}
	}else if(dbffmc_playMethod == 37 || dbffmc_playMethod == 4 || dbffmc_playMethod == 6
		|| dbffmc_playMethod == 26 || dbffmc_playMethod == 15 || dbffmc_playMethod == 75 || dbffmc_playMethod == 77){
		if(LotteryStorage["dbffmc"]["line1"].length > 0 || LotteryStorage["dbffmc"]["line2"].length > 0
			|| LotteryStorage["dbffmc"]["line3"].length > 0){
			$("#dbffmc_qingkong").css("opacity",1.0);
		}else{
			$("#dbffmc_qingkong").css("opacity",0.4);
		}
	}else if(dbffmc_playMethod == 3 || dbffmc_playMethod == 4 || dbffmc_playMethod == 5
		|| dbffmc_playMethod == 6 || dbffmc_playMethod == 7 || dbffmc_playMethod == 12
		|| dbffmc_playMethod == 14 || dbffmc_playMethod == 48 || dbffmc_playMethod == 55
		|| dbffmc_playMethod == 74 || dbffmc_playMethod == 76 || dbffmc_playMethod == 96 || dbffmc_playMethod == 98){
		if(LotteryStorage["dbffmc"]["line1"].length > 0 || LotteryStorage["dbffmc"]["line2"].length > 0){
			$("#dbffmc_qingkong").css("opacity",1.0);
		}else{
			$("#dbffmc_qingkong").css("opacity",0.4);
		}
	}else if(dbffmc_playMethod == 2 || dbffmc_playMethod == 8 || dbffmc_playMethod == 11 || dbffmc_playMethod == 13 || dbffmc_playMethod == 39
		|| dbffmc_playMethod == 28 || dbffmc_playMethod == 17 || dbffmc_playMethod == 18 || dbffmc_playMethod == 24 || dbffmc_playMethod == 41
		|| dbffmc_playMethod == 25 || dbffmc_playMethod == 29 || dbffmc_playMethod == 42 || dbffmc_playMethod == 43 || dbffmc_playMethod == 30
		|| dbffmc_playMethod == 35 || dbffmc_playMethod == 36 || dbffmc_playMethod == 31 || dbffmc_playMethod == 32 || dbffmc_playMethod == 19
		|| dbffmc_playMethod == 40 || dbffmc_playMethod == 46 || dbffmc_playMethod == 20 || dbffmc_playMethod == 21 || dbffmc_playMethod == 50
		|| dbffmc_playMethod == 47 || dbffmc_playMethod == 51 || dbffmc_playMethod == 52 || dbffmc_playMethod == 53 || dbffmc_playMethod == 57 || dbffmc_playMethod == 63
		|| dbffmc_playMethod == 58 || dbffmc_playMethod == 59 || dbffmc_playMethod == 60 || dbffmc_playMethod == 65 || dbffmc_playMethod == 80 || dbffmc_playMethod == 81 || dbffmc_playType == 8
		|| dbffmc_playMethod == 83 || dbffmc_playMethod == 86 || dbffmc_playMethod == 87 || dbffmc_playMethod == 22 || dbffmc_playMethod == 33 || dbffmc_playMethod == 44
		|| dbffmc_playMethod == 89 || dbffmc_playMethod == 92 || dbffmc_playMethod == 95 || dbffmc_playMethod == 54 || dbffmc_playMethod == 61
		|| dbffmc_playMethod == 97 || dbffmc_playType == 13  || dbffmc_playType == 14){
		if(LotteryStorage["dbffmc"]["line1"].length > 0){
			$("#dbffmc_qingkong").css("opacity",1.0);
		}else{
			$("#dbffmc_qingkong").css("opacity",0.4);
		}
	}else{
		$("#dbffmc_qingkong").css("opacity",0);
	}

	if($("#dbffmc_qingkong").css("opacity") == "0"){
		$("#dbffmc_qingkong").css("display","none");
	}else{
		$("#dbffmc_qingkong").css("display","block");
	}

	if($('#dbffmc_zhushu').html() > 0){
		$("#dbffmc_queding").css("opacity",1.0);
	}else{
		$("#dbffmc_queding").css("opacity",0.4);
	}
}

/**
 * @Author:      muchen
 * @DateTime:    2014-12-13 14:40:19
 * @Description: 清空所有记录
 */
function  dbffmc_qingkongAll(){
	$("#dbffmc_ballView span").removeClass('redBalls_active');
	LotteryStorage["dbffmc"]["line1"] = [];
	LotteryStorage["dbffmc"]["line2"] = [];
	LotteryStorage["dbffmc"]["line3"] = [];
	LotteryStorage["dbffmc"]["line4"] = [];
	LotteryStorage["dbffmc"]["line5"] = [];

	localStorageUtils.removeParam("dbffmc_line1");
	localStorageUtils.removeParam("dbffmc_line2");
	localStorageUtils.removeParam("dbffmc_line3");
	localStorageUtils.removeParam("dbffmc_line4");
	localStorageUtils.removeParam("dbffmc_line5");

	$('#dbffmc_zhushu').text(0);
	$('#dbffmc_money').text(0);
	clearAwardWin("dbffmc");
	dbffmc_initFooterButton();
}

/**
 * [dbffmc_calcNotes 计算注数]
 * @return {[type]} [description]
 */
function dbffmc_calcNotes(){
	var notes = 0;

	if(dbffmc_playMethod == 0){
		notes = LotteryStorage["dbffmc"]["line1"].length *
			LotteryStorage["dbffmc"]["line2"].length *
			LotteryStorage["dbffmc"]["line3"].length *
			LotteryStorage["dbffmc"]["line4"].length *
			LotteryStorage["dbffmc"]["line5"].length;
	}else if(dbffmc_playMethod == 2){
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,5);
	}else if(dbffmc_playMethod == 3){
		if (LotteryStorage["dbffmc"]["line1"].length >= 1 && LotteryStorage["dbffmc"]["line2"].length >= 3) {
			notes = getArraySelect(3,LotteryStorage["dbffmc"]["line1"],LotteryStorage["dbffmc"]["line2"]);
		}else{
			notes = 0;
		}
	}else if(dbffmc_playMethod == 4){
		if (LotteryStorage["dbffmc"]["line1"].length >= 2 && LotteryStorage["dbffmc"]["line2"].length >= 1) {
			notes = getArraySelect(2,LotteryStorage["dbffmc"]["line2"],LotteryStorage["dbffmc"]["line1"]);
		}else{
			notes = 0;
		}
	}else if(dbffmc_playMethod == 5 || dbffmc_playMethod == 12){
		if (LotteryStorage["dbffmc"]["line1"].length >= 1 && LotteryStorage["dbffmc"]["line2"].length >= 2) {
			notes = getArraySelect(2,LotteryStorage["dbffmc"]["line1"],LotteryStorage["dbffmc"]["line2"]);
		}else{
			notes = 0;
		}
	}else if(dbffmc_playMethod == 6 || dbffmc_playMethod == 7 || dbffmc_playMethod == 14){
		if (LotteryStorage["dbffmc"]["line1"].length >= 1 && LotteryStorage["dbffmc"]["line2"].length >= 1) {
			notes = getArraySelect(1,LotteryStorage["dbffmc"]["line1"],LotteryStorage["dbffmc"]["line2"]);
		}else{
			notes = 0;
		}
	}else if(dbffmc_playMethod == 9){
		notes = LotteryStorage["dbffmc"]["line1"].length *
			LotteryStorage["dbffmc"]["line2"].length *
			LotteryStorage["dbffmc"]["line3"].length *
			LotteryStorage["dbffmc"]["line4"].length;
	}else if(dbffmc_playMethod == 18 || dbffmc_playMethod == 29 || dbffmc_playMethod == 40){
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			var temp = parseInt(LotteryStorage["dbffmc"]["line1"][i]);
			if(temp == 0){
				notes += 10;
			}else {
				notes += mathUtil.getCCombination(10 - temp,1) * 6 * temp;
			}
		}
	}else if(dbffmc_playMethod == 22 || dbffmc_playMethod == 33 || dbffmc_playMethod == 44 ){
		notes = 54;
	}else if(dbffmc_playMethod == 54 || dbffmc_playMethod == 61){
		notes = 9;
	}else if(dbffmc_playMethod == 51 || dbffmc_playMethod == 58){
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			var temp = parseInt(LotteryStorage["dbffmc"]["line1"][i]);
			if(temp == 0){
				notes += 10;
			}else {
				notes += mathUtil.getCCombination(10 - temp,1) * 2;
			}
		}
	}else if(dbffmc_playMethod == 11){
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,4);
	}else if(dbffmc_playMethod == 13|| dbffmc_playMethod == 64 || dbffmc_playMethod == 66 || dbffmc_playMethod == 68 || dbffmc_playMethod == 70 || dbffmc_playMethod == 72){
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,2);
	}else if(dbffmc_playMethod == 37 || dbffmc_playMethod == 26 || dbffmc_playMethod == 15 || dbffmc_playMethod == 75 || dbffmc_playMethod == 77){
		notes = LotteryStorage["dbffmc"]["line1"].length *
			LotteryStorage["dbffmc"]["line2"].length *
			LotteryStorage["dbffmc"]["line3"].length ;
	}else if(dbffmc_playMethod == 39 || dbffmc_playMethod == 28 || dbffmc_playMethod == 17){
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			notes += mathUtil.getZhiXuanHeZhiNote(LotteryStorage["dbffmc"]["line1"][i]);
		};
	}else if(dbffmc_playMethod == 41 || dbffmc_playMethod == 30 || dbffmc_playMethod == 19){
		notes = mathUtil.getACombination(LotteryStorage["dbffmc"]["line1"].length,2);
	}else if(dbffmc_playMethod == 42 || dbffmc_playMethod == 31 || dbffmc_playMethod == 20 || dbffmc_playMethod == 68 || dbffmc_playMethod == 73){
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,3);
	}else if(dbffmc_playMethod == 43 || dbffmc_playMethod == 32 || dbffmc_playMethod == 21){
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			notes += mathUtil.getSanXingZuXuanHeZhiNote(LotteryStorage["dbffmc"]["line1"][i]);
		};
	}else if(dbffmc_playMethod == 48 || dbffmc_playMethod == 55 || dbffmc_playMethod == 74 || dbffmc_playMethod == 76){
		notes = LotteryStorage["dbffmc"]["line1"].length *
			LotteryStorage["dbffmc"]["line2"].length ;
	}else if(dbffmc_playMethod == 50 || dbffmc_playMethod == 57){
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			notes += mathUtil.getErXingZhiXuanHeZhiNote(LotteryStorage["dbffmc"]["line1"][i]);
		};
	}else if(dbffmc_playMethod == 52 || dbffmc_playMethod == 59){
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,2);
	}else if(dbffmc_playMethod == 53 || dbffmc_playMethod == 60){
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			notes += mathUtil.getErXingZuXuanHeZhiNote(LotteryStorage["dbffmc"]["line1"][i]);
		};
	}else if(dbffmc_playMethod == 62){
		notes = LotteryStorage["dbffmc"]["line1"].length +
			LotteryStorage["dbffmc"]["line2"].length +
			LotteryStorage["dbffmc"]["line3"].length +
			LotteryStorage["dbffmc"]["line4"].length +
			LotteryStorage["dbffmc"]["line5"].length;
	}else if(dbffmc_playType == 13 || dbffmc_playType == 14 || dbffmc_playMethod == 8 || dbffmc_playMethod == 71
		|| dbffmc_playMethod == 24 || dbffmc_playMethod == 25 || dbffmc_playMethod == 35 || dbffmc_playMethod == 36 || dbffmc_playMethod == 46
		|| dbffmc_playMethod == 47 || dbffmc_playMethod == 63 || dbffmc_playMethod == 65 || dbffmc_playMethod == 67 || dbffmc_playMethod == 69 ){
		notes = LotteryStorage["dbffmc"]["line1"].length ;
	}else if(dbffmc_playMethod == 78){
		notes = LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line2"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line3"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line4"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line3"].length +
			LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line4"].length +
			LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line4"].length +
			LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line4"].length * LotteryStorage["dbffmc"]["line5"].length;
	}else if (dbffmc_playMethod == 80) {
		if ($("#dbffmc_tab .button.red").size() < 2) {
			notes = 0;
		}else{
			for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
				notes += mathUtil.getErXingZhiXuanHeZhiNote(LotteryStorage["dbffmc"]["line1"][i]);
			};
			notes *= mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,2);
		}
	}else if (dbffmc_playMethod == 81) {
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,2) * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,2);
	}else if (dbffmc_playMethod == 83) {
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			notes += mathUtil.getErXingZuXuanHeZhiNote(LotteryStorage["dbffmc"]["line1"][i]);
		};
		notes *= mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,2);
	}else if (dbffmc_playMethod == 84) {
		notes = LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line3"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line4"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line4"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line4"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line4"].length +
			LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line4"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line4"].length * LotteryStorage["dbffmc"]["line5"].length ;
	}else if (dbffmc_playMethod == 86) {
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			notes += mathUtil.getZhiXuanHeZhiNote(LotteryStorage["dbffmc"]["line1"][i]);
		};
		notes *= mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,3);
	}else if (dbffmc_playMethod == 87) {
		notes = mathUtil.getACombination(LotteryStorage["dbffmc"]["line1"].length,2) * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,3);
	}else if (dbffmc_playMethod == 89) {
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,3) * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,3);
	}else if (dbffmc_playMethod == 92) {
		for (var i = 0; i < LotteryStorage["dbffmc"]["line1"].length; i++) {
			notes += mathUtil.getSanXingZuXuanHeZhiNote(LotteryStorage["dbffmc"]["line1"][i]);
		};
		notes *= mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,3);
	}else if (dbffmc_playMethod == 93) {
		notes = LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line4"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line4"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line1"].length * LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line4"].length * LotteryStorage["dbffmc"]["line5"].length +
			LotteryStorage["dbffmc"]["line2"].length * LotteryStorage["dbffmc"]["line3"].length * LotteryStorage["dbffmc"]["line4"].length * LotteryStorage["dbffmc"]["line5"].length;
	}else if (dbffmc_playMethod == 95) {
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,4)
			* mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,4);
	}else if (dbffmc_playMethod == 96) {
		if (LotteryStorage["dbffmc"]["line1"].length >= 1 && LotteryStorage["dbffmc"]["line2"].length >= 2) {
			notes = getArraySelect(2,LotteryStorage["dbffmc"]["line1"],LotteryStorage["dbffmc"]["line2"])
				* mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,4);
		}else{
			notes = 0;
		}
	}else if (dbffmc_playMethod == 97) {
		notes = mathUtil.getCCombination(LotteryStorage["dbffmc"]["line1"].length,2) * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,4);
	}else if (dbffmc_playMethod == 98) {
		if (LotteryStorage["dbffmc"]["line1"].length >= 1 && LotteryStorage["dbffmc"]["line2"].length >= 1) {
			notes = getArraySelect(1,LotteryStorage["dbffmc"]["line1"],LotteryStorage["dbffmc"]["line2"]) * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,4);
		}else{
			notes = 0;
		}
	}else{
		notes = dbffmcValidData($("#dbffmc_single").val());
	}

	if(dbffmc_sntuo == 3 || dbffmc_sntuo == 1 || getplayid(LotteryInfo.getId("ssc","dbffmc"),LotteryInfo.getMethodId("ssc",dbffmc_playMethod))){
	}else{
		if(parseInt($('#dbffmc_modeId').val()) == 8){
			$("#dbffmc_random").hide();
		}else{
			$("#dbffmc_random").show();
		}
	}

	//验证是否为空
	if( $("#dbffmc_beiNum").val() =="" || parseInt($("#dbffmc_beiNum").val()) == 0){
		$("#dbffmc_beiNum").val(1);
	}

	//验证慢彩最大倍数为9999
	if($("#dbffmc_beiNum").val() > 9999){
		$("#dbffmc_beiNum").val(9999);
	}

	if(notes > 0) {
		$('#dbffmc_zhushu').text(notes);
		if($("#dbffmc_modeId").val() == "8"){
			$('#dbffmc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbffmc_beiNum").val()),0.002));
		}else if ($("#dbffmc_modeId").val() == "2"){
			$('#dbffmc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbffmc_beiNum").val()),0.2));
		}else if ($("#dbffmc_modeId").val() == "1"){
			$('#dbffmc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbffmc_beiNum").val()),0.02));
		}else{
			$('#dbffmc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbffmc_beiNum").val()),2));
		}
	} else {
		$('#dbffmc_zhushu').text(0);
		$('#dbffmc_money').text(0);
	}
	dbffmc_initFooterButton();
	// 计算奖金盈利
	calcAwardWin('dbffmc',dbffmc_playMethod);
}

/**
 * [dbffmc_submitData 确认提交数据]
 * @return {[type]} [description]
 */
function dbffmc_submitData(){
	var submitParams = new LotterySubmitParams();
	$("#dbffmc_queding").bind('click', function(event) {
		dbffmc_rebate = $("#dbffmc_fandian option:last").val();
		if(parseInt($('#dbffmc_zhushu').html()) <= 0){
			toastUtils.showToast('请至少选择一注');
			return;
		}
		dbffmc_calcNotes();

		if(parseInt($('#dbffmc_modeId').val()) == 8){
			if (Number($('#dbffmc_money').html()) < 0.02){
				toastUtils.showToast('请至少选择0.02元');
				return;
			}
		}

		//提示单挑奖金
		getDanTiaoBonus('dbffmc',dbffmc_playMethod);

		submitParams.lotteryType = "dbffmc";
		var play = LotteryInfo.getPlayName("ssc",dbffmc_playType);
		var playMethod = LotteryInfo.getMethodName("ssc",dbffmc_playMethod);
		submitParams.playType = play;
		submitParams.playMethod = playMethod;
		submitParams.playTypeIndex = dbffmc_playType;
		submitParams.playMethodIndex = dbffmc_playMethod;
		var selectedBalls = [];
		if(dbffmc_playMethod == 0 || dbffmc_playMethod == 3 || dbffmc_playMethod == 4
			|| dbffmc_playMethod == 5 || dbffmc_playMethod == 6 || dbffmc_playMethod == 7
			|| dbffmc_playMethod == 9 || dbffmc_playMethod == 12 || dbffmc_playMethod == 14
			|| dbffmc_playMethod == 37 || dbffmc_playMethod == 26 || dbffmc_playMethod == 15
			|| dbffmc_playMethod == 48 || dbffmc_playMethod == 55 || dbffmc_playMethod == 74 || dbffmc_playType == 9){
			$("#dbffmc_ballView div.ballView").each(function(){
				var arr = [];
				$(this).find("span.redBalls_active").each(function(){
					arr.push($(this).text());
				});
				selectedBalls.push(arr.join(","));
			});
			submitParams.nums = selectedBalls.join("|");
		}else if(dbffmc_playMethod == 2 || dbffmc_playMethod == 8 || dbffmc_playMethod == 11 || dbffmc_playMethod == 13 || dbffmc_playMethod == 24
			|| dbffmc_playMethod == 39 || dbffmc_playMethod == 28 || dbffmc_playMethod == 17 || dbffmc_playMethod == 18 || dbffmc_playMethod == 25
			|| dbffmc_playMethod == 22 || dbffmc_playMethod == 33 || dbffmc_playMethod == 44 || dbffmc_playMethod == 54 || dbffmc_playMethod == 61
			|| dbffmc_playMethod == 41 || dbffmc_playMethod == 42 || dbffmc_playMethod == 43 || dbffmc_playMethod == 29 || dbffmc_playMethod == 35
			|| dbffmc_playMethod == 30 || dbffmc_playMethod == 31 || dbffmc_playMethod == 32 || dbffmc_playMethod == 40 || dbffmc_playMethod == 36
			|| dbffmc_playMethod == 19 || dbffmc_playMethod == 20 || dbffmc_playMethod == 21 || dbffmc_playMethod == 46 || dbffmc_playMethod == 47
			|| dbffmc_playMethod == 50 || dbffmc_playMethod == 57 || dbffmc_playType == 8 || dbffmc_playMethod == 51 || dbffmc_playMethod == 58
			|| dbffmc_playMethod == 52 || dbffmc_playMethod == 53|| dbffmc_playMethod == 59 || dbffmc_playMethod == 60 || dbffmc_playType == 13 || dbffmc_playType == 14){
			$("#dbffmc_ballView div.ballView").each(function(){
				$(this).find("span.redBalls_active").each(function(){
					selectedBalls.push($(this).text());
				});
			});
			submitParams.nums = selectedBalls.join(",");
		}else if(dbffmc_playType == 7 || dbffmc_playMethod == 78 || dbffmc_playMethod == 84 || dbffmc_playMethod == 93){
			$("#dbffmc_ballView div.ballView").each(function(){
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
		}else if(dbffmc_playMethod == 80 || dbffmc_playMethod == 81 || dbffmc_playMethod == 83
			|| dbffmc_playMethod == 86 || dbffmc_playMethod == 87 || dbffmc_playMethod == 89
			|| dbffmc_playMethod == 92 || dbffmc_playMethod == 95 || dbffmc_playMethod == 97){
			$("#dbffmc_ballView div.ballView").each(function(){
				$(this).find("span.redBalls_active").each(function(){
					selectedBalls.push($(this).text());
				});
			});
			var temp = selectedBalls.join(",") + "#";

			if ($("#dbffmc_tab1").hasClass("button red")) {
				temp += "万";
			};
			if ($("#dbffmc_tab2").hasClass("button red")) {
				temp += "千";
			};
			if ($("#dbffmc_tab3").hasClass("button red")) {
				temp += "百";
			};
			if ($("#dbffmc_tab4").hasClass("button red")) {
				temp += "十";
			};
			if ($("#dbffmc_tab5").hasClass("button red")) {
				temp += "个";
			};

			submitParams.nums = temp;
		}else if (dbffmc_playMethod == 96 || dbffmc_playMethod == 98) {
			$("#dbffmc_ballView div.ballView").each(function(){
				var arr = [];
				$(this).find("span.redBalls_active").each(function(){
					arr.push($(this).text());
				});
				selectedBalls.push(arr.join(","));
			});
			var temp = selectedBalls.join("|") + "#";
			if ($("#dbffmc_tab1").hasClass("button red")) {
				temp += "万";
			};
			if ($("#dbffmc_tab2").hasClass("button red")) {
				temp += "千";
			};
			if ($("#dbffmc_tab3").hasClass("button red")) {
				temp += "百";
			};
			if ($("#dbffmc_tab4").hasClass("button red")) {
				temp += "十";
			};
			if ($("#dbffmc_tab5").hasClass("button red")) {
				temp += "个";
			};
			submitParams.nums = temp;
		}else{
			var array = handleSingleStr($("#dbffmc_single").val());
			if(dbffmc_playMethod == 1 ){
				submitParams.nums = array.join(" ");
			}else if(dbffmc_playMethod == 10 || dbffmc_playMethod == 38 || dbffmc_playMethod == 27
				|| dbffmc_playMethod == 16 || dbffmc_playMethod == 49 || dbffmc_playMethod == 56){
				var temp = "";
				for(var i = 0;i < array.length;i++){
					if(i == array.length - 1){
						temp = temp + array[i].split("").join("|");
					}else{
						temp = temp + array[i].split("").join("|") + " ";
					}
				}
				submitParams.nums = temp;
			}else if(dbffmc_playMethod == 45 || dbffmc_playMethod == 34 || dbffmc_playMethod == 23){
				var temp = "";
				for(var i = 0;i < array.length;i++){
					if(i == array.length - 1){
						temp = temp + array[i].split("").join(",");
					}else{
						temp = temp + array[i].split("").join(",") + " ";
					}
				}
				submitParams.nums = temp;
			}else if(dbffmc_playMethod == 79 || dbffmc_playMethod == 82 || dbffmc_playMethod == 85 || dbffmc_playMethod == 88 ||
				dbffmc_playMethod == 89 || dbffmc_playMethod == 90 || dbffmc_playMethod == 91 || dbffmc_playMethod == 94){
				var temp = "";
				for(var i = 0;i < array.length;i++){
					if(i == array.length - 1){
						temp = temp + array[i].split("").join(",");
					}else{
						temp = temp + array[i].split("").join(",") + " ";
					}
				}
				temp +="#";
				if ($("#dbffmc_tab1").hasClass("button red")) {
					temp += "万";
				};
				if ($("#dbffmc_tab2").hasClass("button red")) {
					temp += "千";
				};
				if ($("#dbffmc_tab3").hasClass("button red")) {
					temp += "百";
				};
				if ($("#dbffmc_tab4").hasClass("button red")) {
					temp += "十";
				};
				if ($("#dbffmc_tab5").hasClass("button red")) {
					temp += "个";
				};

				submitParams.nums = temp;
			}
		}
		localStorageUtils.setParam("playMode",$("#dbffmc_modeId").val());
		localStorageUtils.setParam("playBeiNum",$("#dbffmc_beiNum").val());
		localStorageUtils.setParam("playFanDian",$("#dbffmc_fandian").val());
		submitParams.notes = $('#dbffmc_zhushu').html();
		submitParams.sntuo = dbffmc_sntuo;
		submitParams.multiple = $('#dbffmc_beiNum').val();  //requirement
		submitParams.rebates = $('#dbffmc_fandian').val();  //requirement
		submitParams.playMode = $('#dbffmc_modeId').val();  //requirement
		submitParams.money = $('#dbffmc_money').html();  //requirement
		submitParams.award = $('#dbffmc_minAward').html();  //奖金
		submitParams.maxAward = $('#dbffmc_maxAward').html();  //多级奖金
		submitParams.submit();
		$("#dbffmc_ballView").empty();
		dbffmc_qingkongAll();
	});
}

/**
 * [dbffmc_randomOne 随机一注]
 * @return {[type]} [description]
 */
function dbffmc_randomOne(){
	dbffmc_qingkongAll();
	if(dbffmc_playMethod == 0){
		var redBallArray = mathUtil.getNums(5,10);
		LotteryStorage["dbffmc"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["dbffmc"]["line2"].push(redBallArray[1]+"");
		LotteryStorage["dbffmc"]["line3"].push(redBallArray[2]+"");
		LotteryStorage["dbffmc"]["line4"].push(redBallArray[3]+"");
		LotteryStorage["dbffmc"]["line5"].push(redBallArray[4]+"");

		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line2"], function(k, v){
			$("#" + "dbffmc_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line3"], function(k, v){
			$("#" + "dbffmc_line3" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line4"], function(k, v){
			$("#" + "dbffmc_line4" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line5"], function(k, v){
			$("#" + "dbffmc_line5" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 8){
		var number = mathUtil.getRandomNum(0,4);
		LotteryStorage["dbffmc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 9){
		var redBallArray = mathUtil.getNums(4,10);
		LotteryStorage["dbffmc"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["dbffmc"]["line2"].push(redBallArray[1]+"");
		LotteryStorage["dbffmc"]["line3"].push(redBallArray[2]+"");
		LotteryStorage["dbffmc"]["line4"].push(redBallArray[3]+"");

		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line2"], function(k, v){
			$("#" + "dbffmc_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line3"], function(k, v){
			$("#" + "dbffmc_line3" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line4"], function(k, v){
			$("#" + "dbffmc_line4" + v).toggleClass("redBalls_active");
		});

	}else if(dbffmc_playMethod == 37 || dbffmc_playMethod == 26 || dbffmc_playMethod == 15){
		var redBallArray = mathUtil.getNums(3,10);
		LotteryStorage["dbffmc"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["dbffmc"]["line2"].push(redBallArray[1]+"");
		LotteryStorage["dbffmc"]["line3"].push(redBallArray[2]+"");

		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line2"], function(k, v){
			$("#" + "dbffmc_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line3"], function(k, v){
			$("#" + "dbffmc_line3" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 41 || dbffmc_playMethod == 30 || dbffmc_playMethod == 19 || dbffmc_playMethod == 68
		|| dbffmc_playMethod == 52 || dbffmc_playMethod == 64 || dbffmc_playMethod == 66
		|| dbffmc_playMethod == 59 || dbffmc_playMethod == 70 || dbffmc_playMethod == 72){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,redBallArray);
		$.each(array,function (k,v) {
			LotteryStorage["dbffmc"]["line1"].push(v+"");
		});
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 42 || dbffmc_playMethod == 31 || dbffmc_playMethod == 20 || dbffmc_playMethod == 73){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(3,redBallArray);
		$.each(array,function (k,v) {
			LotteryStorage["dbffmc"]["line1"].push(v+"");
		});
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 39 || dbffmc_playMethod == 28 || dbffmc_playMethod == 17){
		var number = mathUtil.getRandomNum(0,28);
		LotteryStorage["dbffmc"]["line1"].push(number+'');
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 43 || dbffmc_playMethod == 32 || dbffmc_playMethod == 21){
		var number = mathUtil.getRandomNum(1,27);
		LotteryStorage["dbffmc"]["line1"].push(number+'');
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 48 || dbffmc_playMethod == 55){
		var redBallArray = mathUtil.getNums(2,10);
		LotteryStorage["dbffmc"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["dbffmc"]["line2"].push(redBallArray[1]+"");

		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line2"], function(k, v){
			$("#" + "dbffmc_line2" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 25 || dbffmc_playMethod == 36 || dbffmc_playMethod == 47){
		var number = mathUtil.getRandomNum(0,5);
		LotteryStorage["dbffmc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 50 || dbffmc_playMethod == 57){
		var number = mathUtil.getRandomNum(0,19);
		LotteryStorage["dbffmc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 53 || dbffmc_playMethod == 60){
		var number = mathUtil.getRandomNum(1,18);
		LotteryStorage["dbffmc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 62){
		var line = mathUtil.getRandomNum(1,6);
		var number = mathUtil.getRandomNum(0,10);
		LotteryStorage["dbffmc"]["line"+line].push(number+"");
		$.each(LotteryStorage["dbffmc"]["line"+line], function(k, v){
			$("#" + "dbffmc_line" + line + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 63 || dbffmc_playMethod == 67 || dbffmc_playMethod == 69 || dbffmc_playMethod == 71 || dbffmc_playType == 13
		|| dbffmc_playMethod == 65 || dbffmc_playMethod == 18 || dbffmc_playMethod == 29 || dbffmc_playMethod == 40 || dbffmc_playMethod == 22
		|| dbffmc_playMethod == 33 || dbffmc_playMethod == 44 || dbffmc_playMethod == 54 || dbffmc_playMethod == 61
		|| dbffmc_playMethod == 24 || dbffmc_playMethod == 35 || dbffmc_playMethod == 46 || dbffmc_playMethod == 51 || dbffmc_playMethod == 58){
		var number = mathUtil.getRandomNum(0,10);
		LotteryStorage["dbffmc"]["line1"].push(number+'');
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 74 || dbffmc_playMethod == 76){
		var array = mathUtil.getNums(2,4);
		LotteryStorage["dbffmc"]["line1"].push(array[0]+"");
		LotteryStorage["dbffmc"]["line2"].push(array[1]+"");
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line2"], function(k, v){
			$("#" + "dbffmc_line2" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 75 || dbffmc_playMethod == 77){
		var array = mathUtil.getNums(3,4);
		LotteryStorage["dbffmc"]["line1"].push(array[0]+"");
		LotteryStorage["dbffmc"]["line2"].push(array[1]+"");
		LotteryStorage["dbffmc"]["line3"].push(array[2]+"");
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line2"], function(k, v){
			$("#" + "dbffmc_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line3"], function(k, v){
			$("#" + "dbffmc_line3" + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 78){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(2,lineArray);
		var array = mathUtil.getNums(2,10);
		LotteryStorage["dbffmc"]["line"+lines[0]].push(array[0]+"");
		LotteryStorage["dbffmc"]["line"+lines[1]].push(array[1]+"");
		$.each(LotteryStorage["dbffmc"]["line"+lines[0]], function(k, v){
			$("#" + "dbffmc_line" + lines[0] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line"+lines[1]], function(k, v){
			$("#" + "dbffmc_line"+ lines[1] + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 84){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(3,lineArray);
		var array = mathUtil.getNums(3,10);
		LotteryStorage["dbffmc"]["line"+lines[0]].push(array[0]+"");
		LotteryStorage["dbffmc"]["line"+lines[1]].push(array[1]+"");
		LotteryStorage["dbffmc"]["line"+lines[2]].push(array[2]+"");

		$.each(LotteryStorage["dbffmc"]["line"+lines[0]], function(k, v){
			$("#" + "dbffmc_line"+ lines[0] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line"+lines[1]], function(k, v){
			$("#" + "dbffmc_line"+ lines[1] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line"+lines[0]], function(k, v){
			$("#" + "dbffmc_line"+ lines[2] + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playMethod == 93){
		var lineArray = mathUtil.getInts(1,5);
		var lines = mathUtil.getDifferentNums(4,lineArray);
		var array = mathUtil.getNums(4,10);
		LotteryStorage["dbffmc"]["line"+lines[0]].push(array[0]+"");
		LotteryStorage["dbffmc"]["line"+lines[1]].push(array[1]+"");
		LotteryStorage["dbffmc"]["line"+lines[2]].push(array[2]+"");
		LotteryStorage["dbffmc"]["line"+lines[3]].push(array[3]+"");

		$.each(LotteryStorage["dbffmc"]["line"+lines[0]], function(k, v){
			$("#" + "dbffmc_line"+ lines[0] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line"+lines[1]], function(k, v){
			$("#" + "dbffmc_line"+ lines[1] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line"+lines[2]], function(k, v){
			$("#" + "dbffmc_line"+ lines[2] + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["dbffmc"]["line"+lines[3]], function(k, v){
			$("#" + "dbffmc_line"+ lines[3] + v).toggleClass("redBalls_active");
		});
	}else if(dbffmc_playType == 14){
		var number = mathUtil.getRandomNum(0,2);
		LotteryStorage["dbffmc"]["line1"].push(number+"");
		$.each(LotteryStorage["dbffmc"]["line1"], function(k, v){
			$("#" + "dbffmc_line1" + v).toggleClass("redBalls_active");
		});
	}
	dbffmc_calcNotes();
}

/**
 * 出票机选
 * @param playMethod
 */
function dbffmc_checkOutRandom(playMethod){
	var obj = new Object();
	if(dbffmc_playMethod == 0){
		var redBallArray = mathUtil.getNums(5,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(dbffmc_playMethod == 8){
		var number = mathUtil.getRandomNum(0,4);
		var array = ["大","小","单","双"];
		obj.nums = array[number];
		obj.notes = 1;
	}else if(dbffmc_playMethod == 18 || dbffmc_playMethod == 29 || dbffmc_playMethod == 40){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		if(number == 0){
			obj.notes = 10;
		}else {
			obj.notes = mathUtil.getCCombination(10 - number,1) * 6 * number;
		}
	}else if(dbffmc_playMethod == 22 || dbffmc_playMethod == 33 || dbffmc_playMethod == 44){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		obj.notes = 54;
	}else if(dbffmc_playMethod == 54 || dbffmc_playMethod == 61){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		obj.notes = 9;
	}
	else if(dbffmc_playMethod == 9){
		var redBallArray = mathUtil.getNums(4,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(dbffmc_playMethod == 37 || dbffmc_playMethod == 26 || dbffmc_playMethod == 15){
		var redBallArray = mathUtil.getNums(3,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(dbffmc_playMethod == 39 || dbffmc_playMethod == 28 || dbffmc_playMethod == 17){
		var number = mathUtil.getRandomNum(0,28);
		obj.nums = number;
		obj.notes = mathUtil.getZhiXuanHeZhiNote(number);
	}else if(dbffmc_playMethod == 41 || dbffmc_playMethod == 30 || dbffmc_playMethod == 19){
		var lineArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,lineArray);
		obj.nums = array.join(",");
		obj.notes = 2;
	}else if(dbffmc_playMethod == 52 || dbffmc_playMethod == 59 || dbffmc_playMethod == 64 || dbffmc_playMethod == 66 || dbffmc_playMethod == 68
		||dbffmc_playMethod == 70 || dbffmc_playMethod == 72){
		var lineArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,lineArray);
		obj.nums = array.join(",");
		obj.notes = 1;
	}else if(dbffmc_playMethod == 42 || dbffmc_playMethod == 31 || dbffmc_playMethod == 20 || dbffmc_playMethod == 73){
		var lineArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(3,lineArray);
		obj.nums = array.join(",");
		obj.notes = 1;
	}else if(dbffmc_playMethod == 43 || dbffmc_playMethod == 32 || dbffmc_playMethod == 21){
		var number = mathUtil.getRandomNum(1,27);
		obj.nums = number;
		obj.notes = mathUtil.getSanXingZuXuanHeZhiNote(number);
	}else if(dbffmc_playMethod == 48 || dbffmc_playMethod == 55){
		var redBallArray = mathUtil.getNums(2,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(dbffmc_playMethod == 50 || dbffmc_playMethod == 57){
		var number = mathUtil.getRandomNum(0,19);
		obj.nums = number;
		obj.notes = mathUtil.getErXingZhiXuanHeZhiNote(number);
	}else if(dbffmc_playMethod == 53 || dbffmc_playMethod == 60){
		var number = mathUtil.getRandomNum(1,18);
		obj.nums = number;
		obj.notes = mathUtil.getErXingZuXuanHeZhiNote(number);
	}else if(dbffmc_playMethod == 62){
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
	}else if(dbffmc_playMethod == 63 || dbffmc_playMethod == 65 || dbffmc_playMethod == 67 || dbffmc_playMethod == 69 || dbffmc_playMethod == 71
		|| dbffmc_playMethod == 24 || dbffmc_playMethod == 35 || dbffmc_playMethod == 46){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		obj.notes = 1;
	}else if(dbffmc_playMethod == 25 || dbffmc_playMethod == 36 || dbffmc_playMethod == 47){
		var number = mathUtil.getRandomNum(0,5);
		var array = ["豹子","顺子","对子","半顺","杂六"];
		obj.nums = array[number];
		obj.notes = 1;
	}else if(dbffmc_playMethod == 51 || dbffmc_playMethod == 58){
		var number = mathUtil.getRandomNum(0,10);
		obj.nums = number;
		if(number == 0){
			obj.notes = 10;
		}else {
			obj.notes = mathUtil.getCCombination(10 - number,1) * 2;
		}
	}else if(dbffmc_playMethod == 74 || dbffmc_playMethod == 76){
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
	}else if(dbffmc_playMethod == 75 || dbffmc_playMethod == 77){
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
	}else if(dbffmc_playMethod == 78){
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
	}else if(dbffmc_playMethod == 84){
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
	}else if(dbffmc_playMethod == 93){
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
	obj.sntuo = dbffmc_sntuo;
	obj.multiple = 1;
	obj.rebates = dbffmc_rebate;
	obj.playMode = "4";
	obj.money = bigNumberUtil.multiply(obj.notes,2).toString();
	calcAwardWin('dbffmc',dbffmc_playMethod,obj);  //机选奖金计算
	obj.award = $('#dbffmc_minAward').html();     //奖金
	obj.maxAward = $('#dbffmc_maxAward').html();  //多级奖金
	return obj;
}

/**
 * [dbffmcValidateData 单式数据验证]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function dbffmcValidateData(data){
	dbffmcValidData(data.value);
}

function dbffmcValidData(str){
	var notes = 0;
	var array;
	if(dbffmc_playMethod == 1){
		array = handleSingleStrNew({
			str:str,
			weishu:5
		});
		notes = array.length;
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 10){
		array = handleSingleStrNew({
			str:str,
			weishu:4
		});
		notes = array.length;
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 38 || dbffmc_playMethod == 27 || dbffmc_playMethod == 16){
		array = handleSingleStrNew({
			str:str,
			weishu:3
		});
		notes = array.length;
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 45 || dbffmc_playMethod == 34 || dbffmc_playMethod == 23){
		// baozi : 是否要过滤豹子号
		array = handleSingleStrNew({
			str:str,
			weishu:3,
			baozi:true
		});
		notes = array.length;
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 49 || dbffmc_playMethod == 56){
		array = handleSingleStrNew({
			str:str,
			weishu:2
		});
		notes = array.length;
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 79){
		array = handleSingleStrNew({
			str:str,
			weishu:2
		});
		notes = array.length * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,2);
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 82){
		array = handleSingleStrNew({
			str:str,
			weishu:2,
			duizi:true
		});
		notes = array.length * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,2);
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 85){
		array = handleSingleStrNew({
			str:str,
			weishu:3
		});
		notes = array.length * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,3);
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 88){
		array = handleSingleStrNew({
			str:str,
			weishu:3,
			zusan:true
		});
		notes = array.length * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,3);
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 90){
		array = handleSingleStrNew({
			str:str,
			weishu:3,
			zuliu:true
		});
		notes = array.length * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,3);
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 91){
		array = handleSingleStrNew({
			str:str,
			weishu:3,
			baozi:true
		});
		notes = array.length * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,3);
		dbffmcShowFooter(true,notes);
	}else if(dbffmc_playMethod == 94){
		array = handleSingleStrNew({
			str:str,
			weishu:4
		});
		notes = array.length * mathUtil.getCCombination($("#dbffmc_tab .button.red").size() ,4);
		dbffmcShowFooter(true,notes);
	}
	$("#dbffmc_single").val(array.join(" "));
	return notes;
}

function dbffmcShowFooter(isValid,notes){
	$('#dbffmc_zhushu').text(notes);
	if($("#dbffmc_modeId").val() == "8"){
		$('#dbffmc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbffmc_beiNum").val()),0.002));
	}else if ($("#dbffmc_modeId").val() == "2"){
		$('#dbffmc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbffmc_beiNum").val()),0.2));
	}else if ($("#dbffmc_modeId").val() == "1"){
		$('#dbffmc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbffmc_beiNum").val()),0.02));
	}else{
		$('#dbffmc_money').text(bigNumberUtil.multiply(notes * parseInt($("#dbffmc_beiNum").val()),2));
	}
	if(!isValid){
		toastUtils.showToast('格式不正确');
	}
	dbffmc_initFooterButton();
	calcAwardWin('dbffmc',dbffmc_playMethod);  //计算奖金和盈利
}