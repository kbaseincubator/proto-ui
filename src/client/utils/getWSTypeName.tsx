// Get a friendly readable name from a workspace object type
// eg. "KBaseMatrices.AmpliconMatrix-1.2" -> "Amplicon Matrix"

export function getWSTypeName(type: string): string {
  const matches = type.match(/.*\.(.+)-\d+\.\d+/);
  if (!matches || matches.length < 2) {
    throw new Error('Invalid workspace type name: ' + type);
  }
  const match = matches[1];
  // Insert a space before all caps and trim
  return match.replace(/([A-Z][a-z])/g, ' $1').trim();
}
