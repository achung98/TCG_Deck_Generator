from pydantic import BaseModel

class TypesSchema(BaseModel):
  id: int
  name: str
  img: str

  class Config:
    orm_mode = True