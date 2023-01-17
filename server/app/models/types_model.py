from sqlalchemy import Column, Integer, String

from main import Base

class TypesModel(Base):
  __tablename__ = 'types'

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String)
  img = Column(String)