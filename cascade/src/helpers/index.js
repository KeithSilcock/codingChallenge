//gets two dates, returns every day between them
export function getEveryDayBetweenTwoMonths(firstDate, lastDate) {
  if (firstDate > lastDate) {
    let temp = lastDate;
    lastDate = firstDate;
    firstDate = temp;
  }

  const diff = lastDate - firstDate;
  //use difference to find each day and add them to array

  const SECONDSINADAY = 1000 * 60 * 60 * 24;

  const daysArray = [];
  for (
    let currentDay = firstDate;
    currentDay < lastDate;
    currentDay = new Date(currentDay.getTime() + SECONDSINADAY)
  ) {
    daysArray.push(currentDay);
  }
  return daysArray;
}
