import { ApiResponse } from '~/types'
import client from './client'

export class Chat {
  public static getListChatForCandidate = async () => {
    const rs: ApiResponse = await client.get(`/job-applications/list-chat-users`)
    return rs
  }
  public static getListChatForEmployer = async () => {
    const rs: ApiResponse = await client.get(`/job-applications/list-chat-company`)
    return rs
  }
}

export default Chat
