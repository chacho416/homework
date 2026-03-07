from sqlmodel import SQLModel, create_engine, Session

# 1. Definimos el nombre de nuestra base de datos local (SQLite)
sqlite_file_name = "esports_tournament.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# 2. Creamos el "motor" que se encarga de hablar con la base de datos
# check_same_thread=False es necesario para SQLite en FastAPI
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

# 3. Función para crear las tablas cuando arranca el servidor
def crear_base_de_datos_y_tablas():
    SQLModel.metadata.create_all(engine)

# 4. Función (Dependencia) que le da a cada ruta una sesión activa de la BD
def obtener_sesion():
    with Session(engine) as session:
        yield session
        yield session