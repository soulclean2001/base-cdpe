import { useEffect, useState } from 'react'
import ReactHtmlParser from 'html-react-parser'
import './style.scss'
import { BsFillCalendarCheckFill, BsFillInboxesFill } from 'react-icons/bs'
import { SiLevelsdotfyi } from 'react-icons/si'
import { Col, Row } from 'antd'
import { MdWork } from 'react-icons/md'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
// const descriptionsData = ` • Truyền thông hiệu quả EVP của Golden Gate đến các ứng viên tiềm năng với chiến lược đa kênh nhất quán.\n Chịu trách nhiệm quản lý hệ thống các kênh tuyển dụng số bao gồm: website, fanpage, tiktok, linkedin... để đăng tải thông tin, quảng cáo, duy trì, cập nhật nội dung và ý kiến phản hồi của ứng viên\n • Phụ trách xây dựng/ thiết kế hình ảnh sáng tạo để quảng bá tuyển dụng & đẩy mạnh thương hiệu tuyển dụng`
// const requirementsData = `• Truyền thông hiệu quả EVP của Golden Gate đến các ứng viên tiềm năng với chiến lược đa kênh nhất quán. Chịu trách nhiệm quản lý hệ thống các kênh tuyển dụng số bao gồm: website, fanpage, tiktok, linkedin... để đăng tải thông tin, quảng cáo, duy trì, cập nhật nội dung và ý kiến phản hồi của ứng viên

// • Phụ trách xây dựng/ thiết kế hình ảnh sáng tạo để quảng bá tuyển dụng & đẩy mạnh thương hiệu tuyển dụng

// • Nâng cao nhận thức về thương hiệu, thu hút người theo dõi thương hiệu, quản lý thương hiệu và sự hiện diện của Golden Gate với tư cách là một nhà tuyển dụng chuyên nghiệp, hấp dẫn trên các kênh

// • Lên kế hoạch và tổ chức tham gia các sự kiện ngày hội Tuyển dụng tại các trường Đại học.

// • Phối hợp cùng phòng Marketing và team tuyển dụng triển khai các chiến dịch quảng bá và đẩy mạnh thương hiệu tuyển dụng

// • Tham gia vào các dự án nâng cao trải nghiệm ứng viên/nhân viên cùng với các bộ phận chức năng của Nhân sự

// • Thực hiện báo cáo, đánh giá các hoạt động truyền thông, các chuỗi nội dung đã thực hiện và đề xuất những phương án hoặc hành động tiếp theo

// • Các công việc khác theo yêu cầu của Quản lý`
interface JobInfoType {
  description: string
  requirement: string
  skills: string[]
  benefits: { type: string; value: string }[]
  working_locations: WorkingLocation[]
  created_at: string
  job_level: string
  industries: string[]
  application_email: string
}
interface PropsType {
  data: JobInfoType
}
const JobInfo = (props: any) => {
  const { data }: PropsType = props
  // const [descriptions, setDescriptions] = useState([''])
  // const [requirements, setRequirements] = useState([''])
  // useEffect(() => {
  //   if (data) handleFormatInfo()
  // }, [data])
  // const handleFormatInfo = () => {
  //   if (data.description) {
  //     setDescriptions(data.description.split('\n'))
  //   }
  //   if (data.requirement) setRequirements(data.requirement.split('\n'))
  // }
  return (
    <Row className='info-container'>
      <Col lg={6} md={8} sm={24} xs={24} className='content-right'>
        <div className='item-container created-date-container'>
          <div className='icon'>
            <BsFillCalendarCheckFill />
          </div>
          <div className='item-content created-date-content'>
            <div className='label'>NGÀY ĐĂNG TUYỂN</div>
            <div className='data created-date'>{data.created_at}</div>
          </div>
        </div>

        <div className='item-container level-container'>
          <div className='icon'>
            <SiLevelsdotfyi />
          </div>
          <div className='item-content level-content'>
            <div className='label'>CẤP BẬT</div>
            <div className='data level'>{data.job_level}</div>
          </div>
        </div>

        <div className='item-container career-container'>
          <div className='icon'>
            <BsFillInboxesFill />
          </div>
          <div className='item-content career-content'>
            <div className='label'>NGÀNH NGHỀ</div>
            <div className='data career'>{data.industries && data.industries.join(', ')}</div>
          </div>
        </div>

        {/* <div className='item-container career-container'>
          <div className='icon'>
            <MdWork />
          </div>
          <div className='item-content field-content'>
            <div className='label'>LĨNH VỰC</div>
            <div className='data fields'>Dịch vụ lưu trú/Nhà hàng/Khách sạn/Du lịch</div>
          </div>
        </div> */}

        <div className='item-container career-container'>
          <div className='icon'>
            <MdWork />
          </div>
          <div className='item-content skills-content'>
            <div className='label'>KỸ NĂNG</div>
            <div className='data skills'>{data.skills && data.skills.join(', ')}</div>
          </div>
        </div>
      </Col>
      <Col lg={17} md={15} sm={24} xs={24} className='content-left'>
        <div className='descriptions'>
          <h2>MÔ TẢ CÔNG VIỆC</h2>
          <div className='preview__info' style={{ color: 'black', maxWidth: '100%', wordBreak: 'break-word' }}>
            {data.description && ReactHtmlParser(data.description)}
          </div>
          {/* {descriptions &&
            descriptions.map((item, index) => (
              <div key={index} className='info'>
                {item}
              </div>
            ))} */}
        </div>
        <div className='requirements'>
          <h2>YÊU CẦU CÔNG VIỆC</h2>
          <div className='preview__info' style={{ color: 'black', maxWidth: '100%', wordBreak: 'break-word' }}>
            {data.requirement && ReactHtmlParser(data.requirement)}
          </div>
          {/* {requirements &&
            requirements.map((item, index) => (
              <div key={index} className='info'>
                {item}
              </div>
            ))} */}
        </div>
        <div className='skill-requirements'>
          <h2>YÊU CẦU KỸ NĂNG</h2>
          {data.skills &&
            data.skills.map((skill, index) => (
              <div key={index} className='info'>
                {skill}
              </div>
            ))}
        </div>

        <div className='benefit'>
          <h2>CÁC PHÚC LỢI DÀNH CHO BẠN</h2>
          {data.benefits &&
            data.benefits.map((benefit, index) => (
              <div key={index} className='info'>{`${benefit.type}: ${benefit.value}`}</div>
            ))}
        </div>
        <div className='working-address'>
          <h2>ĐỊA ĐIỂM LÀM VIỆC</h2>
          {data.working_locations &&
            data.working_locations.map((location, index) => (
              <div
                key={index}
                className='info'
              >{`${location.address}, ${location.district}, ${location.city_name}`}</div>
            ))}
        </div>
        <div className='working-address'>
          <h2>Email nhận hồ sơ</h2>
          {data.application_email && <div className='info'>{data.application_email}</div>}
        </div>
      </Col>
    </Row>
  )
}

export default JobInfo
