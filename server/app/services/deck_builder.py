from collections import deque 
from random import choice

from models.gen_deck_dataclass import GenDeckModel
from models.cards_model import CardsModel
from services.requests_service import fetch_card, gen_search_card_requests, request_runner

from main import db

DECK_CONSTRAINTS = {
  'max_cards': 60,
  'repeats': 4,
  'min_pokemons': 12,
  'max_pokemons': 16,
  'energy': 10,
}

CARD_DATA_SELECT_QUERY = 'select=id,name,images,evolvesFrom,evolvesTo'

async def pick_pokemon(pokemon_card, tpe, picks, picked, form = ''):
  data = pokemon_card['data']

  # If card of that type is not found, does not include this card nor it's evolution/preevolutions
  if(not data):
    picks.clear()
    return
  
  res = data[0]

  if(res['name'] in picked):
    return

  card = CardsModel(id=res['id'], name=res['name'], img=res['images']['large'])

  if(form == 'from'):
    picks.appendleft(card)
  else:
    picks.append(card)
  
  picked.add(res['name'])

  if('evolvesFrom' in res):
    evolves_from = res['evolvesFrom']
    new_pokemon_card = await fetch_card('pokemon', f'types:"{tpe}" name:"{evolves_from}"')
    await pick_pokemon(new_pokemon_card, tpe, picks, picked, 'from')

  if('evolvesTo' in res):
    picked_evolution = choice(res['evolvesTo'])
    new_pokemon_card = await fetch_card('pokemon', f'types:"{tpe}" name:"{picked_evolution}"')
    await pick_pokemon(new_pokemon_card, tpe, picks, picked)

async def pick_pokemons(deck: GenDeckModel):
  pokemon_cards_count = await fetch_card('pokemon', f'types:"{deck.tpe.name}"')

  while(deck.total_cards < DECK_CONSTRAINTS['min_pokemons']):
    reqs = gen_search_card_requests(DECK_CONSTRAINTS['min_pokemons'], pokemon_cards_count['totalCount'], 'pokemon', f'types:{deck.tpe.name}&{CARD_DATA_SELECT_QUERY}')
    pokemon_cards = await request_runner(reqs)
    
    for pokemon_card in pokemon_cards:
      picks = deque([])
      await pick_pokemon(pokemon_card, deck.tpe.name, picks, set())

      for pick in picks:
        if deck.total_cards < DECK_CONSTRAINTS['max_pokemons']:
          id = pick.id
          if id not in deck.cards:
            deck.cards[id] = {
              'card': pick,
              'number_of_cards': 1
            }
            deck.total_cards += 1
          elif deck.cards[id]['number_of_cards'] < DECK_CONSTRAINTS['repeats']:
            deck.cards[id]['number_of_cards'] += 1
            deck.total_cards += 1

async def pick_energies(deck: GenDeckModel):
  energy = await fetch_card('energy', f'name:"{deck.tpe.name} Energy"&{CARD_DATA_SELECT_QUERY}')
  card = CardsModel(id=energy['data'][0]['id'], name=energy['data'][0]['name'], img=energy['data'][0]['images']['large'])

  deck.cards[card.id] = {
    'card': card,
    'number_of_cards': 10
  }

  deck.total_cards += 10

async def pick_trainers(deck: GenDeckModel):
  trainers_card_count = await fetch_card('trainer')

  while(deck.total_cards < DECK_CONSTRAINTS['max_cards']):
    reqs = gen_search_card_requests(DECK_CONSTRAINTS['max_cards'] - deck.total_cards, trainers_card_count['totalCount'], 'trainer')
    trainer_cards = await request_runner(reqs)

    for trainer_card in trainer_cards:
      card = CardsModel(id=trainer_card['data'][0]['id'], name=trainer_card['data'][0]['name'], img=trainer_card['data'][0]['images']['large'])

      if(card.id not in deck.cards):
        deck.cards[card.id] = {
          'card': card,
          'number_of_cards': 1
        }
        deck.total_cards += 1
      elif(deck.cards[card.id]['number_of_cards'] < DECK_CONSTRAINTS['repeats']):
        deck.cards[card.id]['number_of_cards'] += 1
        deck.total_cards += 1