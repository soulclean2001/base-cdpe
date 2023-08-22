// import client from './client'
import axios from 'axios'

// export class provinces {
//   public static getProvincesApi = async () => {
//     return axios.get('https://provinces.open-api.vn/api/?depth=2')
//   }
// }

const getAllProviencesApi = async () => {
  const rs = await axios.get('https://provinces.open-api.vn/api/?depth=2')

  return rs.data
    ? rs.data.map((item: any) => ({
        value: item.name
      }))
    : []
}
const getOneProvincesApi = async (provincesName: string) => {
  const rs = await axios.get('https://provinces.open-api.vn/api/?depth=2')
  if (!rs || !rs.data) return []
  const rsFilter = rs.data.filter((item: any) => item.name === provincesName)

  return rsFilter ? rsFilter[0].districts.map((item: any) => ({ value: item.name })) : []
}
export { getAllProviencesApi, getOneProvincesApi }
