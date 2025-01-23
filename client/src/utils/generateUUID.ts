export function randomUUID(): string {
  if (crypto && typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback if older browser or crypto.randomUUID() not supported
  return generateUUID();
}

function generateUUID(): string {
  let uuid = "";
  const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  for (let i = 0; i < chars.length; i++) {
    const randomValue = (Math.random() * 16) | 0; // Generate random value (0-15)
    if (chars[i] === "x") {
      uuid += randomValue.toString(16); // Replace 'x' with random hex value
    } else if (chars[i] === "y") {
      uuid += ((randomValue & 0x3) | 0x8).toString(16); // Replace 'y' with a value between 8 and 11
    } else {
      uuid += chars[i]; // Preserve the dashes and '4' in the template
    }
  }
  return uuid;
}
