import os
from random import randint
import httpx
import asyncio

from main import TCG_URL

client = httpx.AsyncClient()

def pick_card_number(cards_count):
  return randint(1, cards_count)

async def make_request(url):
  res = await client.get(url, headers={'X-Api-Key': os.environ['TCG_API_KEY']})
  return res.json()

async def request_runner(reqs):
  res = await asyncio.gather(*reqs)
  return res

async def fetch_card(super_type, extra_query = ''):
  res = await make_request(f'{TCG_URL}?page=1&pageSize=1&q=supertype:{super_type} {extra_query}')
  return res

def gen_search_card_requests(num_of_req, cards_count, super_type, extra_query = ''):
  reqs = []
  for num in range(1, num_of_req + 1):
    page = pick_card_number(cards_count)
    url = f'{TCG_URL}?page={page}&pageSize=1&q=supertype:{super_type} {extra_query}'
    reqs.append(asyncio.ensure_future(make_request(url)))
  
  return reqs