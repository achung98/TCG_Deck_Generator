from typing import List
from fastapi import status, HTTPException

from main import app, db
from models.types_model import TypesModel

from schemas.types_schema import TypesSchema

@app.get('/types', status_code=status.HTTP_200_OK)
def get_types() -> List[TypesSchema]:
  types = db.session.query(TypesModel).all()

  return types