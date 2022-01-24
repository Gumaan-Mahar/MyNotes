import { useContext, useState } from "react";
import Highlighter from "react-highlight-words";
import { BsPin, BsPinFill } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";
import {
  MdOutlineColorLens,
  MdOutlineFormatColorReset,
  MdRestoreFromTrash,
  MdDeleteForever,
} from "react-icons/md";
import { RiStarLine, RiStarSFill } from "react-icons/ri";
import { Link,} from "react-router-dom";
import { AppContext } from "./App";

const Note = ({
  id,
  title,
  category,
  description,
  dateCreated,
  color,
  isPinned,
  isFavorite,
  isDeleted,
  isPinHidden = false,
}) => {
  const { notes, setNotes, colorPalletes, enqueueSnackbar, searchKeyword, } =
    useContext(AppContext);
  const [isHovered, setisHovered] = useState(false);
  const [displayColorPallete, setDisplayColorPallete] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color);

  const handleDelete = (e) => {
    e.preventDefault();
    setNotes(
      notes.map((note) => {
        if (note.id === id) {
          return { ...note, isDeleted: true };
        }
        return note;
      })
    );
  };

  const handleRestore = (e) => {
    e.preventDefault();
    setNotes(
      notes.map((note) => {
        if (note.id === id) {
          return { ...note, isDeleted: false };
        }
        return note;
      })
    );
  };

  const handleDeleteForever = (e) => {
    e.preventDefault();
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handlePinUpdate = (e) => {
    e.preventDefault();
    setNotes(
      notes.map((note) => {
        if (note.id === id) {
          return { ...note, isPinned: !note.isPinned };
        }
        return note;
      })
    );

    const action = (onPressed) => (
      <button
        type="button"
        onClick={onPressed}
        className=" r-2 hover:bg-gray-700 px-4 py-1 rounded-md"
      >
        <span className="text-amber-500 text-xs font-semibold tracking-wider">
          Undo
        </span>
      </button>
    );

    enqueueSnackbar(!isPinned ? "Note pinned" : "Note unpinned", {
      variant: "default",
      autoHideDuration: 2000,
      action: action(() => {
        console.log("undo clicked");
        setNotes(
          notes.map((note) => {
            if (note.id === id) {
              return { ...note, isPinned: isPinned };
            }
            return note;
          })
        );
        enqueueSnackbar("Action undone", {
          variant: "default",
          autoHideDuration: 2000,
        });
      }),
    });
  };

  const handleFavoriteUpdate = (e) => {
    e.preventDefault();
    setNotes(
      notes.map((note) => {
        if (note.id === id) {
          return { ...note, isFavorite: !note.isFavorite };
        }
        return note;
      })
    );
  };

  const handleColorUpdate = (e, updatedColor) => {
    e.preventDefault();
    setSelectedColor(updatedColor.color);
    setNotes(
      notes.map((note) => {
        if (note.id === id) {
          return { ...note, color: updatedColor.color };
        }
        return note;
      })
    );
  };

  return (
    <Link
      to={`${
        isDeleted
          ? `/trash/${id}`
          : isFavorite
          ? `/favorites/${id}`
          : `/notes/${id}`
      }`}
    >
      <div
        className={`w-full  flex flex-col ${color === 'bg-white' ? 'dark:bg-zinc-900' : color} p-3 mb-4 border border-gray-300 rounded-lg hover:shadow  hover:shadow-gray-400 gap-2 cursor-pointer transform hover:scale-105 transition-all duration-500 ease-in-out ${color === colorPalletes[0].color ? 'dark:text-white' : 'dark:text-black'}`}
        onMouseEnter={() => setisHovered(true)}
        onMouseLeave={() => {
          setisHovered(false);
          setDisplayColorPallete(false);
        }}
      >
        <div className="flex flex-row items-start justify-between">
          <div
            className={`${color} bg-opacity-40 cursor-pointer rounded-md px-6 py-1  shadow-md`}
          >
            <p>{category}</p>
          </div>
          {isHovered && !isPinHidden && (
            <div
              className="hover:bg-gray-100 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500"
              onClick={(e) => handlePinUpdate(e)}
            >
              {isPinned ? <BsPinFill fontSize={18} /> : <BsPin fontSize={18} />}
            </div>
          )}
        </div>
        {/* <p className="text-gray-400">{dateCreated}</p> */}
        {!title && !description ? (
          <p className="text-gray-500 font-medium text-lg pb-8">Empty note</p>
        ) : searchKeyword ? (
          <div className="line-clamp-6 font-medium">
            <Highlighter
              highlightClassName="bg-amber-200"
              searchWords={[searchKeyword]}
              autoEscape={false}
              textToHighlight={title}
            />
          </div>
        ) : (
          <p className="font-medium text-sm bg-transparent line-clamp-6">
            {title}
          </p>
        )}

        {searchKeyword ? (
          <div className="text-sm line-clamp-6">
            <Highlighter
              highlightClassName="bg-amber-200"
              searchWords={[searchKeyword]}
              autoEscape={false}
              textToHighlight={description}
            />
          </div>
        ) : (
          <p className="text-sm line-clamp-6">{description}</p>
        )}

        <div className="flex flex-col gap-2 mt-3">
          {isHovered && (
            <div className="flex flex-row w-full justify-between items-center ">
              {!isDeleted && (
                <div
                  className="hover:bg-gray-100 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500"
                  onClick={(e) => handleFavoriteUpdate(e)}
                >
                  {isFavorite ? (
                    <RiStarSFill fontSize={18} />
                  ) : (
                    <RiStarLine fontSize={18} />
                  )}
                </div>
              )}
              {!isDeleted && (
                <div
                  className=" hover:bg-gray-100 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("clicked on color pallete");
                    setDisplayColorPallete(!displayColorPallete);
                  }}
                >
                  <MdOutlineColorLens fontSize={18} />
                </div>
              )}
              {isDeleted && (
                <div
                  className=" hover:bg-gray-100 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500"
                  onClick={(e) => handleRestore(e)}
                >
                  <MdRestoreFromTrash fontSize={18} />
                </div>
              )}
              {isDeleted ? (
                <div
                  className="hover:bg-gray-100 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500"
                  onClick={(e) => handleDeleteForever(e)}
                >
                  <MdDeleteForever fontSize={18} />
                </div>
              ) : (
                <div
                  className="hover:bg-gray-100 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500"
                  onClick={(e) => handleDelete(e)}
                >
                  <FiTrash fontSize={18} />
                </div>
              )}
            </div>
          )}
          {displayColorPallete && (
            <div className="w-full h-10 flex flex-row items-center justify-center px-4 py-5 bg-slate-100  shadow-lg rounded-md gap-1">
              {colorPalletes.map((updatedColor) => {
                return (
                  <div
                    key={updatedColor.id}
                    onClick={(e) => handleColorUpdate(e, updatedColor)}
                    className={`${
                      updatedColor.color
                    } w-6 h-6 flex items-center justify-center rounded-full cursor-pointer ${
                      selectedColor === updatedColor.color &&
                      "border-2 border-black"
                    } hover:border-2 hover:border-black`}
                  >
                    {updatedColor.id === 0 && (
                      <MdOutlineFormatColorReset fontSize={20} className="dark:text-black"/>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Note;
