
import tmi, { ChatUserstate } from 'tmi.js'
import { onNewEvent, getEventType, greetings } from './functions'

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

export const QUEUE_EVENTS: QueueEvent[] = []

export const QUEUE_STATUS: QueueStatus = {
  status: true
}
client.once('connecting', () => {
  console.log('Conectándome al canal: ' + CHANNEL_NAME)
})

client.once('connected', () => {
  console.log('Conectado al canal: ' + CHANNEL_NAME)
})

client.on('message', (_channel, userState, message) => {
  userState.username = userState.username ?? ''
  const messageLowerCase = message.toLowerCase()
  // todo Hacer que también salude con las primeras intervenciones

  // const firstMsg: boolean = userState['first-msg']

  // firstMsg &&
  //   onNewEvent(userState, messageLowerCase, 'greetings', QUEUE_EVENTS)

  const eventType = getEventType(userState, messageLowerCase)
  eventType !== 'none' &&
    onNewEvent(userState, messageLowerCase, eventType, QUEUE_EVENTS)
})
