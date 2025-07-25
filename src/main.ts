import { client } from './bot/connect'
import {startHungry} from "./bot/status/food";

(async () =>{
    await client.connect();
    startHungry();
})()
