import DecksInterface from "../interfaces/DecksInterface";

const Decks = ({name, tpe}: DecksInterface) => {
  return (
    <>
      <p>{name}</p>
      <img src={tpe.img} alt={tpe.name} />
    </>
  )
}

export default Decks;