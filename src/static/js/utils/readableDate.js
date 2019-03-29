

// Pass in an epoch integer
export function readableDate(epoch) {
  return new Date(epoch).toLocaleDateString();
}
