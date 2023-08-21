
import Search from '~/components/Search/Search'
import './job.scss'
import SelectSortCustom from './Components/SelectSortCustom/SelectSortCustom'


const Job = () => {
   
  return (
    <div className="job-container">
        <div className='title-job'>
            <span>Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.</span>
        </div>
        <div className="search-container">
            <Search/>
        </div>
        <div className='job-content'>
            <div className='menu-sort-job'>
              <div className='select-menu select-carrer'>
                  <SelectSortCustom/>
              </div>
              <div className= ' select-menu select-carrer-field'>
                  <SelectSortCustom/>
              </div>
              <div className='select-menu select-level'>
                  <SelectSortCustom/>
              </div>
              <div className='select-menu select-type-job'>
                  <SelectSortCustom/>
              </div>
              <div className='select-menu select-salary'>
                  <SelectSortCustom/>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Job