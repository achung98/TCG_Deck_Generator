from pydantic import BaseModel

from schemas.cards_schema import CardsSchema

class DecksCardsSchema(BaseModel):
  card: CardsSchema
  number_of_cards: int

  class Config:
    orm_mode = True