# Nodepop

*Nodepop* es una aplicación de backend que simula una página web básica con anuncios de compra/venta de artículos. Implementa una api para obtener anuncios de una base de datos *mongoDB* (*nodepopDB*) a la que se accede a través del paquete *mongoose*.

Utilizará la siguiente url: http://localhost:3000

La base de datos *nodepopDB* contiene una colección llamada anuncios. Cada anuncio mostrará los siguientes datos:

- Nombre del artículo, un anuncio siempre tendrá un solo artículo.
- Si el artículo se vende o se busca.
- Precio. Será el precio del artículo en caso de ser una oferta de venta. En caso de que sea un anuncio de ‘se busca’ será el precio que el solicitante estaría dispuesto a pagar.
- Foto del artículo. Cada anuncio tendrá solo una foto.
- Tags del anuncio. Podrá contener uno o varios de estos cuatro: work, lifestyle, motor y mobile.

## 1. Entorno (versiones)

| Paquete | Versión |
| ------ | ------ |
| nvm | 1.1.5 |
| node | 8.9.4 |
| npm | 5.6.0 |

| Navegador | Versión |
| ------ | ------ |
| Chrome | 64.0.3282.167 (Build oficial) (64 bits) |

##	2. Creación de la base de datos nodepopDB
Como prerrequisito debe tener instalado *node.js* y el motor de *mongoDB*. 
```sh
Ejemplo en Windows: lo instala en
C:\Program Files\MongoDB
```
Crear una carpeta en el disco duro para guardar la base de datos. Se recomienda no crearla dentro de la carpeta de instalación de mongoDB por temas de permisos. 
```sh
Ejemplo en Windows: 
c:\data\db
```
Arrancar el motor de *mongoDB* con la instrucción: 
```sh
mongod --dbpath folderDB --directoryperdb
```
siendo folderDB la ruta de la capeta creada en el paso anterior. 
Al no referenciar el puerto, se utiliza el 27017 (puerto por defecto de *MongoDB*).
```sh
Ejemplo en Windows:
"C:\Program Files\MongoDB\Server\3.6\bin\mongod" --dbpath d:\data\db –directoryperdb 
```
Nota: Las comillas se utilizan en windows cuando existen carpetas de más de 8 caracteres.

Abrir el terminal de consola y posicionarse dentro de la carpeta *nodepop*. 

La aplicación contiene un script de creación / inicialización de la base de datos llamado *install_db.js*. Se ha creado una variable de entorno para poder ejecutarlo más fácilmente. Para crear la base de datos teclear:
```sh
npm run installDB
```

Una vez finalizada la ejecución del script, comprobar si la base de datos ha sido creada. Para ello podemos abrir un cliente de *MongoDB* (con el motor de *MongoDB* arrancado previamente):

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
Para comprobar si existe la base de datos *nodepopDB* y contiene datos, teclear:
```sh
use nodepop
```
Y a continuación realizar una búsqueda de anuncios:
```sh
db.anuncios.find();
```
Se mostrará una lista de los anuncios guardados en la base de datos.

#### Cliente con interfaz gráfico, como por ejemplo Robo 3T

Crear una conexión con dirección *localhost* y puerto *27017*. 

Seleccionarla y pulsar el botón conectar.

Debe aparecer la base de datos *nodepopDB*.

Dentro de la carpeta colecciones, seleccionar la colección *anuncios* y con el botón derecho del ratón seleccionar *view documents*.

Se mostrarán los anuncios guardados en la base de datos.

## 3. Probar el api

Con el motor de la base de datos arrancado y posicionado en la carpeta *nodepop*, teclear:
```sh
npm run start
```
Arrancará la aplicación con *node*. Si queremos arrancar la aplicación con *modemon* para pruebas y desarrollo, teclear:
```sh
npm run dev
```

Abrir un navegador Chrome y en la barra de direcciones escribir: http://localhost:3000

Deberá aparecer una lista de anuncios, con fotos incluidas.

La api utiliza el método en *query string* para capturar parámetros y poder filtrar consultas.

