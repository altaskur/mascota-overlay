import { QUEUE_STATUS, QueueEvent, TANUKY_STATUS, TanukyStatus } from './connect'
import { ChatUserstate } from 'tmi.js'

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
  QUEUE_STATUS.status = false
  const ACTUAL_EVENT = QUEUE_EVENTS[0]
  ACTUAL_EVENT.userState.username = ACTUAL_EVENT.userState.username ?? ''
  let animation = 'idle'

  ACTUAL_EVENT.type === 'greetings' &&
    greetings(ACTUAL_EVENT.userState.username, ACTUAL_EVENT.userState['first-msg'], ACTUAL_EVENT.message)
  if (ACTUAL_EVENT.type === 'greetings') {
    animation = 'greetings'
  }

  ACTUAL_EVENT.type === 'angry' &&
    angry(ACTUAL_EVENT.userState.username, ACTUAL_EVENT.userState['first-msg'], ACTUAL_EVENT.message)

  if (ACTUAL_EVENT.type === 'angry') {
    animation = 'angry'
  }

  ACTUAL_EVENT.type === 'hungry' &&
  eating(TANUKY_STATUS)

  if (ACTUAL_EVENT.type === 'hungry') {
    animation = 'eating'
  }

  setTimeout(() => {
    console.log('Finalizado evento!')
    QUEUE_EVENTS.shift()
    console.log(QUEUE_EVENTS)
    clearAnimation(animation)
    QUEUE_STATUS.status = true
    if (QUEUE_EVENTS.length > 0) { processQueue(QUEUE_EVENTS) }
  }, ANIMATION_TIME)
}

export function getEventType (userState: ChatUserstate, message: string): string {
  let queueType: string = 'none'

  const greetingTriggers: string[] = ['hola', 'buenas', 'holi', 'holiwi']
  const eventsGreeting = greetingTriggers.filter((element) => message.includes(element))

  const angryTriggers: string[] = ['python', 'psql']
  const eventsAngry = angryTriggers.filter((element) => message.includes(element))

  const hungryTriggers: string[] = ['!comer']
  const eventsHungry = hungryTriggers.filter((element) => message.startsWith(element))

  if (eventsGreeting.length > 0) queueType = 'greetings'
  if (eventsAngry.length > 0) queueType = 'angry'
  if (eventsHungry.length > 0) queueType = 'hungry'

  return queueType
}

async function greetings (nick: string, first: boolean, message: string): Promise<void> {
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

async function angry (nick: string, first: boolean, message: string): Promise<void> {
  message = `@${nick} No me gusta eso que has dicho`
  TOOLTIP_DIV.classList.add('show-tooltip')
  petDiv.classList.remove('idle')
  petDiv.classList.add('angry')
  TOOLTIP_INNER.textContent = message

  const audio = document.querySelector('audio') as HTMLAudioElement
  const random = Math.floor(Math.random() * 40)
  let song = ''
  if (random < 10) {
    song = 'annoyance1.aac'
  } else if (random > 20) {
    song = 'annoyance2.aac'
  } else if (random > 30) {
    song = 'annoyance3.aac'
  }
  audio.src = `/assets/sounds/${song}`
  audio.volume = 30 / 100
  await audio.play()
}

function eating (TANUKY_STATUS: TanukyStatus): void {
  if (TANUKY_STATUS.hungry !== 100) {
    petDiv.classList.remove('idle')
    petDiv.classList.add('eating')
  } else {
    petDiv.classList.remove('idle')
    petDiv.classList.add('eating')
  }
}

export function clearAnimation (animation: string): void {
  TOOLTIP_DIV.classList.remove('show-tooltip')
  TOOLTIP_INNER.textContent = ''
  petDiv.classList.remove(animation)
  petDiv.classList.add('idle')
}
