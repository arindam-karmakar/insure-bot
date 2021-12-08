'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "58ce745f3936ab6a788089a158bc21e9",
"assets/assets/fonts/Amazon_Ember/Amazon-Ember-Medium.ttf": "ae1211657d7c48bc3bcdfe36634e1532",
"assets/assets/fonts/Amazon_Ember/Amazon-Ember-MediumItalic.ttf": "ca1a9f6f73bfc518bd2cc57cca065f2c",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_Bd.ttf": "d44c57c8349841beee3cc75f480a67fc",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_BdIt.ttf": "7d4b88221c41af79079a8eaa469fa2e0",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_He.ttf": "ee8a280174af42c74597d734e481b049",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_HeIt.ttf": "fb383904687263d4ce4070194ccc882e",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_Lt.ttf": "34f63e2bdbaa74b82d4f66eddc8c2f2e",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_LtIt.ttf": "0db1ed0c3b505120a6038f177d05afb3",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_Rg.ttf": "b2fd0d6e747d7c2c7d60aa255817f3de",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_RgIt.ttf": "342578c5f1675960b5aa612354d19b47",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_Th.ttf": "c4f8be687be5425be7e81448315227dc",
"assets/assets/fonts/Amazon_Ember/AmazonEmber_ThIt.ttf": "509e42826bd5fe66bfc9565f54582767",
"assets/assets/images/195.jpg": "611c89691c751a5e5334bd26f9d191d6",
"assets/assets/images/195.png": "19fa65b29c50b6007a0d0b2869f4973b",
"assets/FontManifest.json": "ea0ba34a69af68588deba8d04d8cbdb2",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "1967dc144155120a069ee96de68e677a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "1217c1c1f2f2e827950796e09fd94f9e",
"/": "1217c1c1f2f2e827950796e09fd94f9e",
"main.dart.js": "51ce13b93a4a88a8dedcaf8556e6fed8",
"manifest.json": "c5d44e7ae2b80c98ebb738eb1fbec040",
"splash/img/dark-1x.png": "c894746869d517947569d95dac67fed0",
"splash/img/dark-2x.png": "24e63348df63d9e8fa9688bc3cbcba03",
"splash/img/dark-3x.png": "43d6aff4d368b81048b05f50a51fc9a5",
"splash/img/dark-4x.png": "20a8bab0edc1558a662e631413a2aa82",
"splash/img/light-1x.png": "c894746869d517947569d95dac67fed0",
"splash/img/light-2x.png": "24e63348df63d9e8fa9688bc3cbcba03",
"splash/img/light-3x.png": "43d6aff4d368b81048b05f50a51fc9a5",
"splash/img/light-4x.png": "20a8bab0edc1558a662e631413a2aa82",
"splash/style.css": "58c3799ba17d8cc908ad2714aca1ab5b",
"version.json": "4b8fc01bc096185989d422c969bbf121"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
