import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "react-text-spinners";

import { BACKEND_URL } from "../constants/constants";

import GenDeckInterface from "../interfaces/GenDeckInterface";
import Cards from "../components/Cards";

const GenDeck = () => {
  const { state } = useLocation();
  const [generating, setGenerating] = useState(true);
  const [generatedDeck, setGeneratedDeck] = useState<GenDeckInterface>();

  useEffect(() => {
    const genDeck = async () => {
      const data = await fetch(`${BACKEND_URL}/gen-deck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      const res = await data.json();

      setGenerating(false);
      setGeneratedDeck(res);
    };

    try {
      genDeck();
    } catch (err) {
      setGenerating(false);
      console.error(err);
    }
  }, []);

  const renderGeneratedDeck = () => {
    const cards = [];
    const generatedCards = generatedDeck?.cards;
    for (let generatedCardId in generatedCards) {
      const cardsNumber = Array.from<Element>({
        length: generatedCards[generatedCardId].number_of_cards,
      }).map((_, j) => (
        <div id={generatedCardId + j} key={generatedCardId + j}>
          <Cards
            id={generatedCardId}
            name={generatedCards[generatedCardId].card.name}
            img={generatedCards[generatedCardId].card.img}
          />
        </div>
      ));
      cards.push(...cardsNumber);
    }

    return cards;
  };

  const saveDeck = async () => {
    await fetch(`${BACKEND_URL}/save-deck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(generatedDeck),
    });
  }

  return (
    <>
      {generating ? (
        <Spinner theme="bullseye" />
      ) : (
        <>
          <button onClick={() => saveDeck()}>Save</button>
          {renderGeneratedDeck()}
        </>
      )}
    </>
  );
};

export default GenDeck;
