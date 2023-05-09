import tmi, { Userstate } from 'tmi.js'

import { onNewEvent } from './events'
import { startHungry } from './status/food'

export interface FilterData {
  userName: string
  message: string
  firstMessage: Boolean
  event: string|boolean
}

export const CHANNEL_NAME = 'altaskur'

export const client = new tmi.Client({
  channels: [CHANNEL_NAME]
})

client.on('message', (_channel, userState, message) => {
  const data = filterDataParams(message, userState)
  onNewEvent(data)
})

client.on('action', (_channel, userState, message) => {
  const data = filterDataParams(message, userState)
  onNewEvent(data)
})

function filterDataParams (message: string, userState: Userstate): FilterData {
  userState.username = userState.username ?? ''
  const messageLowerCase = message.toLowerCase()
  const firstMsg: boolean = userState['first-msg']
  const filterData: FilterData = {
    userName: userState.username,
    message: messageLowerCase,
    firstMessage: firstMsg,
    event:false
  }
  return filterData
}

startHungry();
