const images = new Map<
  string,
  { image: HTMLImageElement; ready: boolean; promise: Promise<void> }
>();

/** Keep decoded images alive and share in-flight work across routes and controls. */
export function prepareImage(src: string, priority: "high" | "low" = "low"): Promise<void> {
  const existing = images.get(src);
  if (existing) {
    if (priority === "high") existing.image.fetchPriority = priority;
    return existing.promise;
  }
  if (typeof Image === "undefined") return Promise.resolve();
  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = priority;
  const loaded =
    typeof image.decode === "function"
      ? null
      : new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Image unavailable"));
        });
  image.src = src;
  const entry = { image, ready: false, promise: Promise.resolve() };
  entry.promise = (loaded ?? image.decode())
    .then(() => {
      entry.ready = true;
    })
    .catch((error: unknown) => {
      images.delete(src); // A later visible request can retry a transient failure.
      throw error;
    });
  images.set(src, entry);
  return entry.promise;
}

export function isImagePrepared(src: string): boolean {
  return images.get(src)?.ready ?? false;
}

/** Low-priority bounded warmup, after the current page has finished loading. */
export function scheduleImageWarmup(sources: readonly string[]): () => void {
  let stopped = false;
  let timer: number | undefined;
  let idle: number | undefined;
  const run = () => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (
      stopped ||
      connection?.saveData ||
      connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g"
    )
      return;
    const urls = [...new Set(sources)];
    let index = 0;
    const worker = async () => {
      while (!stopped && index < urls.length) {
        const src = urls[index++];
        if (src) await prepareImage(src).catch(() => {});
      }
    };
    void worker();
    void worker();
  };
  const start = () => {
    if (typeof window.requestIdleCallback === "function")
      idle = window.requestIdleCallback(run, { timeout: 1500 });
    else timer = window.setTimeout(run, 0);
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
  return () => {
    stopped = true;
    window.removeEventListener("load", start);
    if (timer !== undefined) window.clearTimeout(timer);
    if (idle !== undefined) window.cancelIdleCallback(idle);
  };
}
