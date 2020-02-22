// Pass in an epoch integer
export function readableDate(epoch: string): string {
  return new Date(epoch).toLocaleDateString();
}
