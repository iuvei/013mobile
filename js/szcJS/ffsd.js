
//定义福彩3D玩法标识
var ffsd_playType = 0;
var ffsd_playMethod = 0;
var ffsd_sntuo = 0;
var ffsd_rebate;
var ffsdScroll;

//进入这个页面时调用
function ffsdPageLoadedPanel() {
	catchErrorFun("ffsd_init();");
}

//离开这个页面时调用
function ffsdPageUnloadedPanel(){
	$("#ffsdPage_back").off('click');
	$("#ffsd_queding").off('click');
	$("#ffsd_ballView").empty();
	$("#ffsdSelect").empty();
	var $select = $('<select class="cs-select cs-skin-overlay" id="ffsdPlaySelect"></select>');
	$("#ffsdSelect").append($select);
}
//入口函数
function ffsd_init(){
	$("#ffsd_title").html(LotteryInfo.getLotteryNameByTag("ffsd"));
	for(var i = 0; i< LotteryInfo.getPlayLength("sd");i++){
		if(i == 5){
			continue;
		}
		var $play = $('<optgroup label="'+LotteryInfo.getPlayName("sd",i)+'"></optgroup>');
		for(var j = 0; j < LotteryInfo.getMethodLength("sd");j++){
			if(j == 3 || j == 7 || j == 8 || j == 9 || j == 10 || j == 13 || j == 14 || j == 15 || j == 16 || j == 17
				|| j == 18 || j == 21 || j == 22 || j == 23 || j == 24 || j == 25 || j == 26){
				continue;
			}
			if(LotteryInfo.getMethodTypeId("sd",j) == LotteryInfo.getPlayTypeId("sd",i)){
				var name = LotteryInfo.getMethodName("sd",j);
				if(i == ffsd_playType && j == ffsd_playMethod){
					$play.append('<option value="ffsd'+LotteryInfo.getMethodIndex("sd",j)+'" selected="selected">' + name +'</option>');
				}else{
					$play.append('<option value="ffsd'+LotteryInfo.getMethodIndex("sd",j)+'">' + name +'</option>');
				}
			}
		}
		$("#ffsdPlaySelect").append($play);
	}

	[].slice.call( document.getElementById("ffsdSelect").querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el, {
			stickyPlaceholder: true,
			onChange:ffsdChangeItem
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

	GetLotteryInfo("ffsd",function (){
		ffsdChangeItem("ffsd"+ffsd_playMethod);
	});

	//添加滑动条
	if(!ffsdScroll){
		ffsdScroll = new IScroll('#ffsdContent',{
			click:true,
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
	}

	//获取期号
	getQihao("ffsd",LotteryInfo.getLotteryIdByTag("ffsd"));
	//获取上一期开奖
	queryLastPrize("ffsd");

	//获取单挑和单期最高奖金
	getLotteryMaxBonus('ffsd');

	//返回
	$("#ffsdPage_back").on('click', function(event) {
		// ffsd_playType = 0;
		// ffsd_playMethod = 0;
		$("#ffsd_ballView").empty();
		localStorageUtils.removeParam("playMode");
        localStorageUtils.removeParam("playBeiNum");
        localStorageUtils.removeParam("playFanDian");
		ffsd_qingkongAll();
		setPanelBackPage_Fun('lotteryHallPage');
	});

	//机选选号
	$("#ffsd_random").on('click', function(event) {
		ffsd_randomOne();
	});

	qingKong("ffsd");
	ffsd_submitData();
}


function ffsdResetPlayType(){
	ffsd_playType = 0;
	ffsd_playMethod = 0;
}

function ffsdChangeItem(val) {
	ffsd_qingkongAll();
	var temp = val.substring("ffsd".length,val.length);
	if(val == 'ffsd0'){
		//直选复式
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 0;
		ffsd_playMethod = 0;
		var tips = ["百位:至少选择1个号码","十位:至少选择1个号码","个位:至少选择1个号码"];
		createThreeLineLayout("ffsd",tips,0,9,false,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}else if(val == 'ffsd1'){
		//直选单式
		$("#ffsd_random").hide();
		ffsd_sntuo = 3;
		ffsd_playType = 0;
		ffsd_playMethod = 1;
		ffsd_qingkongAll();
		var tips = "<p>格式说明<br/>直选:123<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("ffsd",tips);
	}else if(val == 'ffsd2'){
		//直选和值
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 0;
		ffsd_playMethod = 2;
		createSumLayout("ffsd",0,27,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}else if(val == 'ffsd4'){
		//直选复式
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 0;
		ffsd_playMethod = 4;
		createOneLineLayout("ffsd","请至少选择2个",0,9,false,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}else if(val == 'ffsd5'){
		//包号
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 0;
		ffsd_playMethod = 5;
		createOneLineLayout("ffsd","请至少选择3个",0,9,false,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}else if(val == 'ffsd6'){
		//直选单式
		$("#ffsd_random").hide();
		ffsd_sntuo = 3;
		ffsd_playType = 0;
		ffsd_playMethod = 6;
		ffsd_qingkongAll();
		var tips = "<p>格式说明<br/>混合组选(含组三、组六):123或者223<br/>1)每注必须是3个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("ffsd",tips);
	}else if(val == 'ffsd27'){
		//一星定位
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 3;
		ffsd_playMethod = 27;
		var tips = ["百位:至少选择1个号码","十位:至少选择1个号码","个位:至少选择1个号码"];
		createThreeLineLayout("ffsd",tips,0,9,false,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}else if(val == 'ffsd11'){
		//直选复式
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 1;
		ffsd_playMethod = 11;
		var tips = ["百位:至少选择1个号码","十位:至少选择1个号码"];
		createTwoLineLayout("ffsd",tips,0,9,false,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}else if(val == 'ffsd12'){
		//直选单式
		$("#ffsd_random").hide();
		ffsd_sntuo = 3;
		ffsd_playType = 1;
		ffsd_playMethod = 12;
		$("#ffsd_ballView").empty();
		ffsd_qingkongAll();
		var tips = "<p>格式说明<br/>前二直选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("ffsd",tips);
	}else if(val == 'ffsd19'){
		//直选复式
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 2;
		ffsd_playMethod = 19;
		var tips = ["十位:至少选择1个号码","个位:至少选择1个号码"];
		createTwoLineLayout("ffsd",tips,0,9,false,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}else if(val == 'ffsd20'){
		//直选单式
		$("#ffsd_random").hide();
		ffsd_sntuo = 3;
		ffsd_playType = 2;
		ffsd_playMethod = 20;
		$("#ffsd_ballView").empty();
		ffsd_qingkongAll();
		var tips = "<p>格式说明<br/>后二直选:12<br/>1)每注必须是2个号码,每个号码之间无需用符号分割;2)每注之间用空格分割;3)只支持单式.</p>";
		createSingleLayout("ffsd",tips);
	}else if(val == 'ffsd28'){
		//直选复式
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 4;
		ffsd_playMethod = 28;
		createOneLineLayout("ffsd","请至少选择1个",0,9,false,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}else if(val == 'ffsd29'){
		//直选单式
		$("#ffsd_random").show();
		ffsd_sntuo = 0;
		ffsd_playType = 4;
		ffsd_playMethod = 29;
		createOneLineLayout("ffsd","请至少选择2个",0,9,false,function(){
			ffsd_calcNotes();
		});
		ffsd_qingkongAll();
	}

	if(ffsdScroll){
		ffsdScroll.refresh();
	}
	initFooterData("ffsd",temp);
	hideRandomWhenLi("ffsd",ffsd_sntuo,ffsd_playMethod);
	ffsd_calcNotes();
}


/**
 * [ffsd_initFooterButton 初始化底部Button显示隐藏]
 * @return {[type]} [description]
 */
function ffsd_initFooterButton(){
	if(ffsd_playMethod == 0 || ffsd_playMethod == 27){
		if(LotteryStorage["ffsd"]["line1"].length > 0
			|| LotteryStorage["ffsd"]["line2"].length > 0
			|| LotteryStorage["ffsd"]["line3"].length > 0){
			$("#ffsd_qingkong").css("opacity",1.0);
		}else{
			$("#ffsd_qingkong").css("opacity",0.4);
		}
	}else if(ffsd_playMethod == 2 || ffsd_playMethod == 4 || ffsd_playMethod == 5
		|| ffsd_playMethod == 28 || ffsd_playMethod == 29){
		if (LotteryStorage["ffsd"]["line1"].length > 0 ) {
			$("#ffsd_qingkong").css("opacity",1.0);
		}else{
			$("#ffsd_qingkong").css("opacity",0.4);
		}
	}else if (ffsd_playMethod == 11 || ffsd_playMethod == 19) {
		if(LotteryStorage["ffsd"]["line1"].length > 0
			|| LotteryStorage["ffsd"]["line2"].length > 0){
			$("#ffsd_qingkong").css("opacity",1.0);
		}else{
			$("#ffsd_qingkong").css("opacity",0.4);
		}
	}else{
		$("#ffsd_qingkong").css("opacity",0);
	}

	if($("#ffsd_qingkong").css("opacity") == "0"){
		$("#ffsd_qingkong").css("display","none");
	}else{
		$("#ffsd_qingkong").css("display","block");
	}

	if($('#ffsd_zhushu').html() > 0){
		$("#ffsd_queding").css("opacity",1.0);
	}else{
		$("#ffsd_queding").css("opacity",0.4);
	}
}

//清空所有记录
function ffsd_qingkongAll(){
	$("#ffsd_ballView span").removeClass('redBalls_active');
	LotteryStorage["ffsd"]["line1"] = [];
	LotteryStorage["ffsd"]["line2"] = [];
	LotteryStorage["ffsd"]["line3"] = [];

	localStorageUtils.removeParam("ffsd_line1");
	localStorageUtils.removeParam("ffsd_line2");
	localStorageUtils.removeParam("ffsd_line3");

	$('#ffsd_zhushu').text(0);
	$('#ffsd_money').text(0);
	clearAwardWin("ffsd");
	ffsd_initFooterButton();

}

/**
 * [ffsd_calcNotes 计算注数]
 * @return {[type]} [description]
 */
function ffsd_calcNotes(){
	var notes = 0;
	if (ffsd_playMethod == 0) {
		notes = LotteryStorage["ffsd"]["line1"].length *
			LotteryStorage["ffsd"]["line2"].length *
			LotteryStorage["ffsd"]["line3"].length;
	}else if(ffsd_playMethod == 2){//和值
		for (var i = 0; i < LotteryStorage["ffsd"]["line1"].length; i++) {
			notes += mathUtil.getZhiXuanHeZhiNote(parseInt(LotteryStorage["ffsd"]["line1"][i]));
		}
	}else if(ffsd_playMethod == 4){//组三包号
		notes = mathUtil.getACombination(LotteryStorage["ffsd"]["line1"].length,2);
	}else if(ffsd_playMethod == 5){
		notes = mathUtil.getCCombination(LotteryStorage["ffsd"]["line1"].length,3);
	}else if(ffsd_playMethod == 27){//一星定位
		notes = LotteryStorage["ffsd"]["line1"].length +
			LotteryStorage["ffsd"]["line2"].length +
			LotteryStorage["ffsd"]["line3"].length;
	}else if(ffsd_playMethod == 11 || ffsd_playMethod == 19){//二星复式
		notes = LotteryStorage["ffsd"]["line1"].length *
			LotteryStorage["ffsd"]["line2"].length;
	}else if(ffsd_playMethod == 28){
		notes = LotteryStorage["ffsd"]["line1"].length;
	}else if(ffsd_playMethod == 29){
		notes = mathUtil.getCCombination(LotteryStorage["ffsd"]["line1"].length,2);
	}else{
		notes = ffsdValidData($("#ffsd_single").val());
	}

	//验证是否为空
	if( $("#ffsd_beiNum").val() =="" || parseInt($("#ffsd_beiNum").val()) == 0){
		$("#ffsd_beiNum").val(1);
	}

	//验证慢彩最大倍数为9999
	if($("#ffsd_beiNum").val() > 9999){
		$("#ffsd_beiNum").val(9999);
	}

	if(notes > 0) {
		$('#ffsd_zhushu').text(notes);
		if($("#ffsd_modeId").val() == "8"){
			$('#ffsd_money').text(bigNumberUtil.multiply(notes * parseInt($("#ffsd_beiNum").val()),0.002));
		}else if ($("#ffsd_modeId").val() == "2"){
			$('#ffsd_money').text(bigNumberUtil.multiply(notes * parseInt($("#ffsd_beiNum").val()),0.2));
		}else if ($("#ffsd_modeId").val() == "1"){
			$('#ffsd_money').text(bigNumberUtil.multiply(notes * parseInt($("#ffsd_beiNum").val()),0.02));
		}else{
			$('#ffsd_money').text(bigNumberUtil.multiply(notes * parseInt($("#ffsd_beiNum").val()),2));
		}

	} else {
		$('#ffsd_zhushu').text(0);
		$('#ffsd_money').text(0);
	}
	ffsd_initFooterButton();
	// 计算奖金盈利
	calcAwardWin('ffsd',ffsd_playMethod);
}

/**
 * [ffsd_randomOne 随机一注]
 * @return {[type]} [description]
 */
function ffsd_randomOne(){
	ffsd_qingkongAll();
	if(ffsd_playMethod == 0){
		var redBallArray = mathUtil.getNums(3,10);
		LotteryStorage["ffsd"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["ffsd"]["line2"].push(redBallArray[1]+"");
		LotteryStorage["ffsd"]["line3"].push(redBallArray[2]+"");

		$.each(LotteryStorage["ffsd"]["line1"], function(k, v){
			$("#" + "ffsd_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["ffsd"]["line2"], function(k, v){
			$("#" + "ffsd_line2" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["ffsd"]["line3"], function(k, v){
			$("#" + "ffsd_line3" + v).toggleClass("redBalls_active");
		});

	}else if(ffsd_playMethod == 2){
		var number = mathUtil.getRandomNum(0,28);
		LotteryStorage["ffsd"]["line1"].push(number+"");
		$.each(LotteryStorage["ffsd"]["line1"], function(k, v){
			$("#" + "ffsd_line1" + v).toggleClass("redBalls_active");
		});
	}else if(ffsd_playMethod == 4 || ffsd_playMethod == 29){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,redBallArray);
		$.each(array, function (k,v) {
			LotteryStorage["ffsd"]["line1"].push(v+"");
		})

		$.each(LotteryStorage["ffsd"]["line1"], function(k, v){
			$("#" + "ffsd_line1" + v).toggleClass("redBalls_active");
		});
	}else if(ffsd_playMethod == 5){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(3,redBallArray);
		$.each(array, function (k,v) {
			LotteryStorage["ffsd"]["line1"].push(v+"");
		})
		$.each(LotteryStorage["ffsd"]["line1"], function(k, v){
			$("#" + "ffsd_line1" + v).toggleClass("redBalls_active");
		});
	}else if(ffsd_playMethod == 27){
		var line = mathUtil.getRandomNum(1,4);
		var number = mathUtil.getRandomNum(0,10);
		LotteryStorage["ffsd"]["line"+line].push(number+"");
		$.each(LotteryStorage["ffsd"]["line"+line], function(k, v){
			$("#" + "ffsd_line" + line + v).toggleClass("redBalls_active");
		});
	}else if(ffsd_playMethod == 11 || ffsd_playMethod == 19){
		var redBallArray = mathUtil.getNums(2,10);
		LotteryStorage["ffsd"]["line1"].push(redBallArray[0]+"");
		LotteryStorage["ffsd"]["line2"].push(redBallArray[1]+"");

		$.each(LotteryStorage["ffsd"]["line1"], function(k, v){
			$("#" + "ffsd_line1" + v).toggleClass("redBalls_active");
		});
		$.each(LotteryStorage["ffsd"]["line2"], function(k, v){
			$("#" + "ffsd_line2" + v).toggleClass("redBalls_active");
		});

	}else if(ffsd_playMethod == 28){
		var number = mathUtil.getRandomNum(0,10);
		LotteryStorage["ffsd"]["line1"].push(number+"");
		$.each(LotteryStorage["ffsd"]["line1"], function(k, v){
			$("#" + "ffsd_line1" + v).toggleClass("redBalls_active");
		});
	}
	ffsd_calcNotes();
}

/**
 * 出票机选
 * @param playMethod
 */
function ffsd_checkOutRandom(playMethod){
	var obj = new Object();
	if(ffsd_playMethod == 0){
		var redBallArray = mathUtil.getNums(3,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(ffsd_playMethod == 2){
		var number = mathUtil.getRandomNum(0,28);
		obj.nums = number;
		obj.notes = mathUtil.getZhiXuanHeZhiNote(number);
	}else if(ffsd_playMethod == 4){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,redBallArray);
		obj.nums = array.join(",");
		obj.notes = 2;
	}else if(ffsd_playMethod == 5){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(3,redBallArray);
		obj.nums = array.join(",");
		obj.notes = 1;
	}else if(ffsd_playMethod == 27){
		var line = mathUtil.getRandomNum(1,4);
		var number = mathUtil.getRandomNum(0,10);
		if(line == 1){
			obj.nums = number + "|*|*";
		}else if(line == 2){
			obj.nums = "*|"+ number +"|*";
		}else if(line == 3){
			obj.nums = "*|*|"+number;
		}
		obj.notes = 1;
	}else if(ffsd_playMethod == 11 || ffsd_playMethod == 19){
		var redBallArray = mathUtil.getNums(2,10);
		obj.nums = redBallArray.join("|");
		obj.notes = 1;
	}else if(ffsd_playMethod == 28){
		obj.nums = mathUtil.getRandomNum(0,10);
		obj.notes = 1;
	}else if(ffsd_playMethod == 29){
		var redBallArray = mathUtil.getInts(0,9);
		var array = mathUtil.getDifferentNums(2,redBallArray);
		obj.nums = array.join(",");
		obj.notes = 1;
	}
	obj.sntuo = ffsd_sntuo;
	obj.multiple = 1;
	obj.rebates = ffsd_rebate;
	obj.playMode = "4";
	obj.money = bigNumberUtil.multiply(obj.notes,2).toString();
	calcAwardWin('ffsd',ffsd_playMethod,obj);  //机选奖金计算
	obj.award = $('#ffsd_minAward').html();     //奖金
	obj.maxAward = $('#ffsd_maxAward').html();  //多级奖金
	return obj;
}

/**
 * [ffsd_submitData 确认提交数据]
 * @return {[type]} [description]
 */
function ffsd_submitData(){
	var submitParams = new LotterySubmitParams();
	$("#ffsd_queding").bind('click', function(event) {
		ffsd_rebate = $("#ffsd_fandian option:last").val();
		if(parseInt($('#ffsd_zhushu').html()) <= 0 || Number($("#ffsd_money").html()) <= 0){
			toastUtils.showToast('请至少选择一注');
			return;
		}
		ffsd_calcNotes();

		if(parseInt($('#ffsd_modeId').val()) == 8){
			if (Number($('#ffsd_money').html()) < 0.02){
				toastUtils.showToast('请至少选择0.02元');
				return;
			}
		}
		//提示单挑奖金
		getDanTiaoBonus('ffsd',ffsd_playMethod);

		submitParams.lotteryType = "ffsd";
		submitParams.playType = LotteryInfo.getPlayName("sd",ffsd_playType);
		submitParams.playMethod = LotteryInfo.getMethodName("sd",ffsd_playMethod);
		submitParams.playTypeIndex = ffsd_playType;
		submitParams.playMethodIndex = ffsd_playMethod;
		var selectedBalls = [];

		if(ffsd_playMethod == 0 || ffsd_playMethod == 11 || ffsd_playMethod == 19){
			$("#ffsd_ballView div.ballView").each(function(){
				var arr = [];
				$(this).find("span.redBalls_active").each(function(){
					arr.push($(this).text());
				});
				selectedBalls.push(arr.join(","));
			});
			submitParams.nums = selectedBalls.join("|");
		}else if(ffsd_playMethod == 2 || ffsd_playMethod == 4 || ffsd_playMethod == 5
			|| ffsd_playMethod == 28 || ffsd_playMethod == 29){
			$("#ffsd_ballView div.ballView").each(function(){
				$(this).find("span.redBalls_active").each(function(){
					selectedBalls.push($(this).text());
				});
			});
			submitParams.nums = selectedBalls.join(",");
		}else if(ffsd_playMethod == 1 || ffsd_playMethod == 12 || ffsd_playMethod == 20){
			var array = handleSingleStr($("#ffsd_single").val());
			var temp = "";
			for(var i = 0;i < array.length;i++){
				if(i == array.length - 1){
					temp = temp + array[i].split("").join("|");
				}else{
					temp = temp + array[i].split("").join("|") + " ";
				}
			}
			submitParams.nums = temp;
		}else if(ffsd_playMethod == 6){
			var array = handleSingleStr($("#ffsd_single").val());
			var temp = "";
			for(var i = 0;i < array.length;i++){
				if(i == array.length - 1){
					temp = temp + array[i].split("").join(",");
				}else{
					temp = temp + array[i].split("").join(",") + " ";
				}
			}
			submitParams.nums = temp;
		}else if(ffsd_playMethod == 27){
			$("#ffsd_ballView div.ballView").each(function(){
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
		}
		localStorageUtils.setParam("playMode",$("#ffsd_modeId").val());
        localStorageUtils.setParam("playBeiNum",$("#ffsd_beiNum").val());
        localStorageUtils.setParam("playFanDian",$("#ffsd_fandian").val());
		submitParams.notes = $('#ffsd_zhushu').html();
		submitParams.sntuo = ffsd_sntuo;
		submitParams.multiple = $('#ffsd_beiNum').val();  //requirement
		submitParams.rebates = $('#ffsd_fandian').val();  //requirement
		submitParams.playMode = $('#ffsd_modeId').val();  //requirement
		submitParams.money = $('#ffsd_money').html();  //requirement
		submitParams.award = $('#ffsd_minAward').html();  //奖金
		submitParams.maxAward = $('#ffsd_maxAward').html();  //多级奖金
		submitParams.submit();
		$("#ffsd_ballView").empty();
		ffsd_qingkongAll();
	});
}

function ffsdValidateData(data){
	ffsdValidData(data.value);
}

/**
 * [ffsdValidateData 单式数据验证]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function ffsdValidData(content){
	var array;
	if(ffsd_playMethod == 1){
		array = handleSingleStrNew({
			str:content,
			weishu:3
		});
	}else if(ffsd_playMethod == 12 || ffsd_playMethod == 20){
		array = handleSingleStrNew({
			str:content,
			weishu:2
		});
	}else if(ffsd_playMethod == 6){
		array = handleSingleStrNew({
			str:content,
			weishu:3,
			baozi:true
		});
	}
	$("#ffsd_single").val(array.join(" "));

	var notes = array.length;
	$('#ffsd_zhushu').text(notes);
	if($("#ffsd_modeId").val() == "8"){
		$('#ffsd_money').text(bigNumberUtil.multiply(notes * parseInt($("#ffsd_beiNum").val()),0.002));
	}else if ($("#ffsd_modeId").val() == "2"){
		$('#ffsd_money').text(bigNumberUtil.multiply(notes * parseInt($("#ffsd_beiNum").val()),0.2));
	}else if ($("#ffsd_modeId").val() == "1"){
		$('#ffsd_money').text(bigNumberUtil.multiply(notes * parseInt($("#ffsd_beiNum").val()),0.02));
	}else{
		$('#ffsd_money').text(bigNumberUtil.multiply(notes * parseInt($("#ffsd_beiNum").val()),2));
	}
	ffsd_initFooterButton();
	calcAwardWin('ffsd',ffsd_playMethod);  //计算奖金和盈利
	return notes;
}