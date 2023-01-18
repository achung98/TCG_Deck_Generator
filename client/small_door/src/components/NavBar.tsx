import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="px-10 bg-white py-3 w-full sticky top-0 z-10 shadow-xl">
      <Link
        className="leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-sb font-def text-sm font-bold"
        to="/"
      >
        Angel's Awesome Deck Generator
      </Link>
    </nav>
  );
};

export default NavBar;
