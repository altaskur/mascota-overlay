import {FilterData, SOUNDPATH, VOLUME} from "../utils/utils";
import {eventMessages, eventsType, soundsList} from "../utils/events";

const TOOLTIP_DIV: HTMLDivElement | null = document.querySelector('div.tooltip');
const TOOLTIP_INNER: HTMLElement | null = document.querySelector('.tooltip-inner');
const AUDIO_DIV: HTMLAudioElement | null = document.querySelector('audio');
const TANUKI_DIV: HTMLDivElement | null = document.querySelector('div.mapache-frame');

const eventList: FilterData[] = [];

let altasQueueStatus = false;
let lastStatus: string = 'idle';


export const changeHungryLevel = (hungry: number,value: number): number => {
  hungry += value;
  if (hungry > 100) hungry = 100;
  if (hungry <= 0) hungry = 0;
  return hungry;
}

export const onNewEvent = (data: FilterData): void => {
  const eventType = getEventType(data);
  if (eventType.event !== false) {
    addTanukiEvent(eventType);
    processAltasQueue();
  }
}

const getEventType = (data: FilterData): FilterData =>{
  const eventKey = Object.keys(eventsType).find(key => eventsType[key].includes(data.message));
  data.event = eventKey ? eventKey : false

  if(data.firstMessage) data.event = "greetings";
  return data;
}

const addTanukiEvent = (TanukiEvent: FilterData): void => {
  eventList.push(TanukiEvent);
  console.log(eventList);
}

const startTanukiEvent = (tanukiEvent: FilterData): void => {
  altasQueueStatus = true;
  
  if (tanukiEvent.event) {
    const event = tanukiEvent.event as string;
    console.log(tanukiEvent.event)
    getSound(event)
    startAnimation(event)
    startLayout(tanukiEvent);
  }
}

const clearEvent = (): void => {
  console.log('Fin del evento');
  
  if (TOOLTIP_DIV && TOOLTIP_INNER) {
    TOOLTIP_DIV.classList.remove('show-tooltip');
    TOOLTIP_INNER.textContent = "";
  }
  startAnimation('idle');
  eventList.shift();
  console.log(eventList);
  altasQueueStatus = false;
  
  if (eventList.length > 0) {
    processAltasQueue()
  } else {
    console.log('Final de eventos');
  }
}

const processAltasQueue = (): void => {
  if (!altasQueueStatus) {
    startTanukiEvent(eventList[0]);
    setTimeout(clearEvent, 4300);
  }
}

const getSound = (data: string): void => {
  const eventKey = Object.keys(soundsList).find(key => key === data);
  
  if (eventKey) {
    const eventSounds : string[]  = soundsList[eventKey];
    const randomNumber = Math.floor(Math.random() * eventSounds.length);
    startSound(SOUNDPATH + eventSounds[randomNumber]);
  }
  
}

const startSound = (sound: string): void => {
  if (AUDIO_DIV) {
    if (AUDIO_DIV.src.length !== 0) AUDIO_DIV.pause();
    AUDIO_DIV.volume = VOLUME;
    AUDIO_DIV.src = sound;
    void AUDIO_DIV.play();
  }
}

const startAnimation = (data: string): void => {
  if(!TANUKI_DIV) return;
  
  TANUKI_DIV.classList.remove(lastStatus);
  if (data === "kiss") data = "greetings";
  lastStatus = data;
  TANUKI_DIV.classList.add(lastStatus);
}

const startLayout = (tanukiEvent: FilterData) => {
  const event = tanukiEvent.event as string;
  const eventMessage = eventMessages[event];
  let message = "";
  
  if (eventMessage) {
    if (eventMessage.length > 1)
      message = `${eventMessage[0]} ${tanukiEvent.userName} ${eventMessage[1]}`;
    else
      message = `${eventMessage[0]} ${tanukiEvent.userName}`;

    if (TOOLTIP_DIV && TOOLTIP_INNER) {
      TOOLTIP_DIV.classList.add('show-tooltip');
      TOOLTIP_INNER.textContent = message;
    }
  }
}


