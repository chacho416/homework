
# 🎮 eSports Tournament Manager Pro API

## 📖 Descripción del Dominio del Proyecto
Esta es una API RESTful desarrollada con **FastAPI** diseñada para la gestión integral de torneos de eSports. El sistema permite administrar las entidades fundamentales del ecosistema competitivo:
* **Equipos:** Creación, actualización, listado y eliminación de organizaciones de eSports, incluyendo la gestión de sus logotipos oficiales mediante la carga de archivos estáticos.
* **Jugadores:** Registro de pro-players y su vinculación directa con los equipos mediante relaciones en base de datos.
* **Estadísticas (Caché):** Generación de reportes de alto rendimiento utilizando Redis para almacenar temporalmente cálculos pesados y agilizar las respuestas del servidor.

---

## 🚀 Requisitos Previos
* Python 3.10 o superior.
* Servidor de **Redis** en ejecución (local o en la nube).

---

## ⚙️ Instrucciones de Instalación

**1. Clonar o descargar el proyecto**
Abre tu terminal y ubícate en la carpeta donde deseas guardar el proyecto.

**2. Crear un entorno virtual (Recomendado)**
```bash
python -m venv venv
# En Windows:
venv\Scripts\activate

```

**3. Instalar las dependencias**
Asegúrate de instalar todas las librerías necesarias ejecutando:

```bash
pip install fastapi uvicorn sqlmodel python-multipart "fastapi-cache2[redis]"

```

---

## 🗄️ Cómo Levantar Redis (Especial para Windows)

Dado que Redis está diseñado nativamente para Linux, si estás en Windows tienes esta opción recomendada para levantarlo:

**Opción A: Usar Docker (Recomendada si tienes Docker Desktop)**
Abre una terminal y ejecuta:

```bash
docker run --name mi-redis -p 6379:6379 -d redis

```

---

## 🏃‍♂️ Ejecución del Servidor

Una vez que Redis esté corriendo, levanta tu servidor de FastAPI con:

```bash
uvicorn main:app --reload

```

---

## 💻 Ejemplos de Uso (cURL)

A continuación, se muestran ejemplos de cómo interactuar con la API desde la terminal usando `curl` (también puedes importar estas mismas rutas en Postman).

### 1. Crear un Equipo (POST)

```bash
curl -X 'POST' \
  '[http://127.0.0.1:8000/equipos/](http://127.0.0.1:8000/equipos/)' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "nombre": "Team Liquid",
  "logo_url": null
}'

```

### 2. Listar todos los Equipos (GET)

```bash
curl -X 'GET' \
  '[http://127.0.0.1:8000/equipos/](http://127.0.0.1:8000/equipos/)' \
  -H 'accept: application/json'

```

### 3. Crear un Jugador vinculado a un Equipo (POST)

*(Asegúrate de que el equipo_id exista)*

```bash
curl -X 'POST' \
  '[http://127.0.0.1:8000/jugadores/](http://127.0.0.1:8000/jugadores/)' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "nickname": "Faker",
  "equipo_id": 1
}'

```

### 4. Consultar Estadísticas con Caché de Redis (GET)

*(La primera petición tardará unos segundos, las siguientes serán instantáneas)*

```bash
curl -X 'GET' \
  '[http://127.0.0.1:8000/estadisticas/](http://127.0.0.1:8000/estadisticas/)' \
  -H 'accept: application/json'

