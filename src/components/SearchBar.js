import React, { useContext, useState } from 'react'
import { AiOutlineSearch, } from 'react-icons/ai';
import { MdClear, } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';


const SearchBar = () => {
  const [showClearIcon, setShowClearIcon] = useState(false);
  const navigate = useNavigate();
  const { searchKeyword, setSearchKeyword } = useContext(AppContext);
    return (
      <form
        className=" flex flex-row items-center w-full h-full border rounded-md bg-gray-100 focus-within:bg-white"
        onClick={(e) => {
          // navigate('/search');
          setShowClearIcon(true);
        }}
      >
        <div className="w-fit h-fit p-2 mx-2 hover:bg-gray-100 rounded-full text-gray-600">
          <AiOutlineSearch fontSize={24} />
        </div>
        <input
          id="search"
          placeholder="Search your notes here..."
          className="w-full h-full py-2 outline-none bg-transparent text-lg placeholder:text-gray-400 placeholder:font-normal dark:text-black"
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
        />
        {showClearIcon && (
          <div
            className="w-fit h-fit p-2 mx-2 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowClearIcon(false);
              setSearchKeyword("");
              document.getElementById("search").value = "";
            }}
          >
            <MdClear fontSize={24} />
          </div>
        )}
      </form>
    );
}

export default SearchBar
