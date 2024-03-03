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

export default { map,tag_list,getFormatTime,getTagList }