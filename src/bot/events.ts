import { FilterData } from './connect'
import { feedTanuki } from './status/food'

// const eventsType = {
//   hungry: ['!comer'],
//   sleep: ['!sleep'],
//   greetings: ['hola', 'buenas', 'holi', 'holiwi', 'hello'],
//   angry: ['python', 'psql', 'ganso', 'goose'],
//   kiss: ['!kiss']
// } satisfies Record<string, string[]>

//  } satisfies Record<string, `!${string}`[]>

// const wordGolea = Object.entries(eventsType).reduce((prev,[key,values])=>{
//   prev = {...prev,...values.reduce((p,v)=>({
//     ...p,
//     [v]:key
//   }),{})}
//   return prev;
// },{}) satisfies Record<string, string>;
const TOOLTIP_DIV = document.querySelector('div.tooltip') as HTMLDivElement
const TOOLTIP_INNER = document.querySelector('.tooltip-inner') as HTMLDivElement

const soundsList = {
  hungry: ['eat1.aac', 'eat2.aac'],
  tanuki: ['tanuki1.aac', 'tanuki2.aac'],
  annoyance: ['annoyance3.aac', 'annoyance2.aac', 'annoyance1.aac'],
  sleep: ['sleep.aac']
} satisfies Record<string, string[]>

const eventList: string [] = []
let altasQueueStatus = false
let lastStatus = 'idle'
let tanukiHungry = 100;

 export function changeHungryLevel(value:number):number{
  tanukiHungry +=value;
  if(tanukiHungry>100) tanukiHungry=100;
  if(tanukiHungry<=0) tanukiHungry=0;
  return tanukiHungry;
}

export function onNewEvent (data: FilterData): void {
  const eventType = getEventType(data)
  if (eventType !== 'false') {
    addTanukiEvent(eventType)
    processAltasQueue()
  }
}

function getEventType (data: FilterData): string {
  const message = data.message
  let result = 'false'

  const hungry = ['!comer']
  const isHungry = hungry.filter((element) => message.includes(element))
  result = isHungry.length > 0 ? 'hungry' : result

  const sleep = ['!dormir']
  const isSleep = sleep.filter((element) => message.includes(element))
  result = isSleep.length > 0 ? 'sleep' : result

  const kiss = ['!besito', 'beso']
  const isKiss = kiss.filter((element) => message.includes(element))
  result = isKiss.length > 0 ? 'kiss' : result

  const annoyance = ['psql', 'ganso', 'goose']
  const isAnnoyance = annoyance.filter((element) => message.includes(element))
  result = isAnnoyance.length > 0 ? 'annoyance' : result

  const greetings = ['hola', 'buenas', 'holi', 'holiwi', 'hello']
  const isGreetings = greetings.filter((element) => message.includes(element))
  result = isGreetings.length > 0 ? 'greetings' : result

  return result
}

function addTanukiEvent (TanukiEvent: string): void {
  eventList.push(TanukiEvent)
  console.log(eventList)
}

function processAltasQueue (): void {
  if (!altasQueueStatus) {
    startTanukiEvent(eventList[0])
    setTimeout(clearEvent, 4300)
  }
}

function startTanukiEvent (tanukiEvent: string): void {
  altasQueueStatus = true
  getSound(tanukiEvent)
  startAnimation(tanukiEvent)
  startLayout(tanukiEvent);

  if (tanukiEvent == "hungry"){
    feedTanuki();
  }
}
function getSound (tanukiEvent: string): void {
  const soundPath = '/assets/sounds/'
  let sound = ''
  let eventSounds: string[] = []

  if (tanukiEvent === 'hungry') {
    eventSounds = soundsList.hungry
  }
  if (tanukiEvent === 'kiss') {
    eventSounds = soundsList.tanuki
  }
  if (tanukiEvent === 'annoyance') {
    eventSounds = soundsList.annoyance
  }
  if (tanukiEvent === 'greetings') {
    eventSounds = soundsList.tanuki
  }
  if(tanukiEvent === 'sleep'){
    eventSounds= soundsList.sleep;
  }

  const randomNumber = Math.floor(Math.random() * eventSounds.length)
  sound = soundPath + eventSounds[randomNumber]

  if (eventSounds.length > 0) {
    startSound(sound)
  }
}

function startSound (sound: string): void {
  const audioDiv = document.querySelector('audio') as HTMLAudioElement
  if (audioDiv.src.length !== 0) {
    audioDiv.pause()
  }
  audioDiv.volume = 0.19
  audioDiv.src = sound
  void audioDiv.play()
}
function startAnimation (tanukiEvent: string): void {

  const tanukiDiv = document.querySelector<HTMLDivElement>('div.mapache-frame')!

  tanukiDiv.classList.remove(lastStatus)
  if(tanukiEvent=="kiss"){
    tanukiEvent="greetings"
  }
  lastStatus = tanukiEvent
  tanukiDiv.classList.add(tanukiEvent)
}

function startLayout(tanukiEvent: string){

  if (tanukiEvent === "kiss"){
    TOOLTIP_DIV.classList.add('show-tooltip')
    TOOLTIP_INNER.textContent = "💖💖"
  }

}

function clearEvent (): void {
  console.log('Fin del evento')

  TOOLTIP_DIV.classList.remove('show-tooltip')
  TOOLTIP_INNER.textContent = ""

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
