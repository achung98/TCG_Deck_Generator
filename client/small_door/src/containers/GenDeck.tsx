import { useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "react-text-spinners";

import { BACKEND_URL } from "../constants/constants";

import GenDeckInterface from "../interfaces/GenDeckInterface";
import Cards from "../components/Cards";

const GenDeck = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [generating, setGenerating] = useState(true);
  const [generatedDeck, setGeneratedDeck] = useState<GenDeckInterface>();
  const saveAsRef = useRef<HTMLInputElement>(null);

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
        //@ts-ignore
        <Cards props={generatedCards[generatedCardId].card} index={j} />
      ));
      cards.push(...cardsNumber);
    }

    return cards;
  };

  const saveDeck = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    const saveAs = saveAsRef.current?.value;
    const newDeck = {
      ...generatedDeck,
      name: saveAs ?? "New Deck",
    };

    // @ts-ignore
    await fetch(`${BACKEND_URL}/save-deck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDeck),
    });

    navigate("/");
  };

  const renderSaveForm = () => (
    <form className="flex sticky top-0 w-[50%] z-50 py-3 bg-white items-center justify-center" onSubmit={e => saveDeck(e)}>
      <div className="w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4.508 16.557l1.406-1.9c-.289-1.201-.005-2.543.869-4.008.341-.572.753-1.128 1.211-1.668.277.649.857 1.694 1.131 2.081-.036-.519-.267-2.085.002-3.286 1.036-.995 2.232-1.903 3.49-2.693.094.599.311 1.812.449 2.135.06-.433.336-1.993.77-2.851 1.875-1.032 3.814-1.787 5.516-2.141-.459 1.311-1.147 2.976-2.021 4.713-.85.59-2.346 1.092-2.908 1.189.469.132 1.544.22 2.152.247-.193.348-.392.696-.599 1.042-.526.879-1.069 1.664-1.617 2.39-.943.464-2.371.845-2.937.875.362.19 1.237.413 1.777.54-1.717 1.904-3.436 3.015-4.907 3.179 1.232-2.189 2.239-3.938 2.642-4.505-4.444 3.412-7.182 8.675-8.934 12.104l2.505-.789c.421-.77 1.727-2.952 2.772-4.829.268.041.535.06.801.06 7.398.001 13.598-15.213 13.922-18.442-8.141 0-21.536 8.975-17.492 16.557z" />
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          className="border border-gray-300 text-sm rounded-lg w-full pl-10 p-2.5 focus:border-sb-hard focus:outline-none"
          placeholder="Save As (Ex.: Super Awesome TCG Deck)"
          required
          ref={saveAsRef}
          maxLength={25}
        />
      </div>

      <button
        type="submit"
        className="p-2.5 ml-2 text-sm font-medium text-white bg-sb rounded-lg border border-sb hover:bg-sb-hard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M15.563 22.282l-3.563.718.72-3.562 2.843 2.844zm-2.137-3.552l2.845 2.845 7.729-7.73-2.845-2.845-7.729 7.73zm-2.426-9.73h2.996v-5h-2.996v5zm-.636 12h-8.364v-18h3v9h12v-9h.172l2.828 2.829v3.545l2-1.999v-2.375l-4-4h-18v22h9.953l.411-2zm-3.364-18h8v7h-8v-7z" />
        </svg>
      </button>
    </form>
  );

  return (
    <>
      {generating ? (
        <div className="flex justify-center items-center h-[80vh] w-full flex-col gap-5">
          <p className="font-def text-2xl font-bold animate-loading-heartbeat text-sb-hard">Generating...</p>
          <Spinner theme="fish" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-screen flex justify-center sticky top-0 z-50 bg-white">
            {renderSaveForm()}
          </div>
          <div className="flex flex-wrap items-center min-[1180px]:justify-start justify-center">
            {renderGeneratedDeck()}
          </div>
        </div>
      )}
    </>
  );
};

export default GenDeck;
