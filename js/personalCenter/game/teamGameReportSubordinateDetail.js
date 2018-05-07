
/*进入panel时调用*/
function teamGameReportSubordinateDetailLoadedPanel(){
    catchErrorFun("teamGameReportSubordinateDetailInit();");
}
/*离开panel时调用*/
function teamGameReportSubordinateDetailUnloadedPanel(){
    $("#teamGameReportSubordinateDetailUlId").empty();
}
function teamGameReportSubordinateDetailInit(){
    $("#teamGameReportSubordinateDetailUlId").empty();
    var $SubordinateDetailUl=$('<ul class="recordDetail"><li>用户名：<span id="grd_username"></span></li><li>类型：<span id="grd_type"></span></li><li>游戏消费：<span id="grd_cost"></span></li> <li>游戏获取：<span id="grd_get"></span></li><li>房费：<span id="grd_room_fee"></span></li><li>下级盈亏：<span id="grd_pl"></span></li></ul>');
    $("#teamGameReportSubordinateDetailUlId").append($SubordinateDetailUl);
    var teamGameReportSubordinate = JSON.parse(localStorageUtils.getParam("teamGameReportSubordinate"));

    if(parseInt(teamGameReportSubordinate.ChildNum) > 0){
        $("#teamGameReportSubordinateDetail_back").show();
    }else{
        $("#teamGameReportSubordinateDetail_back").hide();
    }

    var subordinateId = teamGameReportSubordinate.userId;
    $("#grd_username").html(teamGameReportSubordinate.userName);
    $("#grd_type").html(teamGameReportSubordinate.category);
    $("#grd_cost").html(teamGameReportSubordinate.GamePay);
    $("#grd_get").html(teamGameReportSubordinate.GameGet);
    $("#grd_room_fee").html(teamGameReportSubordinate.RoomFee);
    $("#grd_pl").html(teamGameReportSubordinate.PL);

    $("#teamGameReportSubordinateDetail_back").unbind('click');
    $("#teamGameReportSubordinateDetail_back").bind('click', function(event) {
        localStorageUtils.setParam("gameSubordinateId", subordinateId);
        setPanelBackPage_Fun('teamGameReportSubordinate');
    });

}