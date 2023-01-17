from main import db

from models.types_model import TypesModel

from services.requests_service import make_request, fetch_card

TYPES_URL = 'https://api.pokemontcg.io/v2/types'

async def backfill_types():
  types_req = await make_request(TYPES_URL)
  types = types_req['data']

  for tpe in types:
    tpe_card_name = f'{tpe} Energy'
    type_card = await fetch_card('energy', f'name:"{tpe_card_name}"&select=images')

    type_model = TypesModel(name=tpe, img=type_card['data'][0]['images']['large'])

    with db():
      db.session.add(type_model)
      db.session.commit()