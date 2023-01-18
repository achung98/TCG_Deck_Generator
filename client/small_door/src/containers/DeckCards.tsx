import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { BACKEND_URL } from "../constants/constants";

import DecksCardsInterface from "../interfaces/DecksCardsInterface";
import Cards from "../components/Cards";

const DeckCards = () => {
  const { id } = useParams();
  const [deckCards, setDeckCards] = useState<[DecksCardsInterface]>();

  const renderDeckCards = (deckCards: [DecksCardsInterface]) => {
    const cards: any = [];
    deckCards.forEach((deckCard) => {
      const cardsNumber = Array.from<Element>({
        length: deckCard.number_of_cards,
      }).map((_, j) => (
        <div id={deckCard.card.id + j} key={deckCard.card.id + j}>
          <Cards
            id={deckCard.card.id}
            name={deckCard.card.name}
            img={deckCard.card.img}
          />
        </div>
      ));
      cards.push(...cardsNumber);
    });

    return cards;
  };

  useEffect(() => {
    const fetchCards = async () => {
      const data = await fetch(`${BACKEND_URL}/decks/${id}`);
      const res: [DecksCardsInterface] = await data.json();

      setDeckCards(res);
    };

    try {
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return deckCards ? <>{renderDeckCards(deckCards)}</> : null;
};

export default DeckCards;
