export function changeSleepBar (sleepLvl: number): void {
  const sleepStatus = document.querySelector('div.sleepBarStatus') as HTMLDivElement
  const sleepBar = document.querySelector('div.sleepText') as HTMLDivElement
  const sleepLvl2 = sleepLvl.toFixed(1)
  sleepStatus.style.width = sleepLvl.toString() + '%'
  sleepBar.textContent = sleepLvl2 + '💤'
}
