import { useEffect, useState } from 'react'
import apiStatistics, { RequestOverview } from '~/api/statistics.api'
import 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2'
import { Avatar, Col, Row, Tooltip as ToolTipAntd } from 'antd'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { DatePicker, Radio, Select } from 'antd'
import { RadioChangeEvent } from 'antd/lib'
import { FaCrown } from 'react-icons/fa'
import './style.scss'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Biểu đồ doanh thu bán hàng'
    }
  }
}

const labelsOneYear = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12'
]
const labelsTenYearBeforeToNow: string[] = []
const getTenYearBeforeToNow = (year: number) => {
  // let tenYearAgo = new Date().getFullYear() - 10
  let tenYearAgo = year - 10
  for (let i = tenYearAgo; i <= tenYearAgo + 10; ++i) {
    labelsTenYearBeforeToNow.push(i.toString())
  }
}
interface AnyType {
  [key: string]: any
}
const AdminOverview = () => {
  const [typeChart, setTypeChart] = useState('Bar')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [type, setType] = useState(1)
  const [isShowSeletect, setIsShowSeletect] = useState(true)
  const [bottomScell, setBottomScell] = useState<string[]>(labelsOneYear)
  const [dataTopOrders, setDataTopOrders] = useState<AnyType[]>([])
  const [dataTopPosts, setDataTopPosts] = useState<AnyType[]>([])
  const [dataSales, setDataSales] = useState<string[]>([])
  const [dataOverview, setDataOverview] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalOrdersSuccess: 0,
    totalJob: 0,
    totalCompany: 0
  })
  const onChange = (e: RadioChangeEvent) => {
    setType(e.target.value)
    if (e.target.value === 2) setIsShowSeletect(false)
    else setIsShowSeletect(true)
  }
  const handleSetChartLayout = () => {
    if (!isShowSeletect) {
      if (labelsTenYearBeforeToNow.length < 1) getTenYearBeforeToNow(new Date().getFullYear())
      setBottomScell(labelsTenYearBeforeToNow)
    } else setBottomScell(labelsOneYear)
  }
  useEffect(() => {
    handleSetChartLayout()
    fetchChart()
  }, [isShowSeletect, year])

  useEffect(() => {
    fetchGetOverview()
  }, [])
  const fetchChart = async () => {
    if (isShowSeletect) {
      let tempt: string[] = []
      for (let i = 1; i < 13; ++i) {
        let requestOneMonth: RequestOverview = { month: i, year: year }

        await apiStatistics.getSales(requestOneMonth).then((rs) => {
          tempt.push(rs.result.toString())
        })
      }
      setDataSales(tempt)
    } else {
      let tempt: string[] = []
      let tenYearAgo = new Date().getFullYear() - 10
      for (let i = tenYearAgo; i <= tenYearAgo + 10; ++i) {
        let request: RequestOverview = { month: '', year: i }
        await apiStatistics.getSales(request).then((rs) => {
          tempt.push(rs.result.toString())
        })
      }
      setDataSales(tempt)
    }
  }
  const fetchGetOverview = async () => {
    let request: RequestOverview = { month: '', year: '' }
    let dataTempt = {
      totalSales: 0,
      totalOrders: 0,
      totalOrdersSuccess: 0,
      totalJob: 0,
      totalCompany: 0
    }
    await apiStatistics.getTop10RankCompanyMostJobs(request).then((rs) => {
      console.log('top 10 company jobs', rs)
      setDataTopPosts(rs.result)
    })
    await apiStatistics.getTop10RankCompanyMostOrders(request).then((rs) => {
      console.log('top 10 company orders', rs)
      setDataTopOrders(rs.result)
    })
    await apiStatistics.getSales(request).then((rs) => {
      dataTempt = { ...dataTempt, ['totalSales']: rs.result }
    })
    await apiStatistics.getSumary(request).then((rs) => {
      console.log('sumary', rs)
      dataTempt = {
        ...dataTempt,
        ['totalCompany']: rs.result.total_company,
        ['totalJob']: rs.result.total_job,
        ['totalOrders']: rs.result.order.all_orders,
        ['totalOrdersSuccess']: rs.result.order.success_orders
      }
    })
    setDataOverview(dataTempt)
  }

  return (
    <Row className='admin-overview-page-container '>
      <Col md={24} sm={24} xs={24} className='overview-wapper'>
        <h2>TỔNG QUAN</h2>
        <Row className='list-item'>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Tổng doanh thu</div>
              <div className='value'>
                {dataOverview.totalSales.toLocaleString('vi', {
                  currency: 'VND'
                })}{' '}
                đ
              </div>
            </div>
          </Col>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Tổng số đơn hàng</div>
              <div className='value'>{dataOverview.totalOrders}</div>
            </div>
          </Col>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Tổng số đơn hoàn tất</div>
              <div className='value'>{dataOverview.totalOrdersSuccess}</div>
            </div>
          </Col>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Tổng số bài đăng</div>
              <div className='value'>{dataOverview.totalJob}</div>
            </div>
          </Col>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Tổng số công ty</div>
              <div className='value'>{dataOverview.totalCompany}</div>
            </div>
          </Col>
        </Row>
      </Col>
      <Col md={24} sm={24} xs={24} className='table-top-wapper'>
        <h2>TOP ĐẶT HÀNG</h2>
        <div className='top-order-wapper'>
          {dataTopOrders &&
            dataTopOrders.map((comapny: AnyType, index) => (
              <div key={comapny._id} className='item-company'>
                <div
                  className={
                    index === 0
                      ? 'icon-top one'
                      : index === 1
                      ? 'icon-top two'
                      : index === 2
                      ? 'icon-top three'
                      : 'icon-top'
                  }
                >
                  {index < 3 && <FaCrown />}
                </div>
                <Avatar
                  src={comapny.company.logo ? comapny.company.logo : ''}
                  size={'large'}
                  shape='circle'
                  style={{ width: '56px', height: '56px' }}
                />
                <div className='name'>{comapny.company.company_name ? comapny.company.company_name : ''}</div>
                <div className='total'>
                  {comapny.total_price.toLocaleString('vi', {
                    currency: 'VND'
                  })}
                  đ
                </div>
              </div>
            ))}
        </div>
      </Col>
      <Col md={24} sm={24} xs={24} className='table-top-wapper'>
        <h2>TOP ĐĂNG TUYỂN</h2>
        <div className='top-order-wapper'>
          {dataTopPosts &&
            dataTopPosts.map((comapny: AnyType, index) => (
              <div key={comapny._id} className='item-company'>
                <div
                  className={
                    index === 0
                      ? 'icon-top one'
                      : index === 1
                      ? 'icon-top two'
                      : index === 2
                      ? 'icon-top three'
                      : 'icon-top'
                  }
                >
                  {index < 3 && <FaCrown />}
                </div>
                <Avatar
                  src={comapny.company.logo ? comapny.company.logo : ''}
                  size={'large'}
                  shape='circle'
                  style={{ width: '56px', height: '56px' }}
                />
                <ToolTipAntd title={comapny.company.company_name}>
                  <div className='name'>{comapny.company.company_name ? comapny.company.company_name : ''}</div>
                </ToolTipAntd>

                <div className='total'>{comapny.total} bài</div>
              </div>
            ))}
        </div>
      </Col>
      <Col md={24} sm={24} xs={24} className='chart-wapper'>
        <div className='chart-header'>
          <h2>BIỂU ĐỒ</h2>
          <Radio.Group onChange={onChange} value={type}>
            {dataSales.map((data, index) => (
              <div key={index}>{data}</div>
            ))}
            <Radio value={1}>Từng năm</Radio>
            <Radio value={2}>10 năm gần nhất</Radio>
          </Radio.Group>
          <div className='select-wapper' style={{ display: 'flex', gap: '10px' }}>
            <div hidden={!isShowSeletect}>
              <DatePicker
                allowClear={false}
                // defaultValue={dayjs(`${new Date().getFullYear()}-01-01`, 'YYYY-MM-DD')}
                // value={dayjs(`${year}-01-01`, 'YYYY-MM-DD')}
                // defaultPickerValue={dayjs(`${new Date().getFullYear()}-01-01`, 'YYYY-MM-DD')}
                size='large'
                onChange={(_, string) => setYear(string)}
                picker='year'
                placeholder='Chọn năm'
              />
            </div>
            <ToolTipAntd title='Loại biểu đồ'>
              <Select
                onChange={(value) => setTypeChart(value)}
                size='large'
                defaultValue='Bar'
                options={[
                  { value: 'Bar', label: 'Bar' },
                  { value: 'Line', label: 'Line' },
                  { value: 'Area', label: 'Area' }
                  // { value: 'Pie', label: 'Pie' },
                  // { value: 'Doughnut', label: 'Doughnut' }
                ]}
              />
            </ToolTipAntd>
          </div>
        </div>
        <div className='chart'>
          {typeChart === 'Bar' && (
            <Bar
              options={options}
              data={{
                labels: bottomScell,
                datasets: [
                  {
                    label: 'Doanh thu',
                    data: dataSales,
                    backgroundColor: 'rgba(53, 162, 235, 0.5)'
                  }
                ]
              }}
            />
          )}
          {typeChart === 'Line' && (
            <Line
              options={options}
              data={{
                labels: bottomScell,
                datasets: [
                  {
                    label: 'Doanh thu',
                    data: dataSales,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)'
                  }
                ]
              }}
            />
          )}
          {typeChart === 'Area' && (
            <Line
              options={options}
              data={{
                labels: bottomScell,
                datasets: [
                  {
                    fill: true,
                    label: 'Doanh thu',
                    data: dataSales,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)'
                  }
                ]
              }}
            />
          )}
        </div>
      </Col>
    </Row>
  )
}

export default AdminOverview
