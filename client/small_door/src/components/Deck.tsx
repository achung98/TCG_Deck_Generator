import DecksInterface from "../interfaces/DecksInterface";
import { useNavigate } from "react-router-dom";

interface IProps {
  deckProps: DecksInterface,
  index: number
}

const Decks = ({ deckProps, index}: IProps) => {
  const navigate = useNavigate();
  const fetchCards = (id: number) => navigate(`/deck/${id}`);

  return (
    <div
      id={deckProps.id.toString()}
      className="flex flex-col items-center px-2 py-5 xl:w-1/4 hover:scale-90 ease-in-out duration-400"
      key={index}
      onClick={() => fetchCards(deckProps.id)}
    >
      <p className="font-def text-2xl font-bold">{deckProps.name}</p>
      <img
        src={deckProps.tpe.img}
        alt={deckProps.tpe.name}
        className="h-[32rem] shadow-2xl rounded-2xl"
      />
    </div>
  );
};

export default Decks;
