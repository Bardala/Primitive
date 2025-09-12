export async function measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    const duration = Date.now() - start;
    console.warn(`⏱ ${label} took ${duration}ms`);
  }
}
