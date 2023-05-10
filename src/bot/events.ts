import { FilterData } from './connect'
import { feedTanuki } from './status/food'

const eventsType: Record<string, string[]> = {
  hungry: ['!comer'],
  sleep: ['!sleep', '!dormir'],
  greetings: ['hola', 'buenas', 'holi', 'holiwi', 'hello'],
  angry: ['ganso', 'goose'],
  kiss: ['!beso', '!besito']
}

const eventMessages: Record<string, string[]> = {
  greetings: ["¡Hola!,"],
  kiss: ["💖", "💖"]
}

const soundsList: Record<string, string[]> = {
  hungry: ['eat1.aac', 'eat2.aac'],
  greetings: ['tanuki1.aac', 'tanuki2.aac'],
  annoyance: ['annoyance3.aac', 'annoyance2.aac', 'annoyance1.aac'],
  sleep: ['sleep.aac']
}

const TOOLTIP_DIV: HTMLDivElement | null = document.querySelector('div.tooltip')
const TOOLTIP_INNER: HTMLElement | null = document.querySelector('.tooltip-inner')

const eventList: FilterData[] = []
let altasQueueStatus = false
let lastStatus: string = 'idle'
let tanukiHungry = 100;

export function changeHungryLevel(value: number): number {
  tanukiHungry += value;
  if (tanukiHungry > 100) tanukiHungry = 100;
  if (tanukiHungry <= 0) tanukiHungry = 0;
  return tanukiHungry;
}

export function onNewEvent(data: FilterData): void {
  const eventType = getEventType(data)
  if (eventType.event !== false) {
    addTanukiEvent(eventType)
    processAltasQueue()
  }
}

function getEventType(data: FilterData): FilterData {
  const eventKey = Object.keys(eventsType).find(key => eventsType[key].includes(data.message));
  data.event = eventKey ? eventKey : false
  return data
}

function addTanukiEvent(TanukiEvent: FilterData): void {
  eventList.push(TanukiEvent)
  console.log(eventList)
}

function processAltasQueue(): void {
  if (!altasQueueStatus) {
    startTanukiEvent(eventList[0])
    setTimeout(clearEvent, 4300)
  }
}

function startTanukiEvent(tanukiEvent: FilterData): void {
  altasQueueStatus = true
  if (tanukiEvent.event) {
    const event = tanukiEvent.event as string
    if (tanukiEvent.event == "hungry") {
      
      if (tanukiHungry > 90) {
        console.log(tanukiHungry)
        tanukiEvent.event = "annoyance"
      } else {
        console.log("algo va mal")
        feedTanuki();
      }
    }
    console.log(tanukiEvent.event)
    getSound(event)
    startAnimation(event)
    startLayout(tanukiEvent);


  }
}
function getSound(data: string): void {
  const soundPath = '/assets/sounds/'
  let sound = ''
  let eventSounds: string[] = []
  const eventKey = Object.keys(soundsList).find(key => key === data);
  if (eventKey) {
    eventSounds = soundsList[eventKey]
    const randomNumber = Math.floor(Math.random() * eventSounds.length)
    sound = soundPath + eventSounds[randomNumber]
    startSound(sound)
  }
}

function startSound(sound: string): void {
  const audioDiv: HTMLAudioElement | null = document.querySelector('audio');
  if (audioDiv) {
    if (audioDiv.src.length !== 0) {
      audioDiv.pause()
    }
    console.log("cargando audio")
    audioDiv.volume = 0.19
    audioDiv.src = sound

    void audioDiv.play()
  }
}
function startAnimation(data: string): void {

  const tanukiDiv: HTMLDivElement | null = document.querySelector('div.mapache-frame')!

  tanukiDiv.classList.remove(lastStatus)

  if (data == "kiss") {
    data = "greetings"
  }
  lastStatus = data
  tanukiDiv.classList.add(lastStatus)
}

function startLayout(tanukiEvent: FilterData) {
  const event = tanukiEvent.event as string;
  const eventMessage = eventMessages[event]
  let message = "";
  if (eventMessage) {
    if (eventMessage.length > 1)
      message = `${eventMessage[0]} ${tanukiEvent.userName} ${eventMessage[1]}`
    else
      message = `${eventMessage[0]} ${tanukiEvent.userName}`

    if (TOOLTIP_DIV && TOOLTIP_INNER) {
      TOOLTIP_DIV.classList.add('show-tooltip')
      TOOLTIP_INNER.textContent = message
    }
  }
}

function clearEvent(): void {
  console.log('Fin del evento')

  if (TOOLTIP_DIV && TOOLTIP_INNER) {
    TOOLTIP_DIV.classList.remove('show-tooltip')
    TOOLTIP_INNER.textContent = ""
  }
  startAnimation('idle')
  eventList.shift()
  console.log(eventList)
  altasQueueStatus = false
  if (eventList.length > 0) {
    processAltasQueue()
  } else {
    console.log('Final de eventos')
  }
}
