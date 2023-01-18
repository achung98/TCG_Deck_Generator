from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from main import Base

class DecksCardsModel(Base):
  __tablename__ = 'decks_cards'

  id = Column(Integer, primary_key=True)
  deck_id = Column(Integer, ForeignKey('decks.id'), index=True)
  card_id = Column(String, ForeignKey('cards.id'), index=True)
  number_of_cards = Column(Integer)

  card = relationship('CardsModel', lazy='joined')