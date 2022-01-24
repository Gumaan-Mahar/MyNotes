import React, { useState } from "react";
import { useContext, } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AppContext } from "../App";
import TextareaAutosize from "react-textarea-autosize";
import CategoryDropDown from "./CategoryDropDown";
import { RiStarLine, RiStarSFill } from "react-icons/ri";
import {
  MdOutlineColorLens,
  MdOutlineFormatColorReset,
} from "react-icons/md";
import { BsPin, BsPinFill } from "react-icons/bs";

const NoteDetail = ({ isPinHidden }) => {
  const { notes, setNotes, colorPalletes } = useContext(AppContext);

  let params = useParams();
  let navigate = useNavigate();

  let note;

  note = { ...notes.filter((note) => note.id === params.noteID) };

  note = { ...note[0] };

  const [editedNote, setEditedNote] = useState({
    id: note.id,
    title: note.title,
    description: note.description,
    category: note.category,
    dateCreated: note.dateCreated,
    color: note.color,
    isPinned: note.isPinned,
    isFavorite: note.isFavorite,
    isDeleted: note.isDeleted,
  });
  const [selectedCategory, setSelectedCategory] = useState(editedNote.category);

  const [displayColorPallete, setDisplayColorPallete] = useState(false);

  const [displayNoteDetail, setDisplayNoteDetail] = useState(true);

  const [selectedColor, setSelectedColor] = useState(editedNote.color);

  const handleDetailPinUpdate = (e) => {
    e.preventDefault();
    setEditedNote({ ...editedNote, isPinned: !editedNote.isPinned });
  };

  const handleDetailFavoriteUpdate = (e) => {
    e.preventDefault();
    setEditedNote({ ...editedNote, isFavorite: !editedNote.isFavorite });
  };

  const handleColorUpdate = (e, updatedColor) => {
    e.preventDefault();
    setSelectedColor(updatedColor.color);
    setEditedNote({ ...editedNote, color: updatedColor.color });
  };

  return (
    <>
      {displayNoteDetail && (
        <div
          className={`flex justify-center w-full h-full fixed left-0 right-0 top-0 bottom-0 z-50  ${'bg-black bg-opacity-60'}`}
        >
          <div
            className={`flex flex-col justify-between w-3/4 my-4 pb-12 rounded ${editedNote.color === 'bg-white' ? 'bg-white dark:bg-zinc-900 dark:text-white' : `${editedNote.color} dark:text-black`}  border  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 `}
          >
            <div className={` flex flex-col w-full p-4 `}>
              <div className="flex flex-row">
                <TextareaAutosize
                  placeholder="Title"
                  value={editedNote.title}
                  onChange={(e) => {
                    e.preventDefault();
                    setEditedNote({ ...editedNote, title: e.target.value });
                  }}
                  className={`w-full bg-transparent mb-4 resize-none border-none outline-none text-black text-sm font-medium placeholder-gray-600 break-words`}
                />
                {!isPinHidden && (
                  <div
                    className={`h-fit hover:bg-gray-200 cursor-pointer rounded-full p-2 dark:hover:bg-gray-500 `}
                    onClick={(e) => handleDetailPinUpdate(e)}
                  >
                    {editedNote.isPinned ? (
                      <BsPinFill fontSize={20} />
                    ) : (
                      <BsPin fontSize={20} />
                    )}
                  </div>
                )}
              </div>
              <CategoryDropDown
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedColor={editedNote.color}
              />
              <TextareaAutosize
                placeholder="Take a note..."
                value={editedNote.description}
                onChange={(e) => {
                  e.preventDefault();
                  setEditedNote({ ...editedNote, description: e.target.value });
                }}
                className={`resize-none bg-transparent w-full mt-4 border-none outline-none
            text-black text-sm  placeholder-gray-600 break-words overflow-hidden
            `}
              />
            </div>
            <div
              className={`w-3/4 h-fit flex flex-row justify-evenly  ${editedNote.color === 'bg-white' ? 'dark:bg-zinc-900' : editedNote.color} py-2 fixed z-50 bottom-4 shadow-inner`}
            >
              {!editedNote.isDeleted && (
                <div
                  className="hover:bg-gray-200 cursor-pointer rounded-full p-3 dark:hover:bg-gray-500"
                  onClick={(e) => handleDetailFavoriteUpdate(e)}
                >
                  {editedNote.isFavorite ? (
                    <RiStarSFill fontSize={20} />
                  ) : (
                    <RiStarLine fontSize={20} />
                  )}
                </div>
              )}
              {!editedNote.isDeleted && (
                <div
                  className=" hover:bg-gray-200 cursor-pointer rounded-full p-3 dark:hover:bg-gray-500"
                  onClick={(e) => setDisplayColorPallete(!displayColorPallete)}
                >
                  <MdOutlineColorLens fontSize={20} />
                </div>
              )}
              {displayColorPallete && (
                <div className="w-fit h-fit flex flex-row items-center justify-center px-4 py-2 bg-slate-100  shadow-lg rounded-md">
                  {colorPalletes.map((updatedColor) => {
                    return (
                      <div
                        key={updatedColor.id}
                        onClick={(e) => handleColorUpdate(e, updatedColor)}
                        className={`${
                          updatedColor.color
                        } h-6 w-6 flex items-center justify-center rounded-full cursor-pointer mr-2 ${
                          selectedColor === updatedColor.color &&
                          "border-2 border-black"
                        } hover:border-2 hover:border-black`}
                      >
                        {updatedColor.id === 0 && (
                          <MdOutlineFormatColorReset fontSize={20} className="dark:text-black" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className="font-medium hover:bg-gray-200 cursor-pointer rounded px-4 py-2 dark:hover:bg-gray-500"
                onClick={(e) => {
                  e.preventDefault();
                  setNotes(
                    notes.map((originalNote) => {
                      if (originalNote.id === editedNote.id) {
                        return {
                          ...originalNote,
                          ...editedNote,
                          category: selectedCategory,
                        };
                      }
                      return originalNote;
                    })
                  );
                  setDisplayNoteDetail(false);
                  navigate(
                    `${
                      editedNote.isDeleted
                        ? "/trash"
                        : editedNote.isFavorite
                        ? "/favorites"
                        : "/"
                    }`
                  );
                }}
              >
                Save
              </button>
              <button
                className="font-medium hover:bg-gray-200 cursor-pointer rounded px-4 py-2 dark:hover:bg-gray-500"
                onClick={() => {
                  setDisplayNoteDetail(false);
                  navigate(
                    `${
                      editedNote.isDeleted
                        ? "/trash"
                        : editedNote.isFavorite
                        ? "/favorites"
                        : "/"
                    }`
                  );
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteDetail;
