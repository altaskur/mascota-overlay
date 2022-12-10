
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

client.on('message', (_channel, userstate, message) => {
  // TODO: apuntar esto!! forma de eliminar opcionales
  userstate.username = userstate.username ?? ''

  const eventType = getEventType(userstate, message)

  eventType !== 'none' &&
    onNewEvent(userstate, message, eventType, QUEUE_EVENTS)

  getEventType(userstate, message) === 'greetings' &&
    greetings(userstate.username, userstate['first-msg'], message)
})
