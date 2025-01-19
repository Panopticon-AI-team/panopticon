export function unixToLocalTime(unixTimestamp: number): string {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds
  const date = new Date(unixTimestamp * 1000);

  // Hours part from the timestamp
  const hours =
    date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours();

  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();

  // Seconds part from the timestamp
  const seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  const formattedTime =
    hours +
    ":" +
    minutes.substring(minutes.length - 2) +
    ":" +
    seconds.substring(seconds.length - 2);

  return formattedTime;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
