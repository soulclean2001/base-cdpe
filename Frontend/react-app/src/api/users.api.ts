import client from './client'

export const getMe = async () => {
  const data = await client.get('/users/me')

  return data
}
