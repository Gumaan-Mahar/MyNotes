import React, { useContext, useEffect, useState } from "react";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Link } from "react-router-dom";

import { RiStarLine } from "react-icons/ri";

import { AppContext } from "../App";
import Note from "../Note";

const Favorites = () => {
  const { notes, isSidebarExpanded, isGridView } = useContext(AppContext);
  const [favoriteNotes, setfavoriteNotes] = useState([]);

  useEffect(() => {
    setfavoriteNotes(notes.filter((note) => note.isFavorite && !note.isDeleted));
    return () => { };
  }, [notes]);
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
      } h-full pt-8 `}
    >
      {favoriteNotes.length === 0 && (
        <div className="flex flex-row w-full h-full justify-center items-center ">
          <div className="flex flex-col items-center">
            <RiStarLine className="text-gray-200 w-4/6 h-4/6 mb-4" />
            <p className="text-gray-400 font-medium text-xl">
              Your favorite notes appear here
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
          {favoriteNotes
            .slice(0)
            .reverse()
            .map((note) => {
              return (
                <div key={note.id}>
                  <Note {...note} isPinHidden={true} />
                </div>
              );
            })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default Favorites;
