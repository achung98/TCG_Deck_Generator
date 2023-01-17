from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from main import Base

class DecksCardsModel(Base):
  __tablename__ = 'decks_cards'

  deck_id = Column(Integer, ForeignKey('decks.id'), primary_key=True, index=True)
  card_id = Column(String, ForeignKey('cards.id'), primary_key=True, index=True)
  number_of_cards = Column(Integer)

  card = relationship('CardsModel', lazy='joined')