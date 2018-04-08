# Nodepop

_Nodepop_ es una aplicación de backend que simula una página web básica con anuncios de compra/venta de artículos. Implementa una api para obtener anuncios de una base de datos _mongoDB_ (_nodepopDB_) a la que se accede a través del paquete _mongoose_.

La aplicación está basada en una versión anterior ubicada en la carpeta _Practica3_NodeBasico_ a la que se le ha incluido las siguientes funcionalidades:

* Autenticación del API y del sitio web con JWT (jason web token) y mantenimiento de sesión abierta del usuario.
* Internacionalización de la web, incluyendo inglés y español.
* Creación de nuevos anuncios en la base de datos _mongoDB_ y subida de la foto del anuncio.
* Creación de un thumbnail de la foto de tamaño 100 x 100 píxeles a través de un microservicio.

La aplicación utilizará la siguiente url: http://localhost:3000

La base de datos _nodepopDB_ contiene una colección llamada anuncios. Cada anuncio mostrará los siguientes datos:

* Nombre del artículo, un anuncio siempre tendrá un solo artículo.
* Si el artículo se vende o se busca.
* Precio. Será el precio del artículo en caso de ser una oferta de venta. En caso de que sea un anuncio de ‘se busca’ será el precio que el solicitante estaría dispuesto a pagar.
* Foto del artículo. Cada anuncio tendrá solo una foto.
* Thumbnail de la foto del artículo. La foto de tamaño 100 x 100 píxeles.
* Tags del anuncio. Podrá contener uno o varios de estos cuatro: work, lifestyle, motor y mobile.

En esta actualización de la aplicación, también se ha incluido una colección llamada usuarios con los siguientes campos:

* Name. Nombre del usuario.
* Email. Correo electrónico del usuario.
* Password. Contraseña del usuario.

Adicionalmente se crea automáticamente la colección sessions que controla la sesión abierta del usuario.

## 1. Entorno (versiones)

| Paquete | Versión |
| ------- | ------- |
| nvm     | 1.1.5   |
| node    | 8.9.4   |
| npm     | 5.6.0   |

| Base de datos | Versión |
| ------------- | ------- |
| mongo         | 3.6.2   |

| Navegador | Versión                                 |
| --------- | --------------------------------------- |
| chrome    | 64.0.3282.167 (Build oficial) (64 bits) |

## 2. Creación de la base de datos nodepopDB

Como prerrequisito debe tener instalado _node.js_ y el motor de _mongoDB_.

```sh
Ejemplo en Windows: lo instala en:
C:\Program Files\MongoDB
```

Crear una carpeta en el disco duro para guardar la base de datos. Se recomienda no crearla dentro de la carpeta de instalación de mongoDB por temas de permisos.

```sh
Ejemplo en Windows:
c:\data\db
```

Arrancar el motor de _mongoDB_ con la instrucción:

```sh
mongod --dbpath folderDB --directoryperdb
```

siendo folderDB la ruta de la capeta creada en el paso anterior.
Al no referenciar el puerto, se utiliza el 27017 (puerto por defecto de _MongoDB_).

```sh
Ejemplo en Windows:
"C:\Program Files\MongoDB\Server\3.6\bin\mongod" --dbpath d:\data\db –directoryperdb
```

Nota: Las comillas se utilizan en windows cuando existen carpetas de más de 8 caracteres.

Abrir el terminal de consola y posicionarse dentro de la carpeta _nodepop_.

La aplicación contiene un script de creación / inicialización de la base de datos llamado _installDB.js_. Se ha creado una variable de entorno para poder ejecutarlo más fácilmente. Para crear la base de datos teclear:

```sh
npm run installDB
```

Una vez finalizada la ejecución del script, comprobar si la base de datos ha sido creada. Para ello podemos abrir un cliente de _MongoDB_ (con el motor de _MongoDB_ arrancado previamente):

#### Cliente por consola

