import { useEffect, useState } from 'react'
import apiOverview, { RequestOverview } from '~/api/statistics.api'
import apiCompany from '~/api/company.api'
import 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2'
import { Col, Row, Table, Tooltip as ToolTipAntd } from 'antd'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { DatePicker, Radio, Select } from 'antd'
import { RadioChangeEvent } from 'antd/lib'
import { labelsOneYear, labelsTenYearBeforeToNow, getTenYearBeforeToNow } from '~/features/Admin/contents/Overview'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Biểu đồ chi tiêu'
    }
  },
  scales: {
    y: {
      min: 0
    }
  }
}
export const options2 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Biểu đồ tuyển dụng'
    }
  },
  scales: {
    y: {
      min: 0,
      grace: '100%',
      ticks: {
        stepSize: 1
      }
    }
    // x: {
    //   beginAtZero: true,
    //   ticks: {
    //     beginAtZero: true,
    //     mirror: false,
    //     suggestedMin: 0
    //   }
    // }
  }
}
interface DataType {
  id: string
  jobTitle: string
  level: string
  type: string
  rangeSalary: string
  createdAt: string
  expiresDate: string
  totalApplications: number
}
interface AnyType {
  [key: string]: any
}
const OverviewEmployer = () => {
  const [type, setType] = useState(1)
  const [isShowSeletect, setIsShowSeletect] = useState(true)
  const [typeChart, setTypeChart] = useState('Bar')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [year2, setYear2] = useState(new Date().getFullYear().toString())
  const [typeChart2, setTypeChart2] = useState('Bar')
  const [dataStatus0, setDataStatus0] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [dataStatus1, setDataStatus1] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [dataStatus2, setDataStatus2] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [dataStatus3, setDataStatus3] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [dataStatus4, setDataStatus4] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [dataStatus5, setDataStatus5] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  // const [dataStatus6, setDataStatus6] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [dataStatus7, setDataStatus7] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [bottomScell, setBottomScell] = useState<string[]>(labelsOneYear)
  const [dataSales, setDataSales] = useState<string[]>([])
  const [dataTop10, setDataTop10] = useState<DataType[]>([])
  const [dataOverview, setDataOverview] = useState({
    totalSales: 0,
    totalPosts: 0,
    totalPostPublish: 0,
    totalJobApplications: 0,
    totalCanPost: 0
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
    fetchData()
  }, [])
  useEffect(() => {
    handleSetChartLayout()
    fetchChart()
  }, [isShowSeletect, year])
  useEffect(() => {
    fetchChart2()
  }, [year2])
  const fetchChart = async () => {
    if (isShowSeletect) {
      let tempt: string[] = []
      for (let i = 1; i < 13; ++i) {
        let requestOneMonth: RequestOverview = { month: i, year: year }

        await apiOverview.getSalesByEmployer(requestOneMonth).then((rs) => {
          tempt.push(rs.result.toString())
        })
      }
      setDataSales(tempt)
    } else {
      let tempt: string[] = []
      let tenYearAgo = new Date().getFullYear() - 10
      for (let i = tenYearAgo; i <= tenYearAgo + 10; ++i) {
        let request: RequestOverview = { month: '', year: i }
        await apiOverview.getSalesByEmployer(request).then((rs) => {
          tempt.push(rs.result.toString())
        })
      }
      setDataSales(tempt)
    }
  }
  const fetchChart2 = async () => {
    let tempt0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let tempt1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let tempt2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let tempt3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let tempt4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let tempt5 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // let tempt6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let tempt7 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 1; i < 13; ++i) {
      let requestOneMonth: RequestOverview = { month: i, year: year2 }
      await apiOverview.getSummaryJobApplications(requestOneMonth).then((rs) => {
        if (rs.result && rs.result['0'] !== undefined) {
          tempt0[i - 1] = rs.result['0']
          tempt1[i - 1] = rs.result['1']
          tempt2[i - 1] = rs.result['2']
          tempt3[i - 1] = rs.result['3']
          tempt4[i - 1] = rs.result['4']
          tempt5[i - 1] = rs.result['5']
          // tempt6[i - 1] = rs.result['6']
          tempt7[i - 1] = rs.result['7']
        }
      })
    }

    setDataStatus0(tempt0)
    setDataStatus1(tempt1)
    setDataStatus2(tempt2)
    setDataStatus3(tempt3)
    setDataStatus4(tempt4)
    setDataStatus5(tempt5)
    // setDataStatus6(tempt1)
    setDataStatus7(tempt7)
  }
  const fetchData = async () => {
    let param: RequestOverview = { month: '', year: '' }
    let temptOverview = {
      totalSales: 0,
      totalPosts: 0,
      totalPostPublish: 0,
      totalJobApplications: 0,
      totalCanPost: 0
    }

    await apiCompany.getMyCompany().then((rs) => {
      temptOverview = { ...temptOverview, ['totalCanPost']: rs.result.number_of_posts }
    })
    await apiOverview.getSalesByEmployer(param).then((rs) => {
      temptOverview = { ...temptOverview, ['totalSales']: rs.result }
    })
    await apiOverview.getTotalJobs().then((rs) => {
      temptOverview = { ...temptOverview, ['totalPosts']: rs.result }
    })
    await apiOverview.getTotalJobs(1).then((rs) => {
      temptOverview = { ...temptOverview, ['totalPostPublish']: rs.result }
    })
    await apiOverview.getTotalJobApplications().then((rs) => {
      temptOverview = { ...temptOverview, ['totalJobApplications']: rs.result }
    })
    setDataOverview(temptOverview)
    await apiOverview.getTop10JobsMostAppli().then((rs) => {
      let tempt: DataType[] = []
      rs.result.map((job: AnyType) => {
        if (job.total_job_applications > 0) {
          tempt.push({
            id: job._id,
            jobTitle: job.job_title,
            level: job.job_level,
            type: job.job_type,
            rangeSalary: `${job.salary_range.min.toLocaleString('vi', {
              currency: 'VND'
            })} - ${job.salary_range.max.toLocaleString('vi', {
              currency: 'VND'
            })}`,
            createdAt: job.created_at.slice(0, 10),
            expiresDate: job.expired_date.slice(0, 10),
            totalApplications: job.total_job_applications
          })
        }
      })

      setDataTop10(tempt)
    })
  }
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_, { id }) => <>#POST_{id ? id.slice(-5).toUpperCase() : ''}</>
    },
    {
      title: 'Tên công việc',
      dataIndex: 'jobTitle',
      key: 'jobTitle'
    },
    {
      title: 'Cấp bậc',
      dataIndex: 'level',
      key: 'level'
    },
    {
      title: 'Loại công việc',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Mức lương',
      dataIndex: 'rangeSalary',
      key: 'rangeSalary',
      render: (_, { rangeSalary }) => <>{rangeSalary}</>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiresDate',
      key: 'expiresDate'
    },
    {
      align: 'center',
      title: 'Số lượng ứng tuyển',
      dataIndex: 'totalApplications',
      key: 'totalApplications'
    }
  ]

  return (
    <Row className='admin-overview-page-container '>
      <Col md={24} sm={24} xs={24} className='overview-wapper'>
        <h2>TỔNG QUAN</h2>
        <Row className='list-item'>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Tổng thanh toán</div>
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
              <div className='title'>Tổng số bài đăng</div>
              <div className='value'>{dataOverview.totalPosts}</div>
            </div>
          </Col>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Bài đăng công khai</div>
              <div className='value'>{dataOverview.totalPostPublish}</div>
            </div>
          </Col>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Lượt đăng bài</div>
              <div className='value'>{dataOverview.totalCanPost}</div>
            </div>
          </Col>
          <Col lg={6} md={11} sm={11} xs={24} className='item'>
            <div className='content'>
              <div className='title'>Số đơn ứng tuyển</div>
              <div className='value'>{dataOverview.totalJobApplications}</div>
            </div>
          </Col>
        </Row>
      </Col>
      <Col md={24} sm={24} xs={24} className='table-top-wapper'>
        <h2>TOP VIỆC LÀM CÓ LƯỢT ỨNG TUYỂN NHIỀU NHẤT</h2>
        <div className='top-order-wapper'>
          {dataTop10.length > 0 && (
            <Table
              style={{ width: '100%' }}
              pagination={false}
              rowKey={'id'}
              columns={columns}
              dataSource={dataTop10}
            />
          )}
        </div>
      </Col>

      <Col md={24} sm={24} xs={24} className='chart-wapper'>
        <div className='chart-header'>
          <h2>BIỂU ĐỒ CHI TIÊU</h2>
          <Radio.Group onChange={onChange} value={type}>
            {/* {dataSales.map((data, index) => (
              <div key={index}>{data}</div>
            ))} */}
            <Radio value={1}>Từng năm</Radio>
            <Radio value={2}>10 năm gần nhất</Radio>
          </Radio.Group>
          <div className='select-wapper' style={{ display: 'flex', gap: '10px' }}>
            <div hidden={!isShowSeletect}>
              <DatePicker
                allowClear={false}
                // defaultValue={dayjs(`${new Date().getFullYear()}-01-01`, 'YYYY-MM-DD')}
                // value={dayjs(`${year}-01-01`, 'YYYY-MM-DD')}
                value={dayjs(`${year}-01-01`, 'YYYY-MM-DD')}
                // defaultPickerValue={dayjs(`${new Date().getFullYear()}-01-01`, 'YYYY-MM-DD')}
                size='large'
                onChange={(_, string) => setYear(string ? string : new Date().getFullYear().toString())}
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
                    label: 'Chi tiêu',
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
                    label: 'Chi tiêu',
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
                    label: 'Chi tiêu',
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
      <Col md={24} sm={24} xs={24} className='chart-wapper'>
        <div className='chart-header'>
          <h2>BIỂU ĐỒ TUYỂN DỤNG</h2>
          <Radio.Group onChange={onChange} value={type}>
            <Radio value={1}>Từng năm</Radio>
            {/* <Radio value={2}>10 năm gần nhất</Radio> */}
          </Radio.Group>
          <div className='select-wapper' style={{ display: 'flex', gap: '10px' }}>
            <div hidden={!isShowSeletect}>
              <DatePicker
                allowClear={false}
                value={dayjs(`${year2}-01-01`, 'YYYY-MM-DD')}
                size='large'
                onChange={(_, string) => setYear2(string ? string : new Date().getFullYear().toString())}
                picker='year'
                placeholder='Chọn năm'
              />
            </div>
            <ToolTipAntd title='Loại biểu đồ'>
              <Select
                onChange={(value) => setTypeChart2(value)}
                size='large'
                defaultValue='Bar'
                options={[
                  { value: 'Bar', label: 'Bar' },
                  { value: 'Line', label: 'Line' }
                  // { value: 'Area', label: 'Area' }
                  // { value: 'Pie', label: 'Pie' },
                  // { value: 'Doughnut', label: 'Doughnut' }
                ]}
              />
            </ToolTipAntd>
          </div>
        </div>
        <div className='chart'>
          {typeChart2 === 'Bar' && (
            <Bar
              options={options2}
              data={{
                labels: labelsOneYear,
                datasets: [
                  {
                    label: 'Chờ duyệt',
                    data: dataStatus0,
                    backgroundColor: 'rgb(239, 223, 82)',
                    minBarLength: 3
                  },
                  {
                    label: 'Chấp nhận CV',
                    data: dataStatus1,
                    backgroundColor: 'rgb(86, 240, 0)',
                    minBarLength: 3
                  },
                  {
                    label: 'Từ chối',
                    data: dataStatus2,
                    backgroundColor: 'rgb(255, 56, 56)',
                    minBarLength: 3
                  },
                  {
                    label: 'Tiềm năng',
                    data: dataStatus3,
                    backgroundColor: 'rgb(255, 179, 2)',
                    minBarLength: 3
                  },
                  {
                    label: 'Phỏng vấn',
                    data: dataStatus4,
                    backgroundColor: 'rgb(89, 83, 152)',
                    minBarLength: 3
                  },
                  {
                    label: 'Nhận việc',
                    data: dataStatus5,
                    backgroundColor: 'rgb(45, 204, 255)',
                    minBarLength: 3
                  },

                  {
                    label: 'Không thể liên hệ',
                    data: dataStatus7,
                    backgroundColor: 'rgb(164, 171, 182)',
                    minBarLength: 3
                  }
                ]
              }}
            />
          )}
          {typeChart2 === 'Line' && (
            <Line
              options={options2}
              data={{
                labels: labelsOneYear,
                datasets: [
                  {
                    label: 'Chờ duyệt',
                    data: dataStatus0,
                    backgroundColor: 'rgb(239, 223, 82)',
                    borderColor: 'rgb(239, 223, 82)'
                  },
                  {
                    label: 'Chấp nhận CV',
                    data: dataStatus1,
                    backgroundColor: 'rgb(86, 240, 0)',
                    borderColor: 'rgb(86, 240, 0)'
                  },
                  {
                    label: 'Từ chối',
                    data: dataStatus2,
                    backgroundColor: 'rgb(255, 56, 56)',
                    borderColor: 'rgb(255, 56, 56)'
                  },
                  {
                    label: 'Tiềm năng',
                    data: dataStatus3,
                    backgroundColor: 'rgb(255, 179, 2)',
                    borderColor: 'rgb(255, 179, 2)'
                  },
                  {
                    label: 'Phỏng vấn',
                    data: dataStatus4,
                    backgroundColor: 'rgb(89, 83, 152)',
                    borderColor: 'rgb(89, 83, 152)'
                  },
                  {
                    label: 'Nhận việc',
                    data: dataStatus5,
                    backgroundColor: 'rgb(45, 204, 255)',
                    borderColor: 'rgb(45, 204, 255)'
                  },

                  {
                    label: 'Không thể liên hệ',
                    data: dataStatus7,
                    backgroundColor: 'rgb(164, 171, 182)',
                    borderColor: 'rgb(164, 171, 182)'
                  }
                ]
              }}
            />
          )}
          {/* {typeChart2 === 'Area' && (
            <Line
              options={options2}
              data={{
                labels: labelsOneYear,
                datasets: [
                  {
                    label: 'Chờ duyệt',
                    data: dataStatus0,
                    backgroundColor: 'rgb(239, 223, 82)'
                  },
                  {
                    label: 'Chấp nhận CV',
                    data: dataStatus1,
                    backgroundColor: 'rgb(143, 243, 89)'
                  },
                  {
                    label: 'Từ chối',
                    data: dataStatus2,
                    backgroundColor: 'rgb(255, 56, 56)'
                  },
                  {
                    label: 'Tiềm năng',
                    data: dataStatus3,
                    backgroundColor: 'rgb(255, 179, 2)'
                  },
                  {
                    label: 'Phỏng vấn',
                    data: dataStatus4,
                    backgroundColor: 'rgb(89, 83, 152)'
                  },
                  {
                    label: 'Nhận việc',
                    data: dataStatus5,
                    backgroundColor: 'rgb(45, 204, 255)'
                  },

                  {
                    label: 'Không thể liên hệ',
                    data: dataStatus7,
                    backgroundColor: 'rgb(164, 171, 182)'
                  }
                ]
              }}
            />
          )} */}
        </div>
      </Col>
    </Row>
  )
}

export default OverviewEmployer
