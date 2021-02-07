/**检查浏览器是否是微信浏览器 */
var useragent = navigator.userAgent
if (!useragent.match(/MicroMessenger/i) || !(navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
  $('#messageBox').show()
  $('#msgBox-info').show()
  $('#message').html('已禁止本次访问：您必须使用手机微信浏览器访问本页面！')
}
/** 1、初始化哪些页面显示哪些不显示、初始化题目 */
var timeId = null // 倒计时定时器id
var curQs = {} // 当前显示在页面上的题目
var questionArr = [] // 拿到十道题目
var isAllCurrect = true // 默认是全对
init()
/**  2、点击开始答题 */
$('#answerBtn').click(() => {
  $('#indexPage').hide()
  $('#questionPage').show()
  showNewQuestion()
})
/** 3、答错了，初始化代码*/
$('#errorBox').click(() => init())
/**  4、全部答对，点击跳转*/
$('#successBox').click(() => {
  window.location.href = "https://hd.webportal.top/17008860/bNFWOD5mtm5pAmVTStqfzQ/load.html?style=115&editQrcode=true&_source=1"
})

