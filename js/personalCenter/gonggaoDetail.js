/* 
* @Author: Administrator
* @Date:   2015-02-08 11:09:41
* @Last Modified by:   Administrator
* @Last Modified time: 2015-12-23 17:35:27
*/
var couponPage = 1;
var newsType = "0";
var hasMore = true;
//0:非头条，1头条
var isTopLine=1;
var totalPage = 0;
var _title,_source,_sourceUrl,_pic,_showcount,_desc,_summary,_site,
    _width = 600,
    _height = 600,
    _top = (screen.height-_height)/2,
    _left = (screen.width-_width)/2   

function gonggaoDetailLoadedPanel(){
  catchErrorFun("gonggaoDetail_init();");
}

function gonggaoDetail_init(){
  $("#gonggaoDetImg").empty();
  $("#gonggaocontentID").empty();
  var param = '{"ProjectPublic_PlatformCode":2,"newsID":' + localStorageUtils.getParam('MerchantNews_ID') + ',"InterfaceName":"GetNewsDetail"}';
     ajaxUtil.ajaxByAsyncPost(null,param,function(data){
      // console.log("调用查询公告详情返回的数据：" + JSON.stringify(data));
          $("#gonggaotimeID").text(data.InsertTime);
          $("#gonggaotitleID").text(data.NewsTittle);
          $("#gonggaocontentID").append(data.NewsContent);
    },'正在加载数据');
}