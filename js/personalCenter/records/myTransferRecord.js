//页大小
var PAGESIZE_myTransfer = 20;
//查询开始时间
var startDateTime = "";
//查询结束时间
var endDateTime = "";
var selDateTransferStart;
var selDateTransferEnd;
var UserName;
//IsHistory 默认false  是否是历史记录
var IsHistory = false;
var TransferType;

/*进入panel时调用*/
function myTransferRecordLoadedPanel(){
    catchErrorFun("myTransferRecordInit();");
}
/*离开panel时调用*/
function myTransferRecordUnloadedPanel(){
    $("#myTransferList").empty();
    //清除本地存储的查询条件
    clearSearchTerm();
    startDateTime = "";
    endDateTime = "";
    if(selDateTransferStart){
        selDateTransferStart.dismiss();
    }
    if(selDateTransferEnd){
        selDateTransferEnd.dismiss();
    }
}

//@ 初始化
function myTransferRecordInit(){
	
    $("#selectMyTransferID").empty();
    var $select=$('<table><tr>' +
        '<td><select name="searchDate_myTransfer" id="searchDate_myTransfer" data-theme="a" data-mini="true" onchange="dateChange_myTransfer()"><option value="0" selected="selected">当前记录</option><option value="1">历史记录</option></select></td>' +
        '<td><input type="text" id="selectDateTransfer_Stt" readonly/></td>' +
        '<td><input type="text" id="selectDateTransfer_End" readonly/></td></tr></table>');
    $("#selectMyTransferID").append($select);
    var $select=$('<table style="display: none;"><tr>' +
        '<td><select name="myTransferType" id="myTransferType" onchange="Change_myTransferType()"><option value="1" selected="selected">彩票转账到棋牌</option><option value="2">棋牌转账到彩票</option></select></td>' +
        '</tr></table>');
    $("#selectMyTransferID").append($select);

    //查询开始时间
    selDateTransferStart = new MobileSelectDate();
    selDateTransferStart.init({trigger:'#selectDateTransfer_Stt',min:initDefaultDate(-3,"day"),max:initDefaultDate(0,"day")});
    selDateTransferEnd = new MobileSelectDate();
    selDateTransferEnd.init({trigger:'#selectDateTransfer_End',min:initDefaultDate(-3,"day"),max:initDefaultDate(0,"day")});

    UserName = localStorageUtils.getParam("username");
    page = 0;
    hasMorePage = true;//默认还有分页
    var _myScroller =  $("#myTransferScroller").scroller({
        verticalScroll : true,
        horizontalScroll : false,
        vScrollCSS: "afScrollbar",
        autoEnable : true
    });
    _myScroller.scrollToTop();
    _myScroller.clearInfinite();
    addUseScroller(_myScroller,'myTransferList','getMyTransferNext()');
    //进入时加载
    loadMyTransferRecord();

    // 转账记录查询（右上角搜索）
    $("#queryMyTransferButton").unbind('click');
    $("#queryMyTransferButton").bind('click', function(event) {
        $.ui.popup({
            title:"订单号查询",
            message:'<input type="text" id="myTransferOrderId" maxLength="25"  placeholder="请输入要查找的订单号" />',
            cancelText:"关闭",
            cancelCallback:
                function(){
                },
            doneText:"确定",
            doneCallback:
                function(){
                    var searchOrder = $("#myTransferOrderId").val();
                    if(searchOrder ==""){
                        toastUtils.showToast("请输入要查找的订单号");
                        return;
                    }
                    queryMyTransferOrder(searchOrder);
                },
            cancelOnly:false
        });
    });
}

