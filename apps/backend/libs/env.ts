export function optionalEnv(key: keyof NodeJS.ProcessEnv): string | undefined {
  const rawValue = process.env[key];
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return undefined;
  }

  return rawValue;
}
