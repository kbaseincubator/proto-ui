

// Pass in an epoch integer
export function readableDate(epoch:number) {
  return new Date(epoch).toLocaleDateString();
}
