import React, { useContext, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { AppContext } from "../App";
import Note from "../Note";
import { FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";

const Trash = () => {
  const { notes, setNotes, isSidebarExpanded, isGridView } = useContext(AppContext);
  const [trashedNotes, setTrashedNotes] = useState([]);

  useEffect(() => {
    setTrashedNotes(notes.filter((note) => note.isDeleted));
    return () => {};
  }, [notes]);

  console.log("trash");

  return (
    <div
      className={`${
        isSidebarExpanded
          ? isGridView
            ? "w-full"
            : "w-full md:w-2/3"
          : isGridView
          ? "w-full"
          : "w-full md:w-3/4"
      } h-full pt-8`}
    >
      {trashedNotes.length > 0 && (
        <div
          className="flex flex-row justify-center mb-8"
          onClick={() => setNotes(notes.filter((note) => !note.isDeleted))}
        >
          <p className=" w-fit px-4 py-2 text-center text-blue-500 font-medium hover:bg-slate-100 hover:rounded cursor-pointer">
            Empty Trash
          </p>
        </div>
      )}
      {trashedNotes.length === 0 && (
        <div className="flex flex-row w-full h-full justify-center items-center">
          <div className="flex flex-col items-center">
            <FiTrash className="text-gray-200 w-4/6 h-4/6 mb-4" />
            <p className="text-gray-400 font-medium text-xl">
              No notes in Trash
            </p>
          </div>
        </div>
      )}
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 1,
          750: isGridView ? 2 : 1,
          900: isGridView ? 3 : 1,
        }}
      >
        <Masonry gutter={16}>
          {trashedNotes
            .filter((note) => note.isDeleted)
            .slice(0)
            .reverse()
            .map((note) => {
              return (
                <div key={note.id}>
                  <Note {...note} isPinHidden={true} isDeleted={true} />
                </div>
              );
            })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default Trash;
