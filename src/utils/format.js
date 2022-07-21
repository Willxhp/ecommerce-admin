// 本模块用于格式化日期
import dayjs from 'dayjs'

export default dataObj => {
  return dayjs(dataObj).format('YYYY-MM-DD HH:mm:ss')
}