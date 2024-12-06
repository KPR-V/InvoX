import React from "react";

interface NavbarProps {
  firstbutton: string;
  secondbutton: string;
  thirdbutton: string;
  onFirstButtonClick: () => void;
  onSecondButtonClick: () => void;
  onThirdButtonClick: () => void; // Add the click handler type
}

const Navbar: React.FC<NavbarProps> = ({
  firstbutton,
  secondbutton,
  thirdbutton,
  onFirstButtonClick,
  onSecondButtonClick,
  onThirdButtonClick,
}) => {
  return (
    <>
      <div className="h-16 w-full rounded-full z-40 flex justify-center items-center mx-auto fixed">
        <div className="content w-[80%] rounded-full bg-zinc-950 h-[80%] px-10 flex justify-between items-center border-b-[1px] border-orange-400">
          <div className="flex items-center cursor-pointer">
            <div className="text-white font-title font-extrabold tracking-wider">
              INVO
            </div>
            <div className="text-orange-400 font-title text-3xl font-bold">
              X
            </div>
          </div>
          <div className="flex justify-evenly items-center w-[50%]">
            <div
              className="nav-link text-white hover:text-orange-400 transition-colors duration-300 font-montserrat"
              onClick={onFirstButtonClick}
            >
              {firstbutton}
            </div>
            <div
              className="nav-link text-white hover:text-orange-400 transition-colors duration-300 font-montserrat"
              onClick={onSecondButtonClick}
            >
              {secondbutton}
            </div>
            <div
              className="nav-link text-white hover:text-orange-400 transition-colors duration-300 font-montserrat"
              onClick={onThirdButtonClick}
            >
              {thirdbutton}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
