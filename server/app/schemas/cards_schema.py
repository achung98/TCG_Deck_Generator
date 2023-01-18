from pydantic import BaseModel

class CardsSchema(BaseModel):
  id: str
  name: str
  img: str
  where_to_buy: str
  class Config:
    orm_mode = True