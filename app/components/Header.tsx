import React from "react";
import { ModeToggle } from "./themeToggle";

const Header = () => {
  return (
    <div className="flex justify-between gap-x-2 h-fit w-full">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl items-center">
        So, how much ah?
      </h1>

      <div className="self-center">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
