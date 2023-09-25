##### Instalación

Para instalar el proyecto, clone el repositorio de GitHub e instale las dependencias usando  

* ```git clone https://github.com/johnalexanderg/server_flutter_imagineapps.git  ```
* ```cd server_flutter_imagineapps```
* ```npm install```


##### Configuración

Edita el archivo `.env` para configurar los datos de conexión a la base de datos:

DB_HOST=localhost  
DB_PORT=5432  
DB_DATABASE=nombredelabd  
DB_USER=nombredeusuario  
DB_PASS=contraseñadelusuario

##### Inicialización de la base de datos

Si no tienes una base de datos inicializada, puedes usar el archivo de respaldo adjunto. Importa el archivo en tu gestor de bases de datos preferido o en TablePlus.

##### Ejecución del servidor

Para ejecutar el servidor, ejecuta el siguiente comando:

```node src/server.js```  

El servidor se ejecutará en el **puerto 3080**.

Explicación detallada

##### Dependencias

Las dependencias necesarias para el proyecto son las siguientes:

* **bcryptjs**: Para encriptar las contraseñas de los usuarios.
* **dotenv**: Para leer los datos de configuración de un archivo .env.
* **express**: Para crear un servidor web.
* **jsonwebtoken**: Para crear tokens JWT.
* **pg**: Para conectarse a una base de datos PostgreSQL.
Base de datos

La base de datos se creó usando Docker. Para crear una base de datos PostgreSQL usando Docker, puedes usar el siguiente comando:

``` docker run --name postgres -e POSTGRES_PASSWORD=mi_contraseña -p 5432:5432 -d postgres ```

Este comando creará una base de datos PostgreSQL con el nombre postgres y la contraseña mi_contraseña. La base de datos estará disponible en el puerto 5432.

##### Servidor

El servidor se crea usando Node.js y Express. Para conectarse a la base de datos, se usa la dependencia pg. Los datos de conexión a la base de datos se configuran en el archivo **.env**.

##### Token JWT

Los tokens JWT se usan para autenticar a los usuarios. Para crear un token JWT, se usa la dependencia jsonwebtoken.

##### Encriptación de contraseñas

Las contraseñas de los usuarios se encriptan usando la dependencia bcryptjs.

##### Inicialización de la base de datos

Si no tienes una base de datos inicializada, puedes usar el archivo de respaldo adjunto. Importa el archivo en tu gestor de bases de datos preferido o en TablePlus.
