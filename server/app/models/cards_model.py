from sqlalchemy import Column, String

from main import Base

class CardsModel(Base):
  __tablename__ = 'cards'

  id = Column(String, primary_key=True, index=True)
  name = Column(String)
  img = Column(String)

  def __repr__(self):
    return f'<Card "{self.name}">'