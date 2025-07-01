# ManabiGames Backend 🎮

Backend desarrollado con Spring Boot para la aplicación **ManabiGames**, un catálogo retro de videojuegos que permite gestionar una lista de juegos favoritos de forma dinámica.

## 🌐 Tecnologías utilizadas

- **Java 17**
- **Spring Boot 3.2**
  - Spring Web
  - Spring Data JPA
  - Spring Validation
- **PostgreSQL** (vía Supabase)
- **Maven** como sistema de gestión de dependencias

## 📂 Estructura del proyecto

src
└── main
├── java
│ └── com.manabigames.backend
│ ├── controller # Controladores REST
│ ├── dto # Clases DTO (Data Transfer Object)
│ ├── entity # Entidades JPA
│ ├── exception # Excepciones personalizadas
│ ├── repository # Interfaces para acceso a datos
│ ├── service # Lógica de negocio
│ └── config # Configuración CORS u otros
└── resources
└── application.properties

## 🚀 Funcionalidades principales

- Obtener, agregar, actualizar y eliminar juegos favoritos
- Evita duplicados usando `id_rawg`
- Buscar juegos por:
  - Nombre (búsqueda parcial e insensible a mayúsculas)
  - Consola
  - Año de lanzamiento
- Verificación de existencia por ID de RAWG
- Obtener estadísticas básicas (ej. juegos por década)

## 🛠️ Requisitos previos

- Java 17 instalado
- Maven instalado
- Cuenta en [Supabase](https://supabase.io/) o base de datos PostgreSQL local

## ⚙️ Configuración
En `src/main/resources/application.properties`, configurar la conexión a tu base de datos:

properties
spring.datasource.url=jdbc:postgresql://<host>:<puerto>/<nombre_bd>
spring.datasource.username=<usuario>
spring.datasource.password=<contraseña>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

🧪 Probar endpoints
Puedes probar los endpoints con:

Postman

Insomnia

O desde el frontend (detalles.html, formulario.html, etc.)

Algunos endpoints útiles
GET /favoritos

GET /favoritos?ordenar=nombre

POST /favoritos

PUT /favoritos/{id}

DELETE /favoritos/{id}

GET /favoritos/buscar?nombre=zelda

GET /favoritos/verificar-rawg/{idRawg}

GET /favoritos/stats

📦 Compilar y ejecutar
bash
Copiar
Editar
# Desde la raíz del proyecto
mvn clean install
mvn spring-boot:run
🧑‍💻 Autor
Proyecto realizado por Diego Villota y Axel Subiabre como parte de su evaluación para el ramo de Desarrollo Java Web.
