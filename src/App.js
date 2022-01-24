import { useState, createContext, useEffect } from "react";

import { useSnackbar } from "notistack";

import "./App.css";
import NotesContainer from "./components/NotesContainer";
import LeftSideBar from "./components/LeftSideBar";
import { Link, Route, Routes } from "react-router-dom";
import { IoMenuOutline } from "react-icons/io5";
import { FiGrid } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import {
  MdOutlineViewAgenda,
  MdOutlineLightMode,
  MdLightMode,
  MdClear,
} from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";

import Favorites from "./components/Favorites";
import Trash from "./components/Trash";
import NoteDetail from "./components/NoteDetail";

import logo from "./logo.png";
import SearchBar from "./components/SearchBar";

export const AppContext = createContext();

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const [notes, setNotes] = useState(() => {
    const localStorageNotes = localStorage.getItem("notes");
    if (localStorageNotes) {
      return JSON.parse(localStorageNotes);
    }
    return [];
  });

  const [isGridView, setIsGridView] = useState(() => {
    const localStorageIsGridView = localStorage.getItem("isGridView");
    if (localStorageIsGridView) {
      return JSON.parse(localStorageIsGridView);
    }
    return true;
  });

  const [isLightMode, setIsLightMode] = useState(() => {
    const localStorageIsLightMode = localStorage.getItem("isLightMode");
    if (localStorageIsLightMode) {
      return JSON.parse(localStorageIsLightMode);
    }
    return false;
  });

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const localStorageIsSidebarExpanded =
      localStorage.getItem("isSidebarExpanded");
    if (localStorageIsSidebarExpanded) {
      return JSON.parse(localStorageIsSidebarExpanded);
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("isLightMode", JSON.stringify(isLightMode));
    localStorage.setItem(
      "isSidebarExpanded",
      JSON.stringify(isSidebarExpanded)
    );
    localStorage.setItem("isGridView", JSON.stringify(isGridView));
    return () => {};
  }, [isLightMode, isSidebarExpanded, isGridView]);

  const [searchKeyword, setSearchKeyword] = useState("");

  const [displaySmallScreenSearch, setDisplaySmallScreenSearch] =
    useState(false);

  const [showClearIcon, setShowClearIcon] = useState(false);

  const colorPalletes = [
    { id: 0, color: "bg-white" },
    { id: 1, color: "bg-red-300" },
    { id: 2, color: "bg-green-300" },
    { id: 3, color: "bg-amber-300" },
    { id: 4, color: "bg-blue-300" },
    { id: 5, color: "bg-indigo-300" },
    { id: 1, color: "bg-purple-300" },
    { id: 1, color: "bg-teal-300" },
    { id: 1, color: "bg-pink-300" },
    { id: 1, color: "bg-lime-300" },
    { id: 1, color: "bg-orange-300" },
  ];

  return (
    <AppContext.Provider
      value={{
        notes,
        setNotes,
        colorPalletes,
        enqueueSnackbar,
        isGridView,
        isSidebarExpanded,
        searchKeyword,
        setSearchKeyword,
      }}
    >
      <>
        <div className={`w-full h-screen  ${isLightMode && "dark"} `}>
          <div
            className={`flex flex-col w-full h-full dark:bg-zinc-900 dark:text-white `}
          >
            {/* header starts */}
            <div className="flex flex-row items-center  px-4 py-1 bg-white w-full h-fit fixed left-0 right-0 top-0 z-50 border-b gap-3 dark:bg-zinc-900 dark:text-white ">
              <div
                className={`${
                  displaySmallScreenSearch ? "visible" : "invisible"
                } md:invisible w-11/12 h-5/6 flex flex-row items-center justify-center border rounded absolute z-50 left-6 bg-white`}
              >
                <div
                  className="w-fit h-fit p-2 hover:bg-gray-100 ml-2 mr-3 rounded-full"
                  onClick={() => setDisplaySmallScreenSearch(false)}
                >
                  <BiArrowBack fontSize={22} className="text-gray-500" />
                </div>
                <input
                  id="smallscreensearch"
                  className="w-full h-full outline-none text-black "
                  placeholder="Search your notes here"
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setShowClearIcon(true);
                  }}
                />
                {showClearIcon && (
                  <div
                    className="w-fit h-fit p-2 hover:bg-gray-100 mr-2 rounded-full"
                    onClick={() => {
                      if (!searchKeyword) {
                        setDisplaySmallScreenSearch(false);
                        setShowClearIcon(false);
                      }
                      setSearchKeyword("");
                      document.getElementById("smallscreensearch").value = "";
                    }}
                  >
                    <MdClear fontSize={22} className="text-gray-500" />
                  </div>
                )}
              </div>

              <div className="flex flex-row items-center justify-between gap-2">
                <div
                  className="invisible xl:visible w-0 h-0 xl:w-fit xl:h-fit hover:bg-gray-100 xl:p-4  rounded-full"
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                >
                  <IoMenuOutline fontSize={27} className="text-gray-500" />
                </div>
                <div className="w-fit h-fit flex flex-row items-center">
                  <div className="w-16">
                    <Link to={"/"}>
                      <img src={logo} alt="" />
                    </Link>
                  </div>
                  <Link to={"/"}>
                    <p className="font-semibold text-lg md:text-xl ">MyNotes</p>
                  </Link>
                </div>
              </div>

              <div className="invisible md:visible w-3/5 h-12 rounded">
                <SearchBar />
              </div>
              <div className="flex flex-row items-center justify-between gap-2 lg:gap-4 xl:gap-8">
                <div
                  className="visible md:invisible w-fit h-fit hover:bg-gray-100 p-2 md:p-4 rounded-full"
                  onClick={() =>
                    setDisplaySmallScreenSearch(!displaySmallScreenSearch)
                  }
                >
                  <AiOutlineSearch fontSize={27} className="text-gray-500" />
                </div>
                <div
                  className="w-fit h-fit hover:bg-gray-100 rounded-full p-2 md:p-4"
                  onClick={() => setIsGridView(!isGridView)}
                >
                  {isGridView ? (
                    <MdOutlineViewAgenda
                      fontSize={24}
                      className="text-gray-500"
                    />
                  ) : (
                    <FiGrid fontSize={24} className="text-gray-500" />
                  )}
                </div>
                <div
                  className="w-fit h-fit hover:bg-gray-100 rounded-full p-2 md:p-4"
                  onClick={() => setIsLightMode(!isLightMode)}
                >
                  {isLightMode ? (
                    <MdLightMode fontSize={24} className="text-gray-500" />
                  ) : (
                    <MdOutlineLightMode
                      fontSize={24}
                      className="text-gray-500"
                    />
                  )}
                </div>
                <div className="w-fit h-fit p-2 xl:p-4 rounded-full hover:border-2 border-gray-400 hover:bg-gray-100">
                  <CgProfile fontSize={24} className="text-gray-500" />
                </div>
              </div>
            </div>
            {/* search bar ends */}

            {/* body */}
            <div className="flex flex-row w-full h-full pt-20  dark:bg-zinc-900 dark:text-white">
              {/* left side bar */}
              <div
                className={`${
                  isSidebarExpanded ? "w-14 xl:w-1/5" : " xl:w-1/12"
                } h-full  dark:bg-zinc-900 dark:text-white `}
              >
                <LeftSideBar />
              </div>

              {/* center content */}
              <div
                className={`flex w-full h-full ml-6 pl-4 xl:ml-0 xl:pl-12 pr-6  dark:bg-zinc-900 dark:text-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
              >
                <Routes>
                  <Route path={"/"} element={<NotesContainer />}></Route>
                  <Route
                    path={"/notes/:noteID"}
                    element={<NoteDetail isPinHidden={false} />}
                  ></Route>
                  <Route path={"/favorites"} element={<Favorites />}></Route>
                  <Route
                    path={"/favorites/:noteID"}
                    element={<NoteDetail isPinHidden={true} />}
                  ></Route>
                  <Route path={"/trash"} element={<Trash />}></Route>
                  <Route
                    path={"/trash/:noteID"}
                    element={<NoteDetail isPinHidden={true} />}
                  ></Route>
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </>
    </AppContext.Provider>
  );
}

export default App;
