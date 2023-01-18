import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { BACKEND_URL } from "../constants/constants";

import DecksCardsInterface from "../interfaces/DecksCardsInterface";
import Cards from "../components/Cards";

const DeckCards = () => {
  const { id } = useParams();
  const [deckCards, setDeckCards] = useState<DecksCardsInterface[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<JSX.Element>();

  useEffect(() => {
    const fetchCards = async () => {
      const data = await fetch(`${BACKEND_URL}/decks/${id}`);
      const res: DecksCardsInterface[] = await data.json();

      setDeckCards(res);
    };

    try {
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const createCardModal = (img: string, name: string, whereToBuy: string) => {
    const modal = (
      <>
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none"
          onClick={() => {
            setShowModal(false);
            setModal(undefined);
          }}
        >
          <a
            href={whereToBuy}
            target="_blank"
            rel="noreferrer"
            className={`relative w-auto my-6 mx-auto max-w-xl z-50 ${
              whereToBuy ? "hover:cursor-alias" : ""
            }`}
          >
            <img src={img} alt={name} />
          </a>
        </div>
        <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
      </>
    );

    setShowModal(true);
    setModal(modal);
  };

  const renderDeckCards = (deckCards: DecksCardsInterface[]) => {
    const cards: any = [];
    deckCards.forEach((deckCard) => {
      const cardsNumber = Array.from<Element>({
        length: deckCard.number_of_cards,
      }).map((_, j) => (
        <Cards
          props={deckCard.card}
          index={j}
          createCardModal={createCardModal}
        />
      ));
      cards.push(...cardsNumber);
    });

    return cards;
  };

  return (
    <>
      {deckCards ? (
        <div className="flex flex-wrap items-center min-[1180px]:justify-start justify-center mt-5">
          {renderDeckCards(deckCards)}
        </div>
      ) : (
        <div className="flex justify-center mt-5">
          <p>No Cards Found</p>
        </div>
      )}
      {showModal ? modal : null}
    </>
  );
};

export default DeckCards;
