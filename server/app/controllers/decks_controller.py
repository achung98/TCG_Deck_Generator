from typing import List, Union
from fastapi import status, HTTPException, Query

from main import app, db
from models.decks_model import DecksModel
from models.cards_model import CardsModel
from models.decks_cards_model import DecksCardsModel
from models.gen_deck_dataclass import GenDeckModel

from schemas.decks_schema import DecksSchema
from schemas.decks_cards_schema import DecksCardsSchema
from schemas.types_schema import TypesSchema
from schemas.gen_deck_schema import GenDeckSchema

from services.deck_builder import pick_pokemons, pick_energies, pick_trainers

@app.get('/decks', status_code=status.HTTP_200_OK)
def get_decks(type_id: Union[List[int], None] = Query(default=None), name: str = None) -> List[DecksSchema]:
  if(type_id and name):
    decks = db.session.query(DecksModel).filter(DecksModel.type_id.in_(type_id), DecksModel.name.ilike(f'%{name}%')).order_by(DecksModel.id).all()
  elif(type_id):
    decks = db.session.query(DecksModel).filter(DecksModel.type_id.in_(type_id)).all()
  elif(name):
    decks = db.session.query(DecksModel).filter(DecksModel.name.ilike(f'%{name}%')).order_by(DecksModel.id).all()
  else:
    decks = db.session.query(DecksModel).all()

  return decks

@app.get('/decks/{deck_id}')
def get_deck_contents(deck_id: int) -> List[DecksCardsSchema]: 
  cards = db.session.query(DecksCardsModel).filter(DecksCardsModel.deck_id == deck_id).order_by(DecksCardsModel.id).all()

  if(not cards):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Deck information not found')

  return cards

@app.post('/gen-deck', status_code=status.HTTP_200_OK)
async def gen_deck(tpe: TypesSchema) -> GenDeckSchema:
  deck = GenDeckModel(tpe, {}, 0)
  await pick_pokemons(deck)
  await pick_energies(deck)
  await pick_trainers(deck)

  return deck

@app.post('/save-deck', status_code=status.HTTP_200_OK)
def save_deck(deck: GenDeckSchema):
  db.session.autoflush=True

  # Create new deck with specified type
  new_deck = DecksModel(name=deck.name, type_id=deck.tpe.id)
  db.session.add(new_deck)

  # Save cards to deck
  for card_id, card in deck.cards.items():
    # Save card if it doesn't exist
    temp_card = db.session.query(CardsModel).filter(CardsModel.id == card_id).first()
    if(not temp_card):
      new_card = CardsModel(id=card_id, name=card.card.name, img=card.card.img, where_to_buy=card.card.where_to_buy)
      db.session.add(new_card)

    # Save card to deck  
    deck_card = DecksCardsModel(deck_id=new_deck.id, card_id=card_id, number_of_cards=card.number_of_cards)
    db.session.add(deck_card)
  
  db.session.commit()