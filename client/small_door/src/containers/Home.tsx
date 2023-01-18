import { useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { BACKEND_URL } from "../constants/constants";

import DecksInterface from "../interfaces/DecksInterface";
import TypesInterface from "../interfaces/TypesInterface";
import Decks from "../components/Deck";

const fetchDecks = async (searchQuery: string = "") => {
  const decks = await fetch(`${BACKEND_URL}/decks${searchQuery ?? ""}`);
  const decksRes: [DecksInterface] = await decks.json();

  return decksRes;
};

const fetchTypes = async (searchQuery: string = "") => {
  const types = await fetch(`${BACKEND_URL}/types`);
  const typesRes: [TypesInterface] = await types.json();

  return typesRes;
};

const Home = () => {
  // Initialize colors
  const typeColors =
    "bg-Colorless bg-Darkness bg-Dragon bg-Fairy bg-Fighting bg-Fire bg-Grass bg-Lightning bg-Metal bg-Psychic bg-Water";
  const navigate = useNavigate();
  const [decks, setDecks] = useState<DecksInterface[]>([]);
  const [types, setTypes] = useState<TypesInterface[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showTypesDropDown, setShowTypesDropDown] = useState(false);
  const [filterByTypes, setFilterByTypes] = useState<TypesInterface[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const genDeck = (tpe: TypesInterface) =>
    navigate(`/gen-deck`, { state: tpe });

  useEffect(() => {
    const initializeData = async () => {
      const decksRes = await fetchDecks();
      const typesRes = await fetchTypes();

      setDecks(decksRes);
      setTypes(typesRes);
    };

    try {
      initializeData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const updateTypesFilter = async () => {
      const searchQuery = searchRef.current?.value;
      const filterTypesQuery = filterByTypes
        .map((tpe) => tpe.id)
        .join("&type_id=");

      if (!searchQuery) {
        const decks = await fetchDecks(`?type_id=${filterTypesQuery}`);
        setDecks(decks);
      } else {
        const decks = await fetchDecks(
          `?name=${searchQuery}&type_id=${filterTypesQuery}`
        );
        setDecks(decks);
      }
    };

    try {
      if (filterByTypes.length) updateTypesFilter();
    } catch (err) {
      console.error(err);
    }
  }, [filterByTypes]);

  const searchDecks = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = searchRef.current?.value;

    if (!searchQuery) {
      const decks = await fetchDecks();
      setDecks(decks);
    } else {
      const decks = await fetchDecks(`?name=${searchQuery}`);
      setDecks(decks);
    }
  };

  const renderDecks = (decks: DecksInterface[]) => (
    <div className="flex flex-wrap items-center min-[1180px]:justify-start justify-center">
      {decks.map((deck, index) => (
        <Decks deckProps={deck} index={index} />
      ))}
    </div>
  );

  const addTypeFilter = async (tpe: TypesInterface) => {
    setShowTypesDropDown(false);
    setFilterByTypes((prev) =>
      prev.some((e) => e.id === tpe.id) ? prev : [...prev, tpe]
    );
  };

  const clearFilters = async () => {
    const decks = await fetchDecks();
    // @ts-ignore
    searchRef.current.value = "";
    setDecks(decks);
    setFilterByTypes([]);
  };

  const createDeckModal = () => (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={() => setShowModal(false)}
      >
        <div className="relative w-auto my-6 mx-auto max-w-xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col justify-center w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Create Deck</h3>
            </div>
            <div className="flex p-6 flex-auto gap-3 flex-wrap justify-start">
              {types
                ? types.map((tpe) => {
                    return (
                      <button
                        id={tpe.id.toString()}
                        className={`rounded-md border border-${tpe.name} bg-${tpe.name} p-1 mt-2 text-xs font-medium text-white shadow-sm h-fit`}
                        onClick={() => genDeck(tpe)}
                        key={tpe.id}
                      >
                        {tpe.name}
                      </button>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );

  const topBarSearchBar = () => (
    <div className="w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"></path>
        </svg>
      </div>
      <input
        type="text"
        id="simple-search"
        className="border border-gray-300 text-sm rounded-lg w-full pl-10 p-2.5 focus:border-sb-hard focus:outline-none"
        placeholder="Search"
        required
        ref={searchRef}
      />
    </div>
  );

  const topBarButtons = () => (
    <>
      <button
        type="submit"
        className="p-2.5 ml-2 text-sm font-medium text-white bg-sb rounded-lg border border-sb hover:bg-sb-hard"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeWidth="3"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="p-2.5 ml-2 text-sm font-medium text-white bg-sb rounded-lg border border-sb hover:bg-sb-hard"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          stroke="white"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" />
        </svg>
      </button>
    </>
  );

  const topBarFilterByType = () => (
    <>
      <div className="flex justify-start w-[50%] gap-1">
        <button
          type="button"
          className="flex justify-center rounded-md border border-gray-300 bg-white mt-2 py-1 px-2 text-xs font-medium text-gray-700 shadow-sm focus:outline-none focus:border-sb-hard"
          id="menu-button"
          onClick={() => setShowTypesDropDown((prev) => !prev)}
        >
          Types
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
            aria-hidden="true"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
          </svg>
        </button>

        <button
          type="button"
          className="flex justify-center rounded-md border border-gray-300 bg-white mt-2 py-1 px-2 text-xs font-medium text-gray-700 shadow-sm focus:outline-none focus:border-sb-hard"
          id="menu-button"
          onClick={() => clearFilters()}
        >
          Clear
          <svg
            className="-mr-1 ml-1 h-4 w-4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
          </svg>
        </button>
      </div>
    </>
  );

  const renderTypesDropdown = () => (
    <div
      id="dropdown"
      className={`z-10 justify-start w-[50%] ${
        showTypesDropDown ? "flex" : "hidden"
      }`}
    >
      <ul>
        {types
          ? types.map((tpe) => (
              <li
                className="text-sm hover:cursor-pointer hover:text-sb-hard font-medium"
                key={tpe.id}
                onClick={() => addTypeFilter(tpe)}
              >
                {tpe.name}
              </li>
            ))
          : null}
      </ul>
    </div>
  );

  const topBarFilterTypes = () =>
    filterByTypes.map((filterByType) => (
      <button
        type="button"
        className={`rounded-md border border-${filterByType.name} bg-${filterByType.name} p-1 mt-2 text-xs font-medium text-white shadow-sm h-fit`}
        key={filterByType.id}
      >
        {filterByType.name}
      </button>
    ));

  const topBar = () => (
    <div className="flex justify-center flex-col items-center sticky top-0 z-10 my-3 py-3 bg-white">
      <form className="flex sticky w-[50%]" onSubmit={(e) => searchDecks(e)}>
        {topBarSearchBar()}
        {topBarButtons()}
      </form>
      <div className="flex justify-start w-[50%] gap-5">
        <div>
          {topBarFilterByType()}
          {renderTypesDropdown()}
        </div>
        <div className="flex gap-2 flex-wrap">{topBarFilterTypes()}</div>
      </div>
    </div>
  );

  return (
    <>
      {types ? topBar() : null}
      {showModal ? createDeckModal() : null}
      {decks ? renderDecks(decks) : <div className="flex justify-center mt-5"><p>No Decks Found</p></div>}
    </>
  );
};

export default Home;
