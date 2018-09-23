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

//takes in month and year, returns array of UTC days
export function getDaysOfMonth(month, year) {
  const startDate = new Date(year, month - 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const SECONDSINADAY = 1000 * 60 * 60 * 24;

  const daysArray = [];
  for (let day = 0; day < daysInMonth; day++) {
    const newDay = new Date(startDate.getTime() + SECONDSINADAY * day);

    daysArray.push(newDay);
  }
  return daysArray;
}
