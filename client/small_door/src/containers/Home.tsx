import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { BACKEND_URL } from "../constants/constants";

import DecksInterface from "../interfaces/DecksInterface";
import TypesInterface from "../interfaces/TypesInterface";
import Decks from "../components/Deck";

const Home = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<[DecksInterface]>();
  const [types, setTypes] = useState<[TypesInterface]>();
  const [showModal, setShowModal] = useState(false);

  const fetchCards = (id: number) => navigate(`/deck/${id}`);
  const genDeck = (tpe: TypesInterface) =>
    navigate(`/gen-deck`, { state: tpe });

  useEffect(() => {
    const initializeData = async () => {
      const decks = await fetch(`${BACKEND_URL}/decks`);
      const decksRes: [DecksInterface] = await decks.json();

      const types = await fetch(`${BACKEND_URL}/types`);
      const typesRes: [TypesInterface] = await types.json();

      setDecks(decksRes);
      setTypes(typesRes);
    };

    try {
      initializeData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const renderDecks = (decks: [DecksInterface]) =>
    decks.map((deck, index) => (
      <div
        id={deck.id.toString()}
        key={index}
        onClick={() => fetchCards(deck.id)}
      >
        <Decks id={deck.id} name={deck.name} tpe={deck.tpe} />
      </div>
    ));

  const createDeckModal = () => (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={() => setShowModal(false)}
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Create Deck</h3>
            </div>
            <div className="relative p-6 flex-auto">
              {types
                ? types.map((tpe) => (
                    <button id={tpe.id.toString()} onClick={() => genDeck(tpe)} key={tpe.id}>
                      {tpe.name}
                    </button>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );

  return (
    <>
      <button onClick={() => setShowModal(true)}>Create Deck</button>
      {showModal ? createDeckModal() : null}
      {decks ? renderDecks(decks) : null}
    </>
  );
};

export default Home;
