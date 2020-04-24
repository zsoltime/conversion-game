import React, { useEffect, useState } from 'react';
import { Link, useLocation } from '@reach/router';

function NavLink(props) {
  return (
    <Link
      {...props}
      getProps={({ isCurrent }) => {
        return {
          className: isCurrent
            ? 'block md:inline-block hover:text-white p-4 shadow-border'
            : 'block md:inline-block hover:text-white p-4 hover:shadow-border focus:shadow-border transition-shadow ease-in-out duration-200',
        };
      }}
    />
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  let menuClass = isOpen
    ? 'block md:flex md:items-center w-full md:w-auto'
    : 'hidden md:flex';

  return (
    <header className="bg-purple-900">
      <div className="flex items-center justify-between flex-wrap max-w-5xl mx-auto px-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link to="/" className="font-hairline text-3xl tracking-tight">
            Convertex
          </Link>
        </div>
        <div className="md:hidden">
          <button
            className="flex items-center my-2 px-3 py-2 border rounded border-gray-200 hover:border-white text-gray-200 hover:text-white transition-color"
            onClick={toggleMenu}
            aria-expanded={isOpen.toString()}
          >
            <svg
              className="fill-current h-4 w-4"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Main menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <nav className={menuClass} aria-labelledby="nav-label">
          <span id="nav-label" hidden>
            Main
          </span>
          <ul className="md:flex md:flex-grow md:-mr-4 text-lg text-center md:text-left text-gray-100 ">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {['Length', 'Mass', 'Volume', 'Time'].map(el => (
              <li key={el}>
                <NavLink to={`/${el.toLowerCase()}`}>{el}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
