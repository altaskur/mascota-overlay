import { changeHungryLevel } from "../events"

export function changeHungryBar (hungryLvl: number): void {
  const hungryStatus = document.querySelector('div.hungryBarStatus') as HTMLDivElement
  const hungryBar = document.querySelector('div.hungryText') as HTMLDivElement
  const hungryLvl2 = hungryLvl.toFixed(1)
  hungryStatus.style.width = hungryLvl.toString() + '%'
  hungryBar.textContent = hungryLvl2 + '🍒'
}

export function startHungry():void{
  setInterval(()=>{
    changeHungryBar(changeHungryLevel(-0.2));
  },6000);
}

export function feedTanuki() {
  changeHungryBar(changeHungryLevel(10));
}
