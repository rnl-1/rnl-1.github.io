// https://github.com/mdn/dom-examples/blob/main/service-worker/simple-service-worker/sw.js

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request, { ignoreSearch: true });
  if (responseFromCache) {
    return responseFromCache;
  }
  const http404 = await caches.match(new Request('./404.html'), { ignoreSearch: true });
  return http404;

  // Next try to use the preloaded response, if it's there
  /*const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request, { mode: 'no-cors' });
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }*/
};

/*const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};*/

self.addEventListener('activate', (event) => {
  //event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      './timer',
      './tracker',
      './tracker-edit',
      './tracker-act',
      './tracker-app.js',
      './export.html',
      './timer-form.html',
      './tracker-list.html',
      './',
      './bootstrap.min.css',
      './js-cdn.js',
      './assets/main.css',
      './assets/minima-social-icons.svg',
      './favicon.ico',
      './404.html',
      './sw.js',
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(location.origin)) {
    event.respondWith(
      cacheFirst({
        request: event.request,
        preloadResponsePromise: event.preloadResponse,
      })
    );
  }
});