Teclear la instrucción:

```sh
mongo
```

```sh
Ejemplo en Windows:
"C:\Program Files\MongoDB\Server\3.6\bin\mongo"
```

Una vez abierto el cliente, visualizaremos las bases de datos creadas, teclear:

```sh
show dbs
```

Para comprobar si existe la base de datos _nodepopDB_ y contiene datos, teclear:

```sh
use nodepopDB
```

Y a continuación realizar una búsqueda de anuncios:

```sh
db.anuncios.find();
```

Se mostrará una lista de los anuncios guardados en la base de datos.

#### Cliente con interfaz gráfico, como por ejemplo Robo 3T

Crear una conexión con dirección _localhost_ y puerto _27017_.

Seleccionarla y pulsar el botón conectar.

Debe aparecer la base de datos _nodepopDB_.

Dentro de la carpeta colecciones, seleccionar la colección _anuncios_ y con el botón derecho del ratón seleccionar _view documents_.

Se mostrarán los anuncios guardados en la base de datos.

## 3. Probar el api

Con el motor de la base de datos arrancado y posicionado en la carpeta _nodepop_, teclear:

```sh
npm run start
```

Arrancará la aplicación con _node_. Si queremos arrancar la aplicación con _modemon_ para pruebas y desarrollo, teclear:

```sh
npm run dev
```

Abrir un navegador Chrome y en la barra de direcciones escribir: http://localhost:3000

Deberá aparecer una pantalla de acceso al sistema. Teclear el email _user@example.com_ y la contraseña _1234_ y pulsar el botón submit.

Una vez dentro con el usuario validado aparecerá:

* Una cabecera para poder:
  * Seleccionar un idioma (inglés o español).
  * Volver a la página principal.
* Una barra de acciones que mostrará:
  * El _usuario_ que ha abierto la sesión.
  * La opción _Cerrar sesión_, que cierra la sesión del usuario.
  * La opción _Lista de anuncios_, que refresca la lista de anuncios.
  * La opción _Nuevo anuncio_ que abre un formulario de creación de un nuevo anuncio. Una vez creado, la aplicación vuelve de nuevo a la pantalla principal de listado de anuncios.
* Una lista de anuncios, con fotos incluidas. La foto mostrada será la del thumbnail, salvo que en ese momento no esté todavía creada, que utilizaría la foto original de subida.

Para crear los thumbnail de las fotos de los nuevos anuncios creados, debemos abrir en otra consola un microservicio llamado _thumbnailService_. Para ello debemos teclear:

```sh
npm run thumbnailService
```

El microservicio recoge peticiones de imágenes de nuevos anuncios, y crea una imágen más pequeña de 100 x 100 píxeles en escala de grises. Posteriormente la ruta a esa imagen thumbnail se guardará en la base de datos para que cuando se visualice el anuncio en la lista de anuncios, muestre esta foto más pequeña en vez de la foto original.

#### Consultas al api con GET

La api utiliza el método en _query string_ para capturar parámetros y poder filtrar consultas.

Para recibir la lista de anuncios en formato _JSON_, teclear:
http://localhost:3000/apiv1/anuncios

Para poder obtener la información, previamente hay que abrir sesión con el usuario en la aplicación web. Si no está logado, saldra el siguiente _JSON_:

```sh
{
"success": false,
"error": "no token provided"
}
```

Si una vez abierta la sesión, el token _JWT_ expira mostrará:

```sh
{
"success": false,
"error": "jwt expired"
}
```

En este último caso, si estamos navegando por la web, el sistema te redirige a la pantalla de acceso para que vuelvas a abrir una nueva sesión con el usuario.

Filtros de propiedades:

* Por nombre de artículo, que empiece por el dato buscado:
  http://localhost:3000/apiv1/anuncios?nombre=bicicleta

* Tipo de anuncio (venta o búsqueda):
  http://localhost:3000/apiv1/anuncios?venta=true

