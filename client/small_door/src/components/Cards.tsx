import CardsInterface from "../interfaces/CardsInterface";

const Cards = ({name, img}: CardsInterface) => <img src={img} alt={name} className="rounded-2xl"/>

export default Cards;