from dataclasses import dataclass
from typing import Dict

from models.types_model import TypesModel
from models.decks_cards_model import DecksCardsModel

@dataclass
class GenDeckModel:
  tpe: TypesModel
  cards: Dict[str, DecksCardsModel]
  total_cards: int