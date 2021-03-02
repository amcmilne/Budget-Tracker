console.log("Hi from your service-worker.js file!");
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/db.js",
  "/favicon.ico",
  "/assets/css/styles.css",
  "/assets/js/index.js",
  "/manifest.webmanifest",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css",
  "/assets/images/icons/icon-192x192.png",
  "/assets/images/icons/icon-512x512.png",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// install
self.addEventListener("install", (evt) => {
        evt.waitUntil(
            caches
            .open(DATA_CACHE_NAME)
            .then((cache) => cache.add("/api/transaction"))
        );
        evt.waitUntil(
            caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("Your files were pre-cached successfully!");
                return cache.addAll(FILES_TO_CACHE);
            })
        );

        self.skipWaiting();
    });

self.addEventListener("activate", (evt) => {
        evt.waitUntil(
            caches
            .keys()
            .then((keyList) => {
                return Promise.all(
                    keyList.map((key) => {
                        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                            console.log("Removing old cache data", key);
                            return caches.delete(key);
                        }
                    })
                );
            })
        );

        self.clients.claim();
    });

// fetch
self.addEventListener("fetch", (evt) => {
        // cache successful requests to the API
        if (evt.request.url.includes("/api/")) {
            evt.respondWith(
                caches.open(DATA_CACHE_NAME)
                    .then(async (cache) => {
                        try {
                            const response = await fetch(evt.request);
                            // If the response was good, clone it and store it in the cache.
                            if (response.status === 200) {
                                cache.put(evt.request.url, response.clone());
                            }
                            return response;
                        } catch (err) {
                            return await cache.match(evt.request);
                        }
                    })
                    .catch((err) => console.log(err))
            );

            return;
        }

        evt.respondWith(
            caches.match(evt.request).then((response) => {
                return response || fetch(evt.request);
            })
        );
    });
