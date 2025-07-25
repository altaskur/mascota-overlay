import tmi from 'tmi.js'
import { onNewEvent } from './events'
import { filterDataParams } from "../utils/utils";

export const CHANNEL_NAME = 'altaskur'

export const client = new tmi.Client({
  channels: [CHANNEL_NAME]
})

client.on('message', (_channel, userState, message) => {
  onNewEvent(filterDataParams(message, userState));
})

client.on('action', (_channel, userState, message) => {
  onNewEvent(filterDataParams(message, userState));
})

client.on('cheer', (_channel, userState, message) => {
  onNewEvent(filterDataParams(message, userState));
})


