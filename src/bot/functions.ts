import { QUEUE_STATUS, QueueEvent } from './connect'
import { ChatUserstate } from 'tmi.js'

// const params: string[] = ['hola', 'buenas']
const petDiv = document.querySelector('div.mapache-frame') as HTMLDivElement
const TOOLTIP_DIV = document.querySelector('div.tooltip') as HTMLDivElement
const TOOLTIP_INNER = document.querySelector('.tooltip-inner') as HTMLDivElement
const ANIMATION_TIME = 2000 // ms

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
  const ACTUAL_EVENT = QUEUE_EVENTS[0]
  ACTUAL_EVENT.userState.username = ACTUAL_EVENT.userState.username ?? ''
  let animation = 'idle'

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

  const arr: string[] = ['hola', 'buenas', 'holi', 'holiwi']

  const eventsGreeting = arr.filter((element) => message.includes(element))

  if (eventsGreeting.length > 0) queueType = 'greetings'

  console.log(queueType)
  return queueType
}

export async function greetings (nick: string, first: boolean, message: string): void {
  message = first ? `Bienvenida/o @${nick}` : `Saludos @${nick}`

  TOOLTIP_DIV.classList.add('show-tooltip')
  petDiv.classList.remove('idle')
  petDiv.classList.add('greetings')
  TOOLTIP_INNER.textContent = message

  const audio = document.querySelector('audio') as HTMLAudioElement
  audio.src = '/assets/sounds/tanuki2.aac'
  audio.volume = 30 / 100
  await audio.play()
}

export function clearAnimation (animation: string): void {
  TOOLTIP_DIV.classList.remove('show-tooltip')
  TOOLTIP_INNER.textContent = ''
  petDiv.classList.remove(animation)
  petDiv.classList.add('idle')
}
