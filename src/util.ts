export function sleepHelper(n: number): Promise<number> {
  return new Promise((resolve) => {
    function resolveWrapper() {
      resolve(id);
    }
    let id = setInterval(resolveWrapper, n) as unknown as number;
  });
}

export async function sleep(n: number) {
  let intervalId: number;
  try {
    intervalId = await sleepHelper(n);
  } catch (err) {
    throw new Error(err);
  } finally {
    clearInterval(intervalId);
  }
}
