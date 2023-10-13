import { io } from 'socket.io-client'
import { store } from './store'

const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    Authorization: `Bearer ${store.getState().auth.accessToken}`
  }
})

export default socket
