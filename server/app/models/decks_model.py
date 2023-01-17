from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from main import Base

class DecksModel(Base):
  __tablename__ = 'decks'

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String)
  type_id = Column(Integer, ForeignKey('types.id'))

  tpe = relationship('TypesModel', lazy='joined')
