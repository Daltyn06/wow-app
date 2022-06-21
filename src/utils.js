function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
  
    seconds = seconds % 60;
    minutes = minutes % 60;
  
    return `${padTo2Digits(minutes)}:${padTo2Digits(
      seconds,
    )}`;
  
  }
  
  function timerCalc(completed, par) {
    const diff = par - completed;
    const formattedTime = convertMsToTime(diff);
    if (diff < 0) {
      const diffPositive = Math.abs(diff);
      const formattedPositiveTime = convertMsToTime(diffPositive);
      return `Over by ${formattedPositiveTime}`;
    } else {
      return `Under by ${formattedTime}`;
    }
  }
  
  const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');


export {
    padTo2Digits,
    convertMsToTime,
    timerCalc,
    slugify,
}