#### Consultas al api con GET

Para recibir la lista de anuncios en formato *JSON*, teclear:
http://localhost:3000/apiv1/anuncios


Filtros de propiedades:

- Por nombre de artículo, que empiece por el dato buscado: 
http://localhost:3000/apiv1/anuncios?nombre=bicicleta

- Tipo de anuncio (venta o búsqueda):
http://localhost:3000/apiv1/anuncios?venta=true

- rango de precio (precio min. y precio max.), se usa un parámetro que tenga una de estas combinaciones:
   - n-m buscará anuncios con precio incluido entre los valores n y m.
   http://localhost:3000/apiv1/anuncios?precio=50-250

   - n- buscará los que tengan precio mayor que n.
   http://localhost:3000/apiv1/anuncios?precio=50-

   - -n buscará los que tengan precio menor de n.
   http://localhost:3000/apiv1/anuncios?precio=-50

   - n buscará los que tengan precio igual a n
    http://localhost:3000/apiv1/anuncios?precio=50

- Por tag, una condición por tag:
http://localhost:3000/apiv1/anuncios?tag=lifestyle

Filtros de paginación:

- Saltar los n primeros resultados:
http://localhost:3000/apiv1/anuncios?start=1

- Obtener los n primeros resultados:
http://localhost:3000/apiv1/anuncios?limit=2

- Ordenar por una propiedad (ascendente):
http://localhost:3000/apiv1/anuncios?sort=precio

- Ordenar por una propiedad (descendente):
http://localhost:3000/apiv1/anuncios?sort=-precio

- Seleccionar propiedades a visualizar, separado por espacios: 
http://localhost:3000/apiv1/anuncios?fields=nombre%20precio%20-_id
Seleccionamos solo las propiedades nombre y precio y filtramos la propiedad _id.
Un espacio se convierte en %20 en una url una vez pulsado intro.

Tanto los filtros de propiedades como filtros de paginación se pueden combinar:
http://localhost:3000/apiv1/anuncios?tag=lifestyle&sort=precio&start=1&fields=nombre%20precio%20-_id

#### Insertar, modificar o eliminar con el api con POST, PUT y DELETE:

Será necesaria una aplicación externa que permita realizar peticiones HTTP, como por ejemplo *Postman*:

- Insertar un elemento (POST):
    - Seleccionar operación POST.
    - Insertar en la url: 
    http://localhost:3000/apiv1/anuncios
    - En la pestaña body, seleccionar el formato *x-www-form-urlencoded* e insertar una clave por cada una de las propiedades del anuncio (nombre, venta, precio, foto, tags), junto a su correspondiente valor.
    - Deberá devolver un *status 200* y un *JSON* con dos propiedades: 
        - "success": true
        - "result": el elemento nuevo insertado, incluyendo la propiedad _id (identificador único).

- Actualizar un elemento (PUT):
    - Seleccionar operación PUT.
    - Insertar en la url: 
    http://localhost:3000/apiv1/anuncios/5a871b34791ea63dc44da85a
    *5a871b34791ea63dc44da85a* corresponde al identificador (_Id) del elemento a modificar, escribir uno que exista.
    - En la pestaña body, seleccionar el formato x-www-form-urlencoded e insertar una clave por cada una de las propiedades del anuncio que queramos modificar, junto a su correspondiente valor.
    - Deberá devolver un *status 200* y un *JSON* con dos propiedades: 
        - "success": true
        - "result": el elemento modificado.

- Eliminar un elemento (DELETE):
    - Seleccionar operación DELETE.
    - Insertar en la url:
    http://localhost:3000/apiv1/anuncios/5a871b34791ea63dc44da85a
    *5a871b34791ea63dc44da85a* corresponde al identificador (_Id) del elemento a modificar, escribir uno que exista.
    - Deberá devolver un *status 200* y un *JSON* con una propiedad: 
        - "success": true.
		
## 4. Visualizar lista de anuncios

Para visualizar la lista de anuncios, teclear: http://localhost:3000