//@ 日期改变事件
function dateChange_myTransfer() {
    var timeType = $("#searchDate_myTransfer").val();
    switch(timeType) {
        case "0":
            //当前记录
            $("#selectDateTransfer_Stt").val(initDefaultDate(0,'day'));  //View
            $("#selectDateTransfer_End").val(initDefaultDate(0,'day'));
            startDateTime = $("#selectDateTransfer_Stt").val()+hms00;
            endDateTime = $("#selectDateTransfer_End").val()+hms59;
            IsHistory = false;
            searchMyTransfer(startDateTime, endDateTime);
            changeDateRange_Transfer(-3,"day",0,"day");   //Controller
            break;
        case "1":
            //历史记录
            $("#selectDateTransfer_Stt").val(initDefaultDate(-4,'day'));  //view
            $("#selectDateTransfer_End").val(initDefaultDate(-4,'day'));
            startDateTime = $("#selectDateTransfer_Stt").val()+hms00;
            endDateTime = $("#selectDateTransfer_End").val()+hms59;
            IsHistory = true;
            searchMyTransfer(startDateTime, endDateTime);
            changeDateRange_Transfer(-32,"day",-4,"day");     //Controller
            break;
    }
}
//@ 类型改变事件
function Change_myTransferType() {
    var value = $("#myTransferType").val();
    switch(value) {
        case "1":
            TransferType = "1";
            dateChange_myTransfer();
            break;
        case "2":
            TransferType = "2";
            dateChange_myTransfer();
            break;
    }
    localStorageUtils.setParam("myTransferType",TransferType);
}


//@ 切换当前记录或者历史记录时。
function changeDateRange_Transfer(minNum,minType,maxNum,maxType){
    selDateTransferStart.setMinAndMax(initDefaultDate(minNum,minType),initDefaultDate(maxNum,maxType));
    selDateTransferEnd.setMinAndMax(initDefaultDate(minNum,minType),initDefaultDate(maxNum,maxType));
}

//@ 查询转账记录 - First Page
function searchMyTransfer(startDateTime, endDateTime) {
    page=0;
    searchmyTransfer_Record(startDateTime, endDateTime)
}

//@ next Page
function getMyTransferNext(){
    startDateTime = $("#selectDateTransfer_Stt").val()+hms00;
    endDateTime = $("#selectDateTransfer_End").val()+hms59;
    searchmyTransfer_Record(startDateTime, endDateTime);
}

//@ 查询转账记录
function searchmyTransfer_Record(startDateTime, endDateTime) {
    ajaxUtil.ajaxByAsyncPost(null, '{"InterfaceName":"KYGetUserTransfer","ProjectPublic_PlatformCode":2,"UserName":"'+ UserName +'","Source":0,"IsHistory":' + IsHistory + ',"InsertTimeMin":"' + startDateTime + '","InsertTimeMax":"' + endDateTime + '","CurrentPageIndex":' + page + ',"CurrentPageSize":' + PAGESIZE_myTransfer + '}',
    myTransfer_searchSuccessCallBack, '正在加载数据...');
}

//@ 根据订单号查找
function queryMyTransferOrder(searchOrder){
    var page = 0;
    ajaxUtil.ajaxByAsyncPost(null, '{"InterfaceName":"KYGetUserTransfer","ProjectPublic_PlatformCode":2,"OrderID":"'+searchOrder+'","UserName":"'+ UserName +'","Source":0,"IsHistory":' + IsHistory + ',"InsertTimeMin":"' + startDateTime + '","InsertTimeMax":"' + endDateTime + '","CurrentPageIndex":' + page + ',"CurrentPageSize":' + PAGESIZE_myTransfer + '}',
    myTransfer_searchSuccessCallBack, '正在加载数据...');
}

//@ 通过查询条件加载数据
function loadMyTransferRecord() {
    var conditions = getSearchTerm();
    if (null != conditions) {
        var dataOptions = document.getElementById('searchDate_myTransfer').options;
        for (var i = 0; i < dataOptions.length; i++) {
            dataOptions[i].selected = false;
            if (dataOptions[i].value == conditions.time) {
                dataOptions[i].selected = true;
            }
        }
        var TransferTypeOptions = document.getElementById('myTransferType').options;
        for (var i = 0; i < TransferTypeOptions.length; i++) {
            TransferTypeOptions[i].selected = false;
            if (TransferTypeOptions[i].value == localStorageUtils.getParam("myTransferType")) {
                TransferTypeOptions[i].selected = true;
            }
        }

        startDateTime = conditions.dateStt + hms00;
        endDateTime = conditions.dateEnd + hms59;
        $("#selectDateTransfer_Stt").val(conditions.dateStt);
        $("#selectDateTransfer_End").val(conditions.dateEnd);
        // 时间选择器
        var dateChange = conditions.time;
        switch (dateChange){
            case "0":
                changeDateRange_Transfer(-3,"day",0,"day");   //Controller
                break;
            case "1":
                changeDateRange_Transfer(-32,"day",-4,"day");     //Controller
                break;
        }

        //根据查询条件查询数据
        searchMyTransfer(startDateTime, endDateTime);
        //重置isDetail标记，表示从记录界面返回
        var searchConditions = getSearchTerm();
        searchConditions.isDetail =  false;
        saveSearchTerm(searchConditions);
    } else {
        initmyTransfer();
    }
}

