from typing import Optional
from sqlmodel import SQLModel, Field

# --- MODELOS DE EQUIPO ---

class EquipoBase(SQLModel):
    # Validación Avanzada: El nombre debe tener entre 3 y 50 caracteres
    nombre: str = Field(min_length=3, max_length=50)
    logo_url: Optional[str] = None

    # Requisito: Ejemplo usando JSON Schema para la documentación interactiva
    model_config = {
        "json_schema_extra": {
            "example": {
                "nombre": "Team Liquid",
                "logo_url": "/static/logos/team_liquid.png"
            }
        }
    }

class Equipo(EquipoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


# --- MODELOS DE JUGADOR ---

class JugadorBase(SQLModel):
    # Validación Avanzada: El nickname no puede tener menos de 2 letras ni más de 30
    nickname: str = Field(min_length=2, max_length=30)
    equipo_id: Optional[int] = Field(default=None, foreign_key="equipo.id")

    # Requisito: Ejemplo usando JSON Schema
    model_config = {
        "json_schema_extra": {
            "example": {
                "nickname": "Faker",
                "equipo_id": 1
            }
        }
    }

class Jugador(JugadorBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)