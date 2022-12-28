import tmi, { ChatUserstate } from 'tmi.js'
import { changeHungryBar } from './status/food'

import { onNewEvent, getEventType } from './functions'

export const CHANNEL_NAME = 'altaskur'

export const client = new tmi.Client({
  channels: [CHANNEL_NAME]
})

interface QueueStatus {
  status: boolean
}
export interface QueueEvent {
  type: string
  userState: ChatUserstate
  message: string
}

export interface TanukyStatus {
  hungry: number
  sleep: number
  status: string
}

export const QUEUE_EVENTS: QueueEvent[] = []

export const QUEUE_STATUS: QueueStatus = {
  status: true
}
export const TANUKY_STATUS: TanukyStatus = {
  hungry: 100,
  sleep: 0,
  status: 'idle'
}

client.once('connecting', () => {
  console.log('Conectándome al canal: ' + CHANNEL_NAME)
})

client.once('connected', () => {
  console.log('Conectado al canal: ' + CHANNEL_NAME)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const globalTimer = setInterval(() => {
    TANUKY_STATUS.hungry -= 0.05

    if (TANUKY_STATUS.hungry < 0) {
      TANUKY_STATUS.hungry = 0
    }

    changeHungryBar(TANUKY_STATUS.hungry)
    // changeSleepBar(TANUKY_STATUS.sleep)
  }, 1000)
})

client.on('message', (_channel, userState, message) => {
  userState.username = userState.username ?? ''
  const messageLowerCase = message.toLowerCase()
  // todo Hacer que también salude con las primeras intervenciones

  const firstMsg: boolean = userState['first-msg']

  firstMsg &&
    onNewEvent(userState, messageLowerCase, 'greetings', QUEUE_EVENTS)

  const eventType = getEventType(userState, messageLowerCase)
  eventType !== 'none' &&
    onNewEvent(userState, messageLowerCase, eventType, QUEUE_EVENTS)
})
