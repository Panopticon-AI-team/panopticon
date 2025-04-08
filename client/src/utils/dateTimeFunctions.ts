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

/**
 * Get local date time
 * @returns e.g 2020_05_12_T23:50:21.817Z
 */
export function getLocalDateTime(): string {
  const now = new Date();
  return now.toISOString();
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatNumberStringWithPlural(time: number, suffix: string) {
  return time + " " + suffix + (time > 1 ? "s" : "");
}

export function formatSecondsToString(seconds: number) {
  if (seconds < 60) {
    return formatNumberStringWithPlural(seconds, "second");
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      formatNumberStringWithPlural(minutes, "minute") +
      (remainingSeconds > 0
        ? " " + formatNumberStringWithPlural(remainingSeconds, "second")
        : "")
    );
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return (
      formatNumberStringWithPlural(hours, "hour") +
      (minutes > 0
        ? " " + formatNumberStringWithPlural(minutes, "minute")
        : "") +
      (remainingSeconds > 0
        ? " " + formatNumberStringWithPlural(remainingSeconds, "second")
        : "")
    );
  }
}
