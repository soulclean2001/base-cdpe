import JobItem from '../../../../Components/JobItem/JobItem'
import './style.scss'

const ShowMoreJob = () => {
  const customStyleItem = {
    backgroundColorBeforeHover: 'white',
    backgroundColorAfterHover: 'rgb(239, 245, 255)',
    borderBefore: '1px solid rgb(241, 241, 241)',
    borderAfter: '1px solid rgb(160, 193, 255)'
  }
  return (
    <div className='tab-show-more-job-container'>
      <JobItem style={customStyleItem} customHover={true} />
    </div>
  )
}

export default ShowMoreJob
