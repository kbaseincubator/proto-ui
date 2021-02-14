// Pass in an epoch integer
export function readableEpochDate(epoch: number): string {
  return new Date(epoch).toLocaleDateString();
}

export function readableISODate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString();
}
