import util from 'util'
import { createClient } from 'redis'
import { envConfig } from '~/constants/config'

const client = createClient({
  password: envConfig.redisPassword,
  socket: {
    host: envConfig.redisHost,
    port: Number(envConfig.redisPort)
  }
})

client.on('connect', function () {
  console.log('Redis Connected!')
})

client.on('error', function (error) {
  console.error('Redis Error: ', error)
})

const setClient = util.promisify(client.set).bind(client)
const setExClient = util.promisify(client.setEx).bind(client)
const getClient = util.promisify(client.get).bind(client)
const existsClient = util.promisify(client.exists).bind(client)
const lrangeAsync = util.promisify(client.lRange).bind(client)
const lindexAsync = util.promisify(client.lIndex).bind(client)
const rpushAsync = util.promisify(client.rPush).bind(client)
const expireAsync = util.promisify(client.expire).bind(client)
const deleteClient = util.promisify(client.del).bind(client)

const set = async (key: string, value: any, ttl?: number) => {
  if (ttl) {
    await client.set(key, value, {
      EX: ttl
    })
  } else {
    await setClient(key, value)
  }
  // await expireAsync(key, 3000)
  // if (ttl) await expireAsync(key, ttl)
}

const setValueArray = async (user_id: string, values: string[]) => {
  await rpushAsync(user_id, values, (error: any, result: any) => {
    if (error) {
      console.error(error)
    } else {
      console.log(`Số phần tử trong mảng sau khi thêm: ${result}`)
    }
  })

  // Đặt TTL cho từng phần tử trong mảng
  for (const value of values) {
    await expireAsync(`${user_id}:${value}`, 30)
  }
}

const get = async (key: string) => {
  return client.get(key)
}

const ex = async (key: string) => {
  return client.expireTime(key)
}

const del = async (key: string) => {
  const data = await client.del(key)
  return data
}

const exists = async (key: string) => {
  const isExists = await existsClient(key)

  return isExists === 1
}

export const redis = {
  set,
  get,
  ex,
  del,
  exists,
  client,
  setValueArray
}
