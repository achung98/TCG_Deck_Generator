from pydantic import BaseModel

from schemas.types_schema import TypesSchema

class DecksSchema(BaseModel):
  id: int
  name: str
  tpe: TypesSchema

  class Config:
    orm_mode = True