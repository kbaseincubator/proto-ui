// Make a readable string from a snake-case string
// Eg. "comparative_genomics" -> "Comparitive genomics"
export function formatSnakeCase(str: string) {
  str = str.replace('_', ' ');
  str = str[0].toUpperCase() + str.slice(1);
  return str;
}
