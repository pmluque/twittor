// PWA.7.7 - funciones (sw-utils.js / sw.js)
//
// UTILIDADES: funciones Service Worker
//

// Limpieza de caches obsoletas
function cleanCache(cacheName, nItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => {
                    if (keys.length > nItems) {
                        console.log(`[${cacheName}] Deleting item...`, keys[0]);
                        cache.delete(keys[0]).then(cleanCache(cacheName, nItems))
                    }
                });
        });
}

// Actualización de cache dinámico
// ----- Guarda/Actualizar contenido en la cache dinámica
function updateCacheDynamic(dynamicCache, req, res) {
    if (res.ok) {
        // Si recoge una petición es que hay data que almacenar
        return caches.open(dynamicCache)
            .then(cache => {
                cache.put(req, res.clone());
                return res.clone();
            });

    } else {
        // Si no se pudo resolver la petición se devuelve la respuesta que llego de error
        return res;
    }
}