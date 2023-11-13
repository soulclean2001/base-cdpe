import { useEffect } from 'react'
import apiStatistics, { RequestOverview } from '~/api/statistics.api'

const AdminOverview = () => {
  useEffect(() => {
    fetchGetOverview()
  }, [])
  const fetchGetOverview = async () => {
    let request: RequestOverview = { month: '', year: '' }
    await apiStatistics.getSumary(request).then((rs) => {
      console.log('sumary', rs)
    })
    await apiStatistics.getSales(request).then((rs) => {
      console.log('sales', rs)
    })
  }

  return <div>AdminDashboard</div>
}

export default AdminOverview
