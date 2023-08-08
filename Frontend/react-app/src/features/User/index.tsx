import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '~/app/store'
import { fetchUsers, User } from './userSlice'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'

function UserPage() {
  const [users, setUsers] = useState<Array<User>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const selectedUsers = useSelector((state: RootState) => state.user)

  const dispatch: AppThunkDispatch = useAppDispatch()
  useEffect(() => {
    setLoading(selectedUsers.loading)
    setError(selectedUsers.error)
    setUsers(selectedUsers.users)
  }, [selectedUsers])
  function handleFetchUser() {
    dispatch(fetchUsers())
  }
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {users?.map((user) => (
        <li key={user.id}>
          {user.id} | {user.name} | {user.email}
        </li>
      ))}
      <button className='btn' onClick={handleFetchUser}>
        Fetch
      </button>
    </div>
  )
}
export default UserPage