//@ Init
function initmyTransfer() {
	TransferType = "1";
    $("#selectDateTransfer_Stt").val(initDefaultDate(0,"day"));
    $("#selectDateTransfer_End").val(initDefaultDate(0,"day"));
    //查询开始时间
    startDateTime = $("#selectDateTransfer_Stt").val()+hms00;
    //查询结束时间
    endDateTime = $("#selectDateTransfer_End").val()+hms59;
    searchMyTransfer(startDateTime, endDateTime);
}

//@ 每个item点击时，触发该方法，保存当前的查询条件
function onItemClickListener_myTransfer() {
    var searchConditions = {};
    searchConditions.time =  $("#searchDate_myTransfer").val();
    searchConditions.dateStt =  $("#selectDateTransfer_Stt").val();
    searchConditions.dateEnd =  $("#selectDateTransfer_End").val();
    searchConditions.isDetail =  true;
    saveSearchTerm(searchConditions);
}

//@ Ajax返回数据
function myTransfer_searchSuccessCallBack(data){
    if (page == 0) {
        $("#myTransferList").empty();
        $("#myTransferScroller").scroller().scrollToTop();
        $("#myTransferScroller").scroller().clearInfinite();
    }
    if(data ==null){
        toastUtils.showToast("没有数据");
        return;
    }

    var info=data.DsUserTransfer;
    if (data.SystemState == 64  && data.DataCount !=0 && data.OrderState == 0) {
        isHasMorePage(info,PAGESIZE_myTransfer);
        for (var i = 0; i < info.length; i++) {
            var dataSet = new Object();

            dataSet.orderId = info[i].OrderId;  //订单号
            dataSet.DetailsSource = info[i].DetailsSource;  //资金去向
            dataSet.TransferMoney = info[i].TransferMoney;  //转账金额
            dataSet.InsertTime = info[i].InsertTime;  //转账时间
            dataSet.Marks = info[i].Marks;  //备注
            dataSet.state = (info[i].TransferType == "2") ? "成功" : "失败";

            var $itemLi = $('<li></li>').data('myTransferRecord',dataSet);
            $itemLi.on('click',function() {
                onItemClickListener_myTransfer();
                localStorageUtils.setParam("myTransferRecord",JSON.stringify($(this).data('myTransferRecord')));
                setPanelBackPage_Fun('transferRecordDetail');
            });
            $itemLi.append('<a class="recordList"><dl class="orderList"><dd>订单号:&nbsp;' + dataSet.orderId + '</dd><dd>资金去向:&nbsp;<span class="red">' + transferDetail(dataSet.DetailsSource) +'</span></dd><dd>转账金额:&nbsp;'+dataSet.TransferMoney+'</dd><dd>状态:&nbsp;'+ dataSet.state +'</dd><dd>转账时间:&nbsp;' + dataSet.InsertTime +'</dd></dl></a>');
            $("#myTransferList").append($itemLi);
        }
    } else if(data.SystemState == -1){
        loginAgain();
    } else if (data.DataCount ==0) {
        toastUtils.showToast("没有数据");
        return;
    }else {
        toastUtils.showToast("网络不给力，请稍后再试");
        return;
    }
}

function transferDetail(source) {
    if (source == '300'){
        return "棋牌-->彩票";
    }else if (source == "290"){
        return "彩票-->棋牌";
    }else if (source == "490"){
    	return "彩票-->棋牌";
    }else if (source == "500"){
    	return "棋牌-->彩票";
    }else if (source == "510"){
    	return "转账失败返还金额";
    }
}