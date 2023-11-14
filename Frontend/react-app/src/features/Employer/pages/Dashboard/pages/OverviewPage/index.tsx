import apiOverview, { RequestOverview } from '~/api/statistics.api'
import { useEffect } from 'react'
const OverviewEmployer = () => {
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    let param: RequestOverview = { month: '', year: '' }
    await apiOverview.getSalesByEmployer(param).then((rs) => {
      console.log('salse', rs)
    })
    await apiOverview.getTop10JobsMostAppli().then((rs) => {
      console.log('top10 app', rs)
    })
    await apiOverview.getTotalJobs().then((rs) => {
      console.log('tong create', rs)
    })
    await apiOverview.getTotalJobs(1).then((rs) => {
      console.log('total puublish', rs)
    })
  }
  return <div>overview</div>
}

export default OverviewEmployer
