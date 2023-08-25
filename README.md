# CHEP
## Censo Hospitalario Electrónico de Pacientes

![img|320x271,50%](https://chep.saludchiapas.gob.mx/assets/icons/Logo%20CHEP%202020%20OK-01.png)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

CHEP:
Es un sistema de información Web que describe la afluencia de camas en porcentajes de ocupación, esto para evitar la saturación de pacientes ingresados en los diferentes servicios de emergencias y servicios hospitalarios del Hospital Jesús Gilberto Gómez Maza ubicado en la cuidad de Tuxtla Gutiérrez, Chiapas, pudiendo así tener la información de la población de pacientes hospitalizados, atendidos, evolucionados y egresados en tiempo real, valorados en el mismo, salvaguardando así el historial clínico de cada paciente.

## Características

- Genera una base poblacional de Pacientes.
- Contiene Catalogos de (CAMAS, SEVICIOS, ESTADOS DE SALUD, ESPECIALIDADES, MOTIVOS DE EGRESO, COVID-19)
- Atenciónes de Pacientes.
- Seguimiento de Salud de Pacientes.
- Egreso/Alta de Pacientes.
- Monitoreo de Pacientes y Reportes (AMBULATORIOS/HOSPITALIZADOS)
- Tablero de Porcentajes de Camas por Servicio.

Desarrollado por [Javier Alejandro Gosain Díaz] repositorio: [https://github.com/goraider/censo-hospitalario][df1]

## Tecnología

CHEP utiliza varias tecnologias de código abierto para funcionar correctamente:

- [Angular] - Framework de Front-End para el Navegador WEB.
- [Laravel] - Framework de Backend para utilizar API RESTful.
- [MYSql] - Sistema Manejador de Base de Datos.

## Instalación.
Necesitas instalar previamente.

* node
* npm
* angular cli
* php
* composer

### LARAVEL (Back-end).

El proyecto esta unificado en una sola carpeta respecto a los Frameworks Angular y Laravel.
Al momento de realizar la instalación de paquetes de servidor web gratuitos y de código abierto para ejecutar un servidor web **(WAMP, XAMPP, LARAGON) se necesita:**
```
Tener instalada la versión de PHP 7.4.2
```
El siguiente esquema de despliegue de carpetas hace referencia a la carpeta raiz del proyecto.

***1.0** Carpeta raiz del proyecto*
```
├──CENSO HOSPITALARIO
├──app
├──bootstrap
├──config
├──database
├──public
├──resources()
├────frontend(ANGULAR FRAMEWORK), AQUI ESTA EL DESARROLLO DEL FRONTEND(COMPONENTES Y VISTAS).
├──storage
├──tests
├──......
├──......
├──.env
├──composer.json
```

Posterior a ello, basta con realizar las instalaciones correspondientes a **LARAVEL** con el comando:

```
composer install
```
*Esto instalara todos los paquetes necesarios correspondientes al archivo **composer.json** de la carpeta raiz, ver **Figura 1.0***

editar el archivo **.env.example** con nuestros accesos correspondientes a la base de datos:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret
```
Esto nos proporcionara una clave para el proyecto en general en la variable **APP_KEY** ejecutando:
```
php artisan key:generate
```
tambien ejecutamos:

```
php artisan jwt:secret
```
esto nos agregara una clave **JWT_SECRET** para utilizar tokens en nuestro archivo .env ya editado previamente.

posterior a ello realizamos el siguiente comando para correr las migraciones, dichas migraciones se traducen en tablas de la base de datos, la configuración esta hecha para el **Sistema Manejador de base de datos *MYSQL*.**

```
php artisan migrate
```
ó si existen archivos para llenar tablas de la base de datos con archivos **.csv**

```
php artisan migrate --seed
```
estos mismos archivos **.csv** estan en la carpeta **seeds**:
***1.1** Carpeta raiz, seeders*
```
├────storage
├──public
├──seeds
├──......
```
Es importante ver la configuración que esta en el archivo **DatabaseSeeder.php** en la carpeta **seeds** este mismo contiene una iteracion para cada archivo **.csv** que se desee insertar a alguna tabla respecto a la migracion previamente generada, tiene que llevar el mismo nombre de la tabla de acuerdo al nombre del archivo **.csv**, ambien podrian generar sus propios seeders en archivos como lo marca la documentación oficial de **LARAVEL** para llenar los datos de las tablas de la base de datos.
```
├────database
├──......
├──migrations
├──seeds
├──......
```
***1.2** Carpeta donde se encuentran las migraciones y seedes*

¡Si todo lo anterior si se ejecuta con exito! En hora buena tendras instalado el back-end de manera satisfactoria.

y con este comando levantaremos el servicio, teniendolo activo:

```
php artisan serve
```


### ANGULAR (Front-end).

ver fugura , ***Raiz de la Carpeta***
Fugura 2.O , ***Carpeta frontend (ANGULAR)***:
```
├──....
├──....
├────resources
├──frontend -> aqui estan las vistas y componentes de ANGULAR.
├──....
```

estando en la carpeta **frontend** ejecutamos el comando:

```
npm install
```

*lo anterior instalara todos los paquetes necesarios correspondientes al archivo **package.json** de la carpeta frontend, ver **Figura 2.0***


Fugura 2.1 , archivo ***environment.ts*** este se debera configurar con el puerto que **LARAVEL** nos proporcione, al tener activo el proyecto normalmente es http://127.0.0.1:8000 :
```
├────────resources
├────frontend
├──src
├─environments
......environment.ts
```
cambiando los valores de las claves como se muestra:
```
  production: false,
  base_url: 'http://127.0.0.1:8000/api'
```
Si todo se ejecuta bien, ANGULAR nos proporcionara un puerto **http://localhost:4200** ejecutando el siguiente comando:

```
npm start
```

Posterio podremos abrir nuestro **Censo Hospitalario** en el navegador web (**Google Chrome de Preferencia**).


Todo lo anterior es para trabajar en un entorno de desarrollador.

Si se realizan cambios en las vistas, se podran compilar desde la carpeta Raiz, ***ver figura 1.0***. 
con el siguiente comando:

```
php artisan generar:build
```
los archivos que genere este comando, se copiaran automaticamente a la carpeta **public**, estos mismos al estar en linea (prueba ó produccion). se podran leer por el servidor donde este alojado el Censo Hospitalario.

```
├──CENSO HOSPITALARIO
├──......
├──......
├──public
├──......
├──......
```
con esto tendremos instalado y configurado nuestro **Censo Hospitalario**.

Fugura 3.O , ***Comandos de Instalación***:

| CARPETA | COMANDO | FRAMEWORK |
|--- |--- |--- |
| ...carpeta raiz | composer install | Laravel |
| ...carpeta raiz | php migrate ó php migrate --seed |Laravel|
| ...carpeta raiz| php artisan serve | Angular |
| ...carpeta raiz| php aritsan generar:build | Angular |
| ...resources/ frontend| npm install | Angular |
| ...resources/ frontend| npm start | Angular |
