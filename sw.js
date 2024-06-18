//* Imports

// importScripts('/js/sw-utils.js');
importScripts('js/sw-utils.js'); //* Aquí expresamos lo mismo pero sin la raíz del sitio. Ojo con esto!!!


const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//? Pasamos a definir los arreglos de todos los request que ocupa la aplicación web. Es decir, la columna vertebral de la app que estamos convirtiendo a PWA:
//! Ojo: Cuando se va  a desplegar esta app desde Git-Hub, no debe haber la / que indica raíz del sitio


const APP_SHELL = [
    // '/',
    // '/index.html',
    // '/css/style.css',
    // '/img/favicon.ico',
    // '/img/avatars/hulk.jpg',
    // '/img/avatars/ironman.jpg',
    // '/img/avatars/spiderman.jpg',
    // '/img/avatars/thor.jpg',
    // '/img/avatars/wolverine.jpg',
    // '/js/app.js',
    // '/js/sw-utils.js'


    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'



];

//? En el caché inmutable se almacenan todos los request que no se van a modificar durante la ejecución de la app-web

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//? Preparamos el evento de instalación del sw:

self.addEventListener('install', (e) =>{

    //? En el evento de install del sw, se ocupa para almacenar en caché los request que ocupa nuestra app web

    const cacheStatic = caches.open( STATIC_CACHE ).then( (Cache) => Cache.addAll( APP_SHELL ) );

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( (Cache) => Cache.addAll( APP_SHELL_INMUTABLE ) );



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]));
    
});

//? Vamos a borrar aquellos sw de versiones anteriores que ya no van a servir:

self.addEventListener('activate', (e) =>{

    //* Para borrar los cachés cuyos nombres sean del tipo static-vx, necesitamos hacer un barrido de toda la colección de cachés que estén grabados en el host:

    const respuesta = caches.keys().then( (keys) =>{

        //* La respuesta {keys} contiene un arreglo con el nombre de los cachés existentes en el host
        //* Téngase en cuenta que el valor actual de la variable CACHE_STATIC_NAME es 'static-v4'

        keys.forEach( key => {

            if( key !== STATIC_CACHE && key.includes('static') ){

                return caches.delete( key ); //* Respuesta de la promesa

            }

        });

    });

    e.waitUntil( respuesta );

});

//? Implementación de la técnica cache -> Network fallback
//gatito-> Ojo: En esta técnica de uso de caché, NO requerimos borrar items del caché dinamico

self.addEventListener('fetch', (e) => {

    //* Esta técnica dice: si el recurso solicitado se encuentra en caché, lo traemos de allí; si no, lo traemos de la red:

    const respuesta = caches.match( e.request ).then( (res) => {

        if( res ){
            return res;
        }else {
            //* Si el recurso NO está en caché, lo traemos de la red:
            return fetch( e.request ).then( (newRes) => {
                return actualizaCaheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });
        }
        
    });

    e.respondWith( respuesta );
});