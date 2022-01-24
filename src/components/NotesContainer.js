import React, { useContext, useEffect, useRef, useState } from "react";

import TextareaAutosize from "react-textarea-autosize";
import { v4 as uuidv4 } from "uuid";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { BsPin, BsPinFill } from "react-icons/bs";
import { RiStarLine, RiStarSFill } from "react-icons/ri";
import { MdOutlineColorLens, MdOutlineFormatColorReset } from "react-icons/md";

import { useOutsideClick } from "rooks";

import CategoryDropDown from "./CategoryDropDown";
import Note from "../Note";
import { AppContext } from "../App";


const NotesContainer = () => {
  const { notes, setNotes, colorPalletes, enqueueSnackbar, isSidebarExpanded, isGridView, searchKeyword } =
    useContext(AppContext);
  const [pinnedNotes, setpinnedNotes] = useState([]);
  const [notPinnedNotes, setnotPinnedNotes] = useState([]);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [selectedInput, setselectedInput] = useState("");
  const [isPinned, setisPinned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colorPalletes[0].color);
  const [isColorPallete, setisColorPallete] = useState(false);

  const refInput = useRef(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));

    setpinnedNotes(
      notes.filter(
        (note) => note.isPinned === true && note.isFavorite === false && note.isDeleted === false
      )
    );
    setnotPinnedNotes(
      notes.filter(
        (note) => note.isPinned === false && note.isFavorite === false && note.isDeleted === false
      )
    );


    return () => {};
  }, [notes]);

  useOutsideClick(refInput, () => {
    if (isInputExpanded) {
      setIsInputExpanded(false);
    }
  });

  const handleTitleOnChange = (e) => {
    e.preventDefault();
    settitle(e.target.value);
  };

  const handleDesOnChange = (e) => {
    e.preventDefault();
    setdescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const note = {
      id: uuidv4(),
      dateCreated: new Date().toLocaleDateString(),
      title: title,
      description: description,
      category: selectedCategory,
      isPinned: isPinned,
      isFavorite: isFavorite,
      color: selectedColor,
      isDeleted:false,
    };

    setNotes([...notes, note]);

    settitle("");
    setdescription("");
    setSelectedCategory("General");
    setIsFavorite(false);
    setisPinned(false);
    setSelectedColor(colorPalletes[0].color);

    enqueueSnackbar("Note added", {
      variant: "default",
      autoHideDuration: 2000,
    });
  };

  const handleClose = (e) => {
    console.log(notes);
    e.preventDefault();
    settitle("");
    setdescription("");
    setSelectedCategory("General");
    setIsFavorite(false);
    setisPinned(false);
    setSelectedColor(colorPalletes[0].color);
  };


  const ColorPalleteContainer = () => {
    return (
      <div className="w-full h-full flex flex-row items-center gap-1">
        {colorPalletes.map((color, index) => (
          <div
            key={color.id}
            onClick={() => setSelectedColor(color.color)}
            className={`${
              color.color
            } h-8 w-8 flex items-center justify-center rounded-full cursor-pointer  ${
              selectedColor === color.color && "border-2 border-black"
            } hover:border-2 hover:border-black`}
          >
            {color.id === 0 && (
              <MdOutlineFormatColorReset
                fontSize={20}
                className="dark:text-black"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {searchKeyword ? (
        <div
          className={` ${
            isSidebarExpanded
              ? isGridView
                ? "w-full"
                : "w-2/3"
              : isGridView
              ? "w-full"
              : "w-3/4"
          } h-full m-4 `}
        >
          {notes.filter(
            (note) =>
              note.title.includes(searchKeyword) ||
              note.description.includes(searchKeyword)
          ).length === 0 ? (
            <p className="text-center">No matching results</p>
          ) : (
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                350: isGridView ? 2 : 1,
                750: isGridView ? 3 : 1,
                900: isGridView ? 4 : 1,
              }}
            >
              <Masonry gutter={16}>
                {notes
                  .slice(0)
                  .filter(
                    (note) =>
                      note.title.includes(searchKeyword) ||
                      note.description.includes(searchKeyword)
                  )
                  .reverse()
                  .map((note) => {
                    return (
                      <div key={note.id}>
                        <Note {...note} />
                      </div>
                    );
                  })}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </div>
      ) : (
        <div className={`flex flex-col w-full h-full`}>
          {/* snackbar */}
          {selectedInput === "TITLE" && title.length >= 899 && (
            <div className="w-1/6 h-12 py-2 absolute bottom-20 left-24 bg-gray-800 z-50 text-center text-white  rounded-md transition-all duration-1000 ease-in-out">
              {999 - title.length} characters left
            </div>
          )}
          {selectedInput === "DESCRIPTION" && description.length >= 8999 && (
            <div className="w-1/6 h-12 py-2 absolute bottom-20 left-4 bg-gray-800 z-50 text-center text-white text-lg rounded">
              {9999 - description.length} characters left
            </div>
          )}
          {/* add new todo  */}
          <div className="flex justify-center mb-8 ">
            {isInputExpanded ? (
              <div
                ref={refInput}
                className={`flex flex-col w-full md:w-11/12 lg:w-3/4 h-fit mt-8 px-4 gap-2 ${
                  selectedColor === "bg-white"
                    ? "dark:bg-zinc-900"
                    : selectedColor
                } rounded-md  shadow-gray-400 shadow transition-all duration-200 ease-in-out hover:shadow-md hover:shadow-gray-500 ${
                  selectedColor === colorPalletes[0].color
                    ? "dark:text-white"
                    : "dark:text-black"
                }`}
              >
                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className="flex flex-row justify-between items-start dark:text-white">
                    <TextareaAutosize
                      maxLength={999}
                      placeholder="Title"
                      className={`w-full h-fit my-4 bg-transparent resize-none border-none outline-none text-black text-sm font-medium placeholder-gray-600 break-words overflow-hidden ${
                        selectedColor === colorPalletes[0].color
                          ? "dark:text-white"
                          : "dark:text-black"
                      }`}
                      value={title}
                      onChange={(e) => handleTitleOnChange(e)}
                      onFocus={() => setselectedInput("TITLE")}
                      onBlur={() => setselectedInput("")}
                    />
                    <div
                      className={`flex items-center justify-center hover:bg-gray-100 cursor-pointer rounded-full p-2 mr-2 mt-4 dark:hover:bg-gray-500 ${
                        selectedColor === colorPalletes[0].color
                          ? "dark:text-white"
                          : "dark:text-black"
                      }`}
                      onClick={() => setisPinned(!isPinned)}
                    >
                      {isPinned ? (
                        <BsPinFill fontSize={20} />
                      ) : (
                        <BsPin fontSize={20} />
                      )}
                    </div>
                  </div>
                  <CategoryDropDown
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedColor={selectedColor}
                  />
                  <TextareaAutosize
                    maxLength={9999}
                    placeholder="Take a note..."
                    value={description}
                    onChange={(e) => handleDesOnChange(e)}
                    className={` resize-none bg-transparent w-full py-4 border-none outline-none
            text-black text-sm font-medium placeholder-gray-600 break-words
            overflow-hidden dark:text-white ${
              selectedColor === colorPalletes[0].color
                ? "dark:text-white"
                : "dark:text-black"
            }`}
                    onFocus={() => setselectedInput("DESCRIPTION")}
                    onBlur={() => setselectedInput("")}
                  />
                  <div className="flex flex-row justify-between mb-2 ">
                    <div className="flex flex-row items-center gap-4 ">
                      <div
                        className="hover:bg-gray-100 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        {isFavorite ? (
                          <RiStarSFill fontSize={20} />
                        ) : (
                          <RiStarLine fontSize={20} />
                        )}
                      </div>
                      <div
                        className="hover:bg-gray-100 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500 "
                        onClick={() => setisColorPallete(!isColorPallete)}
                      >
                        <MdOutlineColorLens fontSize={20} />
                      </div>
                      {isColorPallete && (
                        <div className="invisible lg:visible w-0 h-0 lg:w-full lg:h-fit">
                          <ColorPalleteContainer />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row items-center gap-2 mr-2">
                      <button
                        type="submit"
                        className=" px-5 py-1 text-gray-500 hover:bg-gray-50 rounded-md cursor-pointer font-medium "
                      >
                        Save
                      </button>
                      <button
                        className="px-5 py-1 text-gray-500 hover:bg-gray-50 rounded-md cursor-pointer font-medium"
                        onClick={(e) => handleClose(e)}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                    {isColorPallete && <div className="visible lg:invisible w-full h-fit lg:w-0 lg:h-0 pb-2 lg:pb-0">
                      <ColorPalleteContainer />
                    </div>}
                </form>
              </div>
            ) : (
              <div
                className="flex w-full md:w-11/12 lg:w-3/4 h-12 mt-8 items-center bg-white rounded-md  shadow-gray-400 shadow transition-all duration-500 ease-in-out cursor-text hover:shadow-md hover:shadow-gray-500 dark:bg-zinc-900"
                onClick={() => {
                  setIsInputExpanded(true);
                }}
              >
                <p className="text-gray-600 px-4 text-base font-medium">
                  Take a note...
                </p>
              </div>
            )}
          </div>

          <div
            className={` ${
              isSidebarExpanded
                ? isGridView
                  ? "w-full"
                  : "w-full md:w-2/3"
                : isGridView
                ? "w-full"
                : "w-full md:w-3/4"
            } h-full dark:bg-zinc-900`}
          >
            {(() => {
              // pinned and others notes starts
              if (pinnedNotes.length > 0 && notPinnedNotes.length > 0) {
                return (
                  <div className="flex flex-col bg-transparent dark:bg-zinc-900">
                    <span className="text-gray-600 text-xs my-3 font-medium tracking-wider">
                      PINNED
                    </span>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        350: 1,
                        750: isGridView ? 2 : 1,
                        900: isGridView ? 3 : 1,
                      }}
                    >
                      <Masonry gutter={16}>
                        {pinnedNotes
                          .slice(0)
                          .reverse()
                          .map((note) => {
                            return (
                              <div key={note.id}>
                                <Note {...note} />
                              </div>
                            );
                          })}
                      </Masonry>
                    </ResponsiveMasonry>
                    <span className="text-gray-600 text-xs mb-3 mt-12 font-medium tracking-wider">
                      OTHERS
                    </span>
                    <div className="mb-24">
                      <ResponsiveMasonry
                        columnsCountBreakPoints={{
                          350: 1,
                          750: isGridView ? 2 : 1,
                          900: isGridView ? 3 : 1,
                        }}
                      >
                        <Masonry gutter={16}>
                          {notPinnedNotes
                            .slice(0)
                            .reverse()
                            .map((note) => {
                              return (
                                <div key={note.id}>
                                  <Note {...note} />
                                </div>
                              );
                            })}
                        </Masonry>
                      </ResponsiveMasonry>
                    </div>
                  </div>
                ); // pinned and others notes ends
              } else if (
                pinnedNotes.length > 0 &&
                notPinnedNotes.length === 0
              ) {
                //Pinned notes starts
                return (
                  <div className="flex flex-col bg-transparent dark:bg-zinc-900 pb-24">
                    <span className="text-gray-600 text-xs mb-3 mt-12 font-medium tracking-wider">
                      PINNED
                    </span>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        350: 1,
                        750: isGridView ? 2 : 1,
                        900: isGridView ? 3 : 1,
                      }}
                    >
                      <Masonry gutter={16}>
                        {pinnedNotes
                          .slice(0)
                          .reverse()
                          .map((note) => {
                            return (
                              <div key={note.id}>
                                <Note {...note} />
                              </div>
                            );
                          })}
                      </Masonry>
                    </ResponsiveMasonry>
                  </div>
                ); //Pinned notes ends
              } else {
                // All notes starts
                return (
                  <div className="bg-transparent dark:bg-zinc-900 pb-24">
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        350: 1,
                        750: isGridView ? 2 : 1,
                        900: isGridView ? 3 : 1,
                      }}
                    >
                      <Masonry gutter={16}>
                        {notes
                          .slice(0)
                          .filter(
                            (note) =>
                              note.isFavorite === false &&
                              note.isDeleted === false
                          )
                          .reverse()
                          .map((note) => {
                            return (
                              <div key={note.id}>
                                <Note {...note} />
                              </div>
                            );
                          })}
                      </Masonry>
                    </ResponsiveMasonry>
                  </div>
                ); // All notes ends
              }
            })()}
          </div>
        </div>
      )}
    </>
  );
};


 


export default NotesContainer;
