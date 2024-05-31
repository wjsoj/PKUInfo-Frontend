import axios from "axios"
const token = import.meta.env.VITE_UMAMI_TOKEN
const websiteId = '25ac71b5-ded7-4612-8938-3a84fe76124f'
const baseURL = 'https://pkuinfo.lcpu.dev/monitor/api'
// 开发环境，需配置代理
// const baseURL = '/monitor/api'

// GET /api/websites/{websiteId}/stats/?startAt={timestamp}&endAt={timestamp}
export async function getVisitDay() {
  // endAt 当前时间，startAt 当前时间减去一天
  const endAt = Date.now()
  const startAt = endAt - 24 * 60 * 60 * 1000
  return await axios.get(`${baseURL}/websites/${websiteId}/stats/?startAt=${startAt}&endAt=${endAt}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => {
    return res.data.uniques.value
  })
}

export async function getVisitWeek() {
  const endAt = Date.now()
  const startAt = endAt - 24 * 60 * 60 * 1000 * 3
  return await axios.get(`${baseURL}/websites/${websiteId}/stats/?startAt=${startAt}&endAt=${endAt}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => {
    return res.data.pageviews.value
  })
}

export async function getVisitMonth() {
  const endAt = Date.now()
  const startAt = endAt - 24 * 60 * 60 * 1000 * 30
  return await axios.get(`${baseURL}/websites/${websiteId}/stats/?startAt=${startAt}&endAt=${endAt}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.data.uniques.value )
}