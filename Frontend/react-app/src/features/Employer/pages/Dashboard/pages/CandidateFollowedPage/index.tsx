import { Col, Input, Pagination, Row } from 'antd'
import '../FindCandidatePage/style.scss'

import CandidateItem from '../FindCandidatePage/components/CandidateItem/CandidateItem'
import { useEffect, useState } from 'react'
import apiTrackedCanddiate, { RequestTrackedCandidateType } from '~/api/trackedCandidate.api'
import { FiSearch } from 'react-icons/fi'
import { NotifyState } from '~/components/Header/NotifyDrawer/notifySlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
interface AnyTypeCandidate {
  [key: string]: any
}
const CandidateFollowedPage = () => {
  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  //search
  const [name, setName] = useState('')
  //page
  const [listCandidate, setListCandidate] = useState<AnyTypeCandidate[]>([])
  const [pageClick, setPageClick] = useState(1)
  const limitOnPage = 2
  const [totalItems, setTotalItems] = useState(2)
  //
  //set value page click
  const handleChangePage = async (valuePageClick: any) => {
    setPageClick(valuePageClick)
    await fetchGetData(valuePageClick)
  }
  useEffect(() => {
    if (notificaions.page > 0) fetchGetData(pageClick.toString())
  }, [notificaions.notifications])
  useEffect(() => {
    setPageClick(1)
    fetchGetData()
  }, [name])
  const fetchGetData = async (page?: string) => {
    let request: RequestTrackedCandidateType = {
      limit: limitOnPage.toString(),
      page: page ? page : '1',
      name: name
    }
    await apiTrackedCanddiate.getAllByMe(request).then((rs) => {
      setListCandidate(rs.result.list)
      setTotalItems(rs.result.total)
    })
  }
  return (
    <div className='find-candidate-page-container'>
      <div className='title'>Danh Sách Đang Theo Dõi</div>
      <Row className='btn-filter-container'>
        <Col md={12} sm={24} xs={24}>
          <Input
            prefix={<FiSearch />}
            size='large'
            allowClear
            onChange={(e) => setName(e.target.value)}
            placeholder='Tìm theo tên'
          />
        </Col>
      </Row>
      <div className='content-wapper'>
        {listCandidate ? (
          <>
            <div className='total-search'>{`${listCandidate.length} kết quả được tìm thấy`}</div>

            {listCandidate.map((candidate) => (
              <CandidateItem
                key={candidate._id}
                data={{
                  id: candidate.candidate_id,
                  cv_id: candidate.candidate.cv_id,
                  avatar: candidate.cv_info.avatar,
                  nameCandidate: `${candidate.candidate_name}`,
                  jobTitle: candidate.cv_info.wanted_job_title,
                  educationLevel: candidate.candidate.education_level,
                  provinceWanted: candidate.candidate.work_location,
                  expYear: candidate.candidate.experience,

                  updateDate: candidate.cv_info.updated_at.toString().slice(0, 10)
                }}
                hideFollow={true}
              />
            ))}

            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
              <Pagination
                current={pageClick}
                onChange={handleChangePage}
                responsive
                defaultCurrent={1}
                pageSize={limitOnPage}
                showSizeChanger={false}
                total={totalItems}
              />
            </div>
          </>
        ) : (
          <>
            <div className='total-search'>{`0 kết quả được tìm thấy`}</div>
            <div>Không tìm thấy ứng viên</div>
          </>
        )}
      </div>
    </div>
  )
}

export default CandidateFollowedPage
