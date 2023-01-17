from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi_sqlalchemy import DBSessionMiddleware, db
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()

app = FastAPI()
app.add_middleware(DBSessionMiddleware, db_url='postgresql:///test')
Base = declarative_base()

TCG_URL = 'https://api.pokemontcg.io/v2/cards'

from models import decks_model
from models import cards_model
from models import decks_cards_model
from models import types_model

from controllers import decks_controller
from controllers import types_controller

# backfill types
# from services import types_backfill
# @app.get('/')
# async def backfill():
#  await types_backfill.backfill_types()
