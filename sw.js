// https://github.com/mdn/dom-examples/blob/main/service-worker/simple-service-worker/sw.js

const URLS = [
  './timer',
  './tracker',
  './tracker-edit',
  './tracker-act',
  './tracker-app.js',
  './chimie.html',
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
  './speedtest',
  './notes',
  './notes-icon.png',
  './yt',
  './tree.html',
  './blackscreen',
];

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  console.log("Loading website...");
  await cache.addAll(resources);
  console.log("Website loaded");
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const fetchAndReturn = async (request) => {
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    /*const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }*/
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
  // First try to get the resource from the cache
  let rel_url = '.' + request.url.replace(/\?.*$/, '').replace(self.location.toString().replace(/\/[^/]+$/, ''), '');
  const responseFromCache = await caches.match(request, { ignoreSearch: true });
  //console.log(request.url);
  //self.location.replace(/\/+$/, '')
  if (responseFromCache) {
    console.log("Loading response from cache : " + request.url);
    return responseFromCache;
  }
  if (URLS.indexOf(rel_url) !== -1) { // url exists but cached page has disappeared -> fetch again
    console.log("Fetching response since not available in cache : " + request.url);
    return fetchAndReturn(request);
  } else {
    const http404 = await caches.match(new Request('./404.html'), { ignoreSearch: true });
    if (http404) {
      return http404;
    } else {
      return fetchAndReturn(new Request('./404.html'));
    }
  }

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
    addResourcesToCache(URLS)
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
