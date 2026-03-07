from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select  # <-- Agregamos 'select' aquí
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
import shutil
import os
import time
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache
from redis import asyncio as aioredis
from colorama import Fore, Style, init
# ... (tus otras importaciones)
from database import crear_base_de_datos_y_tablas, obtener_sesion
# Agregamos Jugador y JugadorBase a nuestra importación de modelos:
from models.entities import Equipo, EquipoBase, Jugador, JugadorBase

# Inicializar colorama para colores en la consola
init()

# --- CONFIGURACIÓN DE INICIO ---
# Esta función se ejecuta automáticamente al prender el servidor
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(Fore.GREEN + "🚀 Iniciando servidor y conectando a la base de datos..." + Style.RESET_ALL)
    crear_base_de_datos_y_tablas()
    print(Fore.BLUE + "📊 Base de datos y tablas creadas exitosamente." + Style.RESET_ALL)
    
    # --- NUEVO: Configuración de Redis ---
    # Nota: Esta es la dirección estándar si instalas Redis en tu computadora
    print(Fore.YELLOW + "🔄 Configurando Redis para caché..." + Style.RESET_ALL)
    redis = aioredis.from_url("redis://localhost:6379", encoding="utf8", decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="esports-cache")
    print(Fore.GREEN + "✅ Redis configurado correctamente." + Style.RESET_ALL)
    
    yield
    print(Fore.RED + "🛑 Apagando servidor..." + Style.RESET_ALL)

# Inicializamos la aplicación
app = FastAPI(
    title="eSports Tournament Manager Pro API",
    version="1.0.0",
    lifespan=lifespan
)
# Creamos la carpeta física si no existe
os.makedirs("static/logos", exist_ok=True)

# Le decimos a FastAPI que todo lo que esté en la carpeta "static" 
# se pueda ver desde el navegador en la ruta "/static"
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- RUTAS (ENDPOINTS) ---

@app.post("/equipos/", response_model=Equipo, tags=["Equipos"])
def crear_equipo(equipo: EquipoBase, session: Session = Depends(obtener_sesion)):
    """
    Registra un nuevo equipo de eSports en la base de datos.
    """
    # 1. Transformamos los datos recibidos (EquipoBase) en un registro de base de datos (Equipo)
    db_equipo = Equipo.model_validate(equipo)
    
    # 2. Lo preparamos para guardarlo
    session.add(db_equipo)
    
    # 3. Confirmamos los cambios en la base de datos (commit)
    session.commit()
    
    # 4. Refrescamos el objeto para obtener el 'id' que SQLite le asignó automáticamente
    session.refresh(db_equipo)
    
    return db_equipo
# ... (Aquí arriba está tu código anterior de @app.post("/equipos/")) ...

@app.get("/equipos/", response_model=list[Equipo], tags=["Equipos"])
def obtener_equipos(session: Session = Depends(obtener_sesion)):
    """
    Devuelve la lista de todos los equipos registrados en la base de datos.
    """
    # Usamos 'select' para pedirle a la base de datos TODOS los Equipos
    equipos = session.exec(select(Equipo)).all()
    return equipos

@app.post("/jugadores/", response_model=Jugador, tags=["Jugadores"])
def crear_jugador(jugador: JugadorBase, session: Session = Depends(obtener_sesion)):
    """
    Registra un nuevo jugador y lo vincula a un equipo existente usando el equipo_id.
    """
    # 1. Validamos los datos del jugador
    db_jugador = Jugador.model_validate(jugador)
    
    # 2. Guardamos en base de datos
    session.add(db_jugador)
    session.commit()
    session.refresh(db_jugador)
    
    return db_jugador
# ... (Aquí arriba está tu código anterior de @app.post("/jugadores/")) ...

@app.delete("/equipos/{equipo_id}", tags=["Equipos"])
def eliminar_equipo(equipo_id: int, session: Session = Depends(obtener_sesion)):
    """
    Elimina un equipo de la base de datos usando su número de ID.
    """
    # 1. Buscamos el equipo en la base de datos usando su ID
    equipo = session.get(Equipo, equipo_id)
    
    # 2. Validamos: Si el equipo no se encontró, devolvemos un error 404
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    # 3. Si lo encontró, procedemos a borrarlo
    session.delete(equipo)
    
    # 4. Confirmamos los cambios en la base de datos
    session.commit()
    
    # Devolvemos un mensaje de éxito
    return {"status": "success", "message": f"El equipo con ID {equipo_id} ha sido eliminado exitosamente"}
# ... (Aquí arriba está tu código de @app.delete("/equipos/{equipo_id}")) ...

