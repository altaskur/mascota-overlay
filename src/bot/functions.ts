import { QUEUE_STATUS, QueueEvent } from './connect'
import { ChatUserstate } from 'tmi.js'

export function onNewEvent (userState: ChatUserstate, message: string, eventType: string, QUEUE_EVENTS: QueueEvent[]): void {
  const actualEvent: QueueEvent = {
    type: eventType,
    userState,
    message
  }

  // TODO! QUEUE_EVENTS DON'T PUSH ANYTHING
  QUEUE_EVENTS.unshift(actualEvent)


  QUEUE_STATUS.status &&
    processQueue(QUEUE_EVENTS)
}

function processQueue (QUEUE_EVENTS: QueueEvent[]): void {
  const ANIMATION_TIME = 3000 // ms
  const ACTUAL_EVENT = QUEUE_EVENTS[0]
  ACTUAL_EVENT.userState.username = ACTUAL_EVENT.userState.username ?? ''

  ACTUAL_EVENT.type === 'greetings' &&
    greetings(ACTUAL_EVENT.userState.username, ACTUAL_EVENT.userState['first-msg'], ACTUAL_EVENT.message)

  setTimeout(() => {
    console.log('Finalizado evento!')
    QUEUE_EVENTS.shift()
    console.log(QUEUE_EVENTS)
  }, ANIMATION_TIME)
}

export function getEventType (userState: ChatUserstate, message: string): string {
  let queueType: string = ''
  const FIRST_MESSAGE: boolean = userState['first-msg']

  message = message.toLowerCase()
  if (message.includes('hola') || message.includes('buenas') || FIRST_MESSAGE) {
    queueType = 'greetings'
  } else {
    queueType = 'none'
  }

  return queueType
}

export function greetings (nick: string, first: boolean, message: string): void {
  const TOOLTIP_INNER = document.querySelector('.tooltip-inner') as HTMLDivElement
  message = `Saludos @${nick}`
  TOOLTIP_INNER.textContent = message
}
