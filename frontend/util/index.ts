export function bail(message: string): never {
  throw new Error(message);
}