@app.patch("/equipos/{equipo_id}", response_model=Equipo, tags=["Equipos"])
def actualizar_equipo(equipo_id: int, equipo_actualizado: EquipoBase, session: Session = Depends(obtener_sesion)):
    """
    Actualiza la información de un equipo existente.
    """
    # 1. Buscamos el equipo original en la base de datos
    db_equipo = session.get(Equipo, equipo_id)
    
    # 2. Si no existe, devolvemos un error 404
    if not db_equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    # 3. Extraemos los datos nuevos que el usuario envió
    # exclude_unset=True significa que solo tomaremos los campos que el usuario realmente modificó
    datos_nuevos = equipo_actualizado.model_dump(exclude_unset=True)
    
    # 4. Actualizamos el equipo original con los datos nuevos
    for llave, valor in datos_nuevos.items():
        setattr(db_equipo, llave, valor)
    
    # 5. Guardamos los cambios en la base de datos
    session.add(db_equipo)
    session.commit()
    session.refresh(db_equipo)
    
    # Devolvemos el equipo ya actualizado
    return db_equipo
# ... (Aquí termina tu endpoint de crear_jugador) ...

@app.get("/jugadores/", response_model=list[Jugador], tags=["Jugadores"])
def obtener_jugadores(session: Session = Depends(obtener_sesion)):
    """
    Devuelve la lista de todos los jugadores registrados.
    """
    jugadores = session.exec(select(Jugador)).all()
    return jugadores

@app.get("/jugadores/{jugador_id}", response_model=Jugador, tags=["Jugadores"])
def obtener_jugador_por_id(jugador_id: int, session: Session = Depends(obtener_sesion)):
    """
    Busca y devuelve los detalles de un jugador en específico usando su ID.
    """
    jugador = session.get(Jugador, jugador_id)
    
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
        
    return jugador

@app.patch("/jugadores/{jugador_id}", response_model=Jugador, tags=["Jugadores"])
def actualizar_jugador(jugador_id: int, jugador_actualizado: JugadorBase, session: Session = Depends(obtener_sesion)):
    """
    Actualiza la información de un jugador existente (por ejemplo, cambiar su equipo_id o su nickname).
    """
    db_jugador = session.get(Jugador, jugador_id)
    
    if not db_jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    
    # Extraemos solo los datos que el usuario envió en la petición
    datos_nuevos = jugador_actualizado.model_dump(exclude_unset=True)
    
    for llave, valor in datos_nuevos.items():
        setattr(db_jugador, llave, valor)
        
    session.add(db_jugador)
    session.commit()
    session.refresh(db_jugador)
    
    return db_jugador

@app.delete("/jugadores/{jugador_id}", tags=["Jugadores"])
def eliminar_jugador(jugador_id: int, session: Session = Depends(obtener_sesion)):
    """
    Elimina a un jugador de la base de datos usando su ID.
    """
    jugador = session.get(Jugador, jugador_id)
    
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
        
    session.delete(jugador)
    session.commit()
    
    return {"status": "success", "message": f"El jugador con ID {jugador_id} ha sido eliminado exitosamente"}
@app.post("/equipos/{equipo_id}/logo/", tags=["Equipos - Archivos"])
def subir_logo_equipo(equipo_id: int, archivo: UploadFile = File(...), session: Session = Depends(obtener_sesion)):
    """
    Sube una imagen para usarla como logo del equipo.
    """
    # 1. Verificamos que el equipo exista
    equipo = session.get(Equipo, equipo_id)
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    # 2. Validamos que sea una imagen (opcional pero recomendado)
    if not archivo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

    # 3. Generamos la ruta donde se guardará físicamente
    # Ejemplo: static/logos/equipo_5_logo.png
    extension = archivo.filename.split(".")[-1]
    nombre_archivo = f"equipo_{equipo_id}_logo.{extension}"
    ruta_guardado = f"static/logos/{nombre_archivo}"

    # 4. Guardamos el archivo en el disco duro
    with open(ruta_guardado, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    # 5. Actualizamos el registro del equipo con la URL de su nuevo logo
    # Nota: Asegúrate de tener un campo 'logo_url: str | None = None' en tu modelo EquipoBase
    url_publica = f"/static/logos/{nombre_archivo}"
    equipo.logo_url = url_publica
    
    session.add(equipo)
    session.commit()
    session.refresh(equipo)

    return {"status": "success", "message": "Logo subido exitosamente", "logo_url": url_publica}
@app.get("/estadisticas/", tags=["Estadísticas Avanzadas"])
@cache(expire=60)
def obtener_estadisticas_globales(session: Session = Depends(obtener_sesion)):
    """
    Simula una operación muy pesada que tarda varios segundos en procesarse.
    Gracias a Redis, esto solo tardará la primera vez.
    """
    # Simulamos que la base de datos está haciendo un cálculo súper complejo
    time.sleep(3) 
    
    # Contamos cuántos registros hay
    equipos = session.exec(select(Equipo)).all()
    jugadores = session.exec(select(Jugador)).all()
    
    return {
        "status": "success",
        "message": "Reporte generado exitosamente",
        "total_equipos_registrados": len(equipos),
        "total_jugadores_registrados": len(jugadores),
        "nota": "Si esto tardó 3 segundos, NO usó caché. Si fue instantáneo, usó Redis."
    }