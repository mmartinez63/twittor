
//* Guardar en caché dinámico: Rutina cascarón
function actualizaCaheDinamico( dynamicCache, req, res ){

    if( res.ok ){
        return caches.open( dynamicCache ).then( (cache) => {
            cache.put( req, res.clone() ); //* <-- Esta también es una promesa, pero al profe no le interesó su respuesta. (?!!)
            return res.clone();
        });
    }else{
        //* En este punto del programa falló el caché y falló la red. Ambos. Y no hay nada que podamos hacer!!!
        return res;
    }

};
