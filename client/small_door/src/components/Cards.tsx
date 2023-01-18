import { Dispatch, SetStateAction } from "react";

import CardsInterface from "../interfaces/CardsInterface";

interface IProps {
  props: CardsInterface;
  index: number;
  createCardModal: (img: string, name: string, whereToBuy: string) => void | null;
}

const Cards = ({ props, index, createCardModal }: IProps) => {

  return (
    <div
      id={props.id + index}
      key={props.id + index}
      className="flex flex-col items-center px-2 py-2 xl:w-1/5 hover:scale-90 ease-in-out duration-400"
      onClick={() => createCardModal ? createCardModal(props.img, props.name, props.where_to_buy) : ""}
    >
      <img
        src={props.img}
        alt={props.name}
        className="h-96 shadow-2xl rounded-2xl"
      />
    </div>
  );
};

export default Cards;
