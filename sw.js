//
// Service Worker
// --------------------------------------------------
// Logica de los distintos eventos
// Dependencias : sw-utils.js

// PWA.7.7 - funciones (sw-utils.js / sw.js)
//         - si esta instrucción diera error, se edita el .jshintrc
//         - ... y en globals se añade "importScripts": true 
importScripts('js/sw-utils.js');


// PWA.7.2 - constantes de cache y limites de las mismas
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const DYNAMIC_CACHE_LIMIT = 100;

// PWA.7.3 - cargar caches: recorrer aplicación y ver fichero que carga
// --------- inmutable si son de terceros y no cambian
// --- ficheros de la aplicación que debe ser cargado rapidamente
// const APP_SHELL = [
//    '/',

const APP_SHELL = [
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_INMUTABLE = [
    'css/animate.css',
    'js/libs/jquery.js',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
];

// PWA.7.4 - instalación
self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

// PWA.7.5 - EVENTO: activación - diferencia entre caches estáticos (sw.js)
self.addEventListener('activate', e => {

    const keysCacheResponse = caches.keys().then(keys => {

        keys.forEach(key => {
            if (key != STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        })
    });

    // espera hasta que la promesa del cache lo espere.    
    e.waitUntil(keysCacheResponse);
});

// PWA.7.6 - EVENTO: fetch - recogida de peticiones (sw.js)
self.addEventListener('fetch', e => {

    // Estrategia cache with network if fallback
    const response = caches.match(e.request)
        .then(res => {

            if (res) {
                return res;
            } else {
                console.log('fetch/ loading on dynamic...: ', e.request.url);
                // Hay que hacer un fetch del recurso nuevo o no registrado - usar cache dinámica
                return fetch(e.request).then(newResp => {
                    return updateCacheDynamic(DYNAMIC_CACHE, e.request, newResp);
                })
            }

        });

    e.respondWith(response);
});