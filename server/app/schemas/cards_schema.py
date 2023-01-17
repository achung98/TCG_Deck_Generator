from pydantic import BaseModel

class CardsSchema(BaseModel):
  id: str
  name: str
  img: str

  class Config:
    orm_mode = True