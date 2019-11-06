// Pass in an epoch integer
export function readableDate(epoch: number): string {
  return new Date(epoch).toLocaleDateString();
}
