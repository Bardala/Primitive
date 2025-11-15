export function withTimeout<T>(promise: Promise<T>, ms = 5000) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('FETCH_TIMEOUT'));
    }, ms);

    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      err => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}
