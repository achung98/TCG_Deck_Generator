import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="px-10 bg-white py-3 w-full sticky top-0 z-10 shadow-xl">
      <Link
        className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-sb"
        to="/"
      >
        Angel's TCG Deck Generator
      </Link>
    </nav>
  );
};

export default NavBar;
