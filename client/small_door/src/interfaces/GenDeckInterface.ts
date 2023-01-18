import TypesInterface from "./TypesInterface";
import DecksCardsInterface from "./DecksCardsInterface";

interface Cards {
  [key: string]: DecksCardsInterface;
}

export default interface GenDeckInterface {
  name: string;
  tpe: TypesInterface;
  cards: Cards;
  total_cards: number;
}