import CardsInterface from "../interfaces/CardsInterface";

const Cards = ({name, img}: CardsInterface) => <img src={img} alt={name} />

export default Cards;