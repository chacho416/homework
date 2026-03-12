import React from "react";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { BsInfoCircleFill } from "react-icons/bs";
import PagesLink from "./PageLinks";
import PageMode from "./PageMode";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 max-w-6xl m-auto">
      <div className="flex gap-2">
        <PagesLink url="/" title="INICIO" Icon={AiFillHome} />
        <PagesLink url="/about" title="INFO" Icon={BsInfoCircleFill} />
      </div>


      <div className="flex items-center space-x-4">
        <PageMode />
        
        <Link href="/">
          <h2 className="flex items-center">
            <span className="text-2xl bg-green-700 dark:bg-green-500 px-2 py-1 rounded-lg text-white dark:text-black font-bold mr-1 transition-colors">
              Chachos
            </span>
            {/* Aquí cambiamos a Shonens */}
            <span className="text-xl hidden sm:inline font-semibold">
              Shonens
            </span>
          </h2>
        </Link>
      </div>
    </header>
  );
};

export default Header;