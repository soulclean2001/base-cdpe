import { Avatar, Button, Modal } from 'antd'
import { useEffect, useState } from 'react'

import './style.scss'
import ModalUpdateProfile from '../ModalUpdateProfile'
import apiMe from '~/api/me.api'
import { InfoMeState, setMyProfile } from '~/features/Account/meSlice'
import bannerTemp from '~/assets/banner_temp.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
const ModalProfile = (props: any) => {
  const dispatch = useDispatch()
  const { openModal, handleCloseModal } = props
  const [idUser, setIdUser] = useState('')
  const [avatar, setAvatar] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [gender, setGender] = useState('')
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const [openUpdateProfile, setOpenUpdateProfile] = useState(false)

  const handleOpenUpdateProfile = () => {
    setOpenUpdateProfile(true)
  }
  useEffect(() => {
    if (openModal && !openUpdateProfile) getMyInfo()
  }, [openModal, openUpdateProfile])
  const getMyInfo = async () => {
    await apiMe.getMe().then((rs) => {
      setIdUser(rs.result._id)
      setAvatar(rs.result.avatar)
      setName(rs.result.name)
      setPhone(rs.result.phone_number)
      setBirthDay(rs.result.date_of_birth.slice(0, 10))
      setGender(rs.result.gender === 0 ? 'Nam' : 'Nữ')
      dispatch(setMyProfile({ name: rs.result.name, avatar: rs.result.avatar }))
    })
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
        <img src={bannerTemp} alt='' />
      </div>
      <div className='profile-avatar'>
        <Avatar
          style={{
            fontSize: '22px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'gray',
            width: '88px',
            height: '88px',
            border: '2px solid white'
          }}
          src={avatar && avatar !== '_' ? avatar : ''}
        >
          {avatar && avatar !== '_'
            ? ''
            : name && name !== '_'
            ? name.slice(0, 1).toUpperCase()
            : me.email.slice(0, 1).toUpperCase()}
        </Avatar>
      </div>
      <div className='profile-info-bao'>
        <h2>{name && name !== '_' ? name : '_'}</h2>
        <h3>Thông tin cá nhân</h3>
        <div style={{ display: 'flex' }}>
          <div className='info-left'>
            <p>Điện thoại</p>
            <p>Giới tính</p>
            <p>Ngày sinh</p>
          </div>

          <div className='info-right'>
            <p>{phone ? phone : '_'}</p>
            <p>{gender}</p>
            <p>{birthDay ? birthDay : '_'}</p>
          </div>
        </div>
      </div>
      <div className='btn-go-update'>
        <Button className='btn-update' onClick={handleOpenUpdateProfile}>
          Cập nhật thông tin
        </Button>
        <ModalUpdateProfile
          data={{
            _id: idUser,
            avatar: avatar,
            date_of_birth: birthDay,
            name: name,
            gender: gender === 'Nam' ? 0 : 1,
            phone_number: phone
          }}
          openModal={openUpdateProfile}
          handleCloseModal={() => setOpenUpdateProfile(false)}
        />
      </div>
    </Modal>
  )
}
export default ModalProfile
