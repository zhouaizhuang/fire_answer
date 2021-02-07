function addZero(str, num) {
  return (Array(num+1).join('0') + str).slice(-num)
}
/**
 * 随机选出10道题目---采用洗牌算法
 * @param {*} arr 需要清洗的数组数据
 * @param {*} num 清洗后立即摸牌数量。当num为-1返回全部洗好的牌，否则返回摸取得num张牌
 * @举例  shuffle([1,2,3,4], 2)  // 可能得到的结果：[3, 1]
 */
function shuffle(arr, num = -1) {
  let n = arr.length, random
  while(0!=n){
    random = (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整
    [arr[n], arr[random]] = [arr[random], arr[n]] // ES6的结构赋值实现变量互换
  }
  return num > 0 ? arr.slice(0, num) : arr
}
// 获取随机新的10条考题。每种难度各两题，难度按顺序递增
function getNewQuestionArr() {
  return [
    ...shuffle(level0, 2), // 幼儿园难度
    ...shuffle(level1, 1), // 小学难度
    ...shuffle(level2, 1), // 中学难度
    ...shuffle(level3, 1), // 大学难度
    ...shuffle(level4, 1) // 家庭难度
  ].map((item, index) => ({ ...item, index: index + 1 }))
}
/**
 * 计算距离预期时间还剩多长时间
 * @param {*} time 截止时间
 * @param {*} id DOM id
 * 调用方式  需要传入  结束时间   和 倒计时内容所在的id名称
 * countTime('2020-02-01 09:00:00', 'timeBox')
 */
function countTime(time, id) {
  var date = new Date()
  var now = date.getTime()
  var endDate = new Date(time)//设置截止时间
  var end = endDate.getTime()
  var leftTime = end - now //时间差
  var s, ms
  if(leftTime >= 0) {
    s = addZero(Math.floor(leftTime / 1000 % 60), 2)
    ms = addZero(Math.floor(leftTime % 1000), 3).slice(0, 2)
    $(id).html(`${s}.${ms}`)
  } else {
    $(id).html('时间到')
    isAllCurrect = false
    // 未答本题，应该把所有选项的点击事件取消。不允许点击了
    $(`#qsA`).unbind()
    $(`#qsB`).unbind()
    $(`#qsC`).unbind()
    $(`#qsD`).unbind()
    const { answer } = curQs // 当前题目
    $(`#icon${answer}`).addClass('successIcon') // 显示正确图标
    $(`#qs${answer}`).addClass('bg7abd3b flash') // 显示绿色背景
    if(questionArr.length === 0) { // 表明当前是最后一条题目
      setTimeout(() => {
        $('#resultBox').show() // 显示结果盒子
        $('#errorBox').show() // 显示再试一次
      }, 1500)
    } else {
      setTimeout(() => showNewQuestion(), 1500) // 跳到下一题
    }
  }
  return leftTime // 将时间差返回
}
// 得到当前时间之后60秒的时间
function afterNsecond(after = 60) {
  const dt = new Date()
  return new Date(dt.getTime() + after * 1000)
}
// 初始化，显示出首页
function init() {
  $('#indexPage').show()
  $('#questionPage').hide()
  $('#resultBox').hide() // 显示结果盒子
  $('#errorBox').hide() // 显示再试一次
  $('#successBox').hide() // 显示再试一次
  isAllCurrect = true
  questionArr = getNewQuestionArr() // 拿到十道题目
  // console.log(questionArr)
}
// 获取并显示当前的题目
function showNewQuestion() {
  // 1、计时器60s开始
  clearInterval(timeId)
  const newTime = afterNsecond(20) // 默认获取20s之后的时间
  timeId = setInterval(() => countTime(newTime, '#timeBox') < 0 && clearInterval(timeId), 50) // 定时器倒计时
  // 2、当前获取的题目
  curQs = questionArr.shift()
  let { index, answer, options, question } = curQs
  answer = (answer || '').replace(/(^\s*)|(\s*$)/g, '')
  $('#qsIndex').html(index) // 序号
  $("#qsBox").empty() // 将题目盒子清空
  // append追加渲染出题目
  $("#qsBox").append(`<div class='gf pb40r' id="qsTitle">${index}. ${question}</div>`)
  // append追加渲染出题目的选项
  options.forEach(item => {
    let { label, desc } = item
    label = (label || '').replace(/(^\s*)|(\s*$)/g, '')
    const selectDom = `<div class='w70 rel rds25r bgf auto pl20r pr20r pt15r pb15r mb30r tl' id="qs${label}">
      ${label}、${desc}
      <div class='dn' id="icon${label}"></div>
    </div>`
    $("#qsBox").append(selectDom) // 将选项放道页面中
    // 各个按钮的点击事件
    $(`#qs${label}`).click(() => {
      clearInterval(timeId)
      $(`#icon${label}`).show()
      if(answer === label) { // 答对了
        $(`#icon${label}`).addClass('successIcon') // 显示正确图标
        $(`#qs${label}`).addClass('bg7abd3b scaleAnimate') // 显示绿色背景
      } else {
        $(`#icon${label}`).addClass('errorIcon') // 显示错误图标
        $(`#qs${label}`).addClass('bgfd2f2d shake') // 显示红色背景
        $(`#icon${answer}`).show() // 显示正确答案的正确图标
        $(`#icon${answer}`).addClass('successIcon') // 显示正确图标
        $(`#qs${answer}`).addClass('bg7abd3b') // 显示正确答案的绿色背景
        isAllCurrect = false
      }
      // 答完本题，就应该把所有选项的点击事件取消。避免二次点击
      $(`#qsA`).unbind()
      $(`#qsB`).unbind()
      $(`#qsC`).unbind()
      $(`#qsD`).unbind()
      // 当前题号已经等于6
      if(index === 6) {
        if(isAllCurrect) { // 全对
          $('#resultBox').show() // 显示结果盒子
          $('#successBox').show() // 显示进入抽奖
        } else { // 有错的
          setTimeout(() => {
            $('#resultBox').show() // 显示结果盒子
            $('#errorBox').show() // 显示再试一次
          }, 1500)
        }
      } else {
        let time = answer === label ? 800 : 1500
        setTimeout(() => showNewQuestion(), time)
      }
    })
  })
}