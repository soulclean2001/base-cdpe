import './style.scss'
const Overview = () => {
  return (
    <div className='overview-container'>
      <div className='title'>Tổng Quan</div>
      <div className='history-actions-container'>
        <div className='title_2'>Hoạt Động Của Bạn</div>
        <div className='history-actions-content'>
          <div className='chart-history-container'>
            <div className='chart'>Biểu đồ</div>
            <div className='chart-symbol'>Ký hiệu</div>
          </div>
          <div className='count-history-container'>
            <div className='item-history'>
              <div className='count-number'>1</div>
              <div className='label-history'>Việc làm đã ứng tuyển</div>
            </div>
            <div className='item-history'>
              <div className='count-number'>1</div>
              <div className='label-history'>Lượt xem việc làm</div>
            </div>
            <div className='item-history'>
              <div className='count-number'>1</div>
              <div className='label-history'>Lượt tìm việc làm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
