import { Avatar, Button, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import ModalUpdateProfile from '../ModalUpdateProfile'

const ModalProfile = (props: any) => {
  const { openModal, handleCloseModal } = props
  const [name, setName] = useState()
  const [birthDay, setBirthDay] = useState()
  const [gender, setGender] = useState()

  const [openUpdateProfile, setOpenUpdateProfile] = useState(false)

  const handleOpenUpdateProfile = () => {
    setOpenUpdateProfile(true)
  }

  return (
    <Modal
      centered
      className='modal-profile'
      title={<h4 style={{ padding: '15px 20px', margin: '0' }}>{`Thông tin tài khoản`}</h4>}
      open={openModal}
      onCancel={handleCloseModal}
      width={350}
      footer={''}
    >
      <div className='profile-cover'>
        <img src='https://cover-talk.zadn.vn/default' alt='' />
      </div>
      <div className='profile-avatar'>
        <Avatar
          style={{ width: '88px', height: '88px', border: '2px solid white' }}
          src={'https://demoda.vn/wp-content/uploads/2022/08/hinh-anh-avatar-nu-de-thuong.jpg'}
        >
          {/* {profileUser.avatar ? '' : profileUser.name[0].toUpperCase()} */}
        </Avatar>
      </div>
      <div className='profile-info-bao'>
        <h2>{name ? name : 'ccc'}</h2>
        <h3>Thông tin cá nhân</h3>
        <div style={{ display: 'flex' }}>
          <div className='info-left'>
            <p>Điện thoại</p>
            <p>Giới tính</p>
            <p>Ngày sinh</p>
          </div>

          <div className='info-right'>
            <p>{'cc'}</p>
            <p>{'Nam'}</p>
            {/* <p>
                    {birthDay
                      ? `${birthDay.day} / ${birthDay.month} / ${birthDay.year}`
                      : `${profileUser.birthDay.day} / ${profileUser.birthDay.month} / ${profileUser.birthDay.year}`}
                  </p> */}
          </div>
        </div>
      </div>
      <div className='btn-go-update'>
        <Button className='btn-update' onClick={handleOpenUpdateProfile}>
          Cập nhật thông tin
        </Button>
        <ModalUpdateProfile openModal={openUpdateProfile} handleCloseModal={() => setOpenUpdateProfile(false)} />
      </div>
    </Modal>
  )
}
export default ModalProfile
