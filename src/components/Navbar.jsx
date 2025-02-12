const Navbar = () => {

  return (
    <nav className=" bg-emerald-400 py-4  w-full">
      <div className="container mx-auto flex justify-between w-10/12 items-center">
        <a href="/" className="text-white text-lg font-bold">
          Job<span className="text-yellow-300">Search</span>
        </a>
        <ul className="flex space-x-4 text-white">
          <li><a href="/" className="hover:text-yellow-300">Home</a></li>
          <li><a href="#about" className="hover:text-yellow-300">About</a></li>
          <li><a href="#contact" className="hover:text-yellow-300">Contact</a></li>
          <li><a href="#jobs" className="hover:text-yellow-300">Jobs</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