* rango de precio (precio min. y precio max.), se usa un parámetro que tenga una de estas combinaciones:

  * n-m buscará anuncios con precio incluido entre los valores n y m.
    http://localhost:3000/apiv1/anuncios?precio=50-250

  * n- buscará los que tengan precio mayor que n.
    http://localhost:3000/apiv1/anuncios?precio=50-

  * -n buscará los que tengan precio menor de n.
    http://localhost:3000/apiv1/anuncios?precio=-50

  * n buscará los que tengan precio igual a n
    http://localhost:3000/apiv1/anuncios?precio=50

* Por tag, una condición por tag:
  http://localhost:3000/apiv1/anuncios?tag=lifestyle

Filtros de paginación:

* Saltar los n primeros resultados:
  http://localhost:3000/apiv1/anuncios?start=1

* Obtener los n primeros resultados:
  http://localhost:3000/apiv1/anuncios?limit=2

* Ordenar por una propiedad (ascendente):
  http://localhost:3000/apiv1/anuncios?sort=precio

* Ordenar por una propiedad (descendente):
  http://localhost:3000/apiv1/anuncios?sort=-precio

* Seleccionar propiedades a visualizar, separado por espacios:
  http://localhost:3000/apiv1/anuncios?fields=nombre%20precio%20-_id
  Seleccionamos solo las propiedades nombre y precio y filtramos la propiedad \_id.
  Un espacio se convierte en %20 en una url una vez pulsado intro.

Tanto los filtros de propiedades como filtros de paginación se pueden combinar:
http://localhost:3000/apiv1/anuncios?tag=lifestyle&sort=precio&start=1&fields=nombre%20precio%20-_id

#### Insertar, modificar o eliminar con el api con POST, PUT y DELETE:

Será necesaria una aplicación externa que permita realizar peticiones HTTP, como por ejemplo _Postman_:

* Insertar un elemento (POST):

  * Seleccionar operación POST.
  * Insertar en la url:
    http://localhost:3000/apiv1/anuncios
  * En la pestaña body, seleccionar el formato _x-www-form-urlencoded_ e insertar una clave por cada una de las propiedades del anuncio (nombre, venta, precio, foto, tags), junto a su correspondiente valor.
  * Deberá devolver un _status 200_ y un _JSON_ con dos propiedades:
    * "success": true
    * "result": el elemento nuevo insertado, incluyendo la propiedad \_id (identificador único).

* Actualizar un elemento (PUT):

  * Seleccionar operación PUT.
  * Insertar en la url:
    http://localhost:3000/apiv1/anuncios/5a871b34791ea63dc44da85a
    _5a871b34791ea63dc44da85a_ corresponde al identificador (\_Id) del elemento a modificar, escribir uno que exista.
  * En la pestaña body, seleccionar el formato x-www-form-urlencoded e insertar una clave por cada una de las propiedades del anuncio que queramos modificar, junto a su correspondiente valor.
  * Deberá devolver un _status 200_ y un _JSON_ con dos propiedades:
    * "success": true
    * "result": el elemento modificado.

* Eliminar un elemento (DELETE):
  * Seleccionar operación DELETE.
  * Insertar en la url:
    http://localhost:3000/apiv1/anuncios/5a871b34791ea63dc44da85a
    _5a871b34791ea63dc44da85a_ corresponde al identificador (\_Id) del elemento a modificar, escribir uno que exista.
  * Deberá devolver un _status 200_ y un _JSON_ con una propiedad:
    * "success": true.

## 4. Visualizar lista de anuncios

Para visualizar la lista de anuncios, teclear: http://localhost:3000

## 5. Mostrar ayuda con Apidoc

Al mismo nivel que la carpeta _nodepop_, existe la carpeta _doc_. Dentro de ella, abrir el archivo _index.html_ para mostrar la ayuda de las funciones del api.

La ayuda ha sido creada utilizando el paquete _apidoc_.
