// Pass in an epoch integer
export function readableSnakeCase(str: string): string {
  str = str[0].toUpperCase() + str.slice(1);
  return str.replace('_', '');
}
