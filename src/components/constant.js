import moment from "moment";

export const map = {
  'address': '活动地点',
  'college': '举办单位',
  'view': '浏览量',
  'subscribe': '订阅量',
}
export const tag_list = [
  "全选","招新","招聘","学工","社团","学术","讲座","志愿","人物","创业","科技","文艺","体育"
]

export const getFormatTime = (activity) => {
  let time = '';
  if (activity.startDate) {
    time = activity.startDate;
    if (activity.startTime) {
      time += ' ' + activity.startTime;
    }
    if (activity.endDate) {
      if (activity.startDate !== activity.endDate) {
        time += ' - ' + activity.endDate;
        if (activity.endTime) {
          time += ' ' + activity.endTime;
        }
      } else {
        if (activity.endTime) {
          time += ' - ' + activity.endTime;
        }
      }
    }
  }
  return time;
}

export const getTagList = (tag) => {
  return tag.split('+');
}

// 如果是过去，返回false，大于等于今天返回true
export const checkDate = (date) => {
  let nowDate = moment().format('YYYY-MM-DD');
  if (date >= nowDate) {
    return true;
  } else {
    return false;
  }
}

export const themes = [{label:'Light',value:'fantasy'},{label:'Dark',value:'dark'},{label:'Lemonade',value:'lemonade'},{label:'Luxury',value:'luxury'}];

export const problemList = [
  ["校园内的自习地点","周二第5节理教107在上什么课","介绍一下博雅塔","最近学校里面有哪些讲座活动","如何找实习信息"],
  ["今日北京天气","今日黄历","今日早报","美元兑人民币实时汇率"],
]

export default { map,tag_list,getFormatTime,getTagList,checkDate,themes,problemList }