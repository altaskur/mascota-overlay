import { QUEUE_STATUS, QueueEvent } from './connect'
import { ChatUserstate } from 'tmi.js'

const params: string[] = ['hola', 'buenas']
const petDiv = document.querySelector('div.mapache-frame') as HTMLDivElement
const TOOLTIP_INNER = document.querySelector('.tooltip-inner') as HTMLDivElement

export function onNewEvent (userState: ChatUserstate, message: string, eventType: string, QUEUE_EVENTS: QueueEvent[]): void {
  const actualEvent: QueueEvent = {
    type: eventType,
    userState,
    message
  }

  QUEUE_EVENTS.push(actualEvent)

  console.log('QUEUE_EVENTS_lenght', QUEUE_EVENTS.length)
  console.log('QUEUE_EVENTS', QUEUE_EVENTS)

  QUEUE_STATUS.status &&
    processQueue(QUEUE_EVENTS)
}

function processQueue (QUEUE_EVENTS: QueueEvent[]): void {
  const ANIMATION_TIME = 2000 // ms
  const ACTUAL_EVENT = QUEUE_EVENTS[0]
  ACTUAL_EVENT.userState.username = ACTUAL_EVENT.userState.username ?? ''
  let animation = 'ilde'

  ACTUAL_EVENT.type === 'greetings' &&
    greetings(ACTUAL_EVENT.userState.username, ACTUAL_EVENT.userState['first-msg'], ACTUAL_EVENT.message)

  if (ACTUAL_EVENT.type === 'greetings') {
    animation = 'greetings'
  }

  setTimeout(() => {
    console.log('Finalizado evento!')
    QUEUE_EVENTS.shift()
    console.log(QUEUE_EVENTS)
    clearAnimation(animation)
  }, ANIMATION_TIME)
}

export function getEventType (userState: ChatUserstate, message: string): string {
  let queueType: string = 'none'
  // const FIRST_MESSAGE: boolean = userState['first-msg']
  const arr: string[] = ['hola', 'buenas', 'holi']

  if (arr.includes(message)) queueType = 'greetings'

  console.log(queueType)
  return queueType
}

export function greetings (nick: string, first: boolean, message: string): void {
  message = `Saludos @${nick}`
  TOOLTIP_INNER.classList.add('hide')
  TOOLTIP_INNER.classList.add('show')
  petDiv.classList.remove('idle')
  petDiv.classList.add('greetings')
  TOOLTIP_INNER.textContent = message
}

export function clearAnimation (animation: string): void {
  TOOLTIP_INNER.classList.remove('show')
  TOOLTIP_INNER.classList.add('hide')
  TOOLTIP_INNER.textContent = ''
  petDiv.classList.remove(animation)
  petDiv.classList.add('idle')
}
