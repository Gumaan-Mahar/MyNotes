import React, { useContext } from "react";
import { SiGooglekeep } from "react-icons/si";
import { FiTrash } from "react-icons/fi";
import { RiStarLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { AppContext } from "../App";

const SideBarTile = ({ icon, label, path }) => {
  const { isSidebarExpanded } = useContext(AppContext);
  const isActiveStyling = isSidebarExpanded
    ? "flex xl:justify-start xl:items-start xl:flex-row w-14 xl:w-full h-fit   ml-4 xl:ml-0 xl:pl-8 xl:py-3 cursor-pointer bg-amber-200 rounded-full xl:rounded xl:rounded-tr-full xl:rounded-br-full  shadow shadow-gray-400 dark:shadow-none dark:bg-amber-400"
    : "w-14 xl:w-fit xl:p-4 h-fit  ml-4 cursor-pointer bg-amber-200 rounded-full border-gray-400 shadow shadow-gray-400 dark:shadow-none dark:bg-amber-400";
  const isNotActiveStyling = isSidebarExpanded
    ? "flex  xl:items-start xl:justify-start xl:flex-row  w-14 xl:w-full  h-fit  ml-4 xl:ml-0 xl:pl-8 xl:py-3 cursor-pointer hover:bg-gray-200  rounded-full xl:rounded xl:rounded-tr-full xl:rounded-br-full dark:hover:bg-gray-500"
    : "w-14 xl:w-fit h-fit xl:p-4 ml-4 my-1 cursor-pointer hover:bg-gray-200 rounded-full hover:shadow shadow-gray-400 dark:hover:bg-gray-500";
  return (
    <>
      <NavLink
        to={path}
        key={label}
        className={({ isActive }) =>
          isActive ? isActiveStyling : isNotActiveStyling
        }
      >
        <div className="w-fit h-fit py-4 ml-4 xl:py-0 xl:ml-0">{icon}</div>
        {isSidebarExpanded && (
          <p className="invisible xl:visible text-sm font-medium tracking-wider xl:pl-4 ">
            {label}
          </p>
        )}
      </NavLink>
    </>
  );
};

const LeftSideBar = () => {
  return (
    <div className={`flex flex-col w-full h-full gap-6`}>
        <SideBarTile
          icon={<SiGooglekeep fontSize={22} />}
          label={"Notes"}
          path={"/"}
        />
        <SideBarTile
          icon={<RiStarLine fontSize={22} />}
          label={"Favorites"}
          path={"/favorites"}
        />
        <SideBarTile
          icon={<FiTrash fontSize={22} />}
          label={"Trash"}
          path={"/trash"}
        />
      </div>
  );
};

export default LeftSideBar;
