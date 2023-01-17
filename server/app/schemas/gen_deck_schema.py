from typing import Dict
from pydantic import BaseModel

from schemas.types_schema import TypesSchema
from schemas.decks_cards_schema import DecksCardsSchema

class GenDeckSchema(BaseModel):
  name: str = ''
  tpe: TypesSchema
  cards: Dict[str, DecksCardsSchema]
  total_cards: int