import axios from 'axios'

const getDataPage = async (data: any) => {
  const { limit, skip } = data
  const rs = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=title,price`)

  return rs.data
}

export { getDataPage }
