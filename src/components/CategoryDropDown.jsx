import { useContext, useRef, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { useOutsideClick } from "rooks";
import { v4 as uuidv4 } from 'uuid';
import { AppContext, } from '.././App';

const CategoryDropDown = ({ selectedCategory, setSelectedCategory, selectedColor, }) => {
  const { colorPalletes, } = useContext(AppContext);
  const [isDropDownOpen, setisDropDownOpen] = useState(false);
  const refDropDown = useRef();
  useOutsideClick(refDropDown, () => {
    if (isDropDownOpen) {
      setisDropDownOpen(false);
    }
  });

  const listOfCategories = [
    "General",
    "Work",
    "House",
    "Health",
    "Education",
    "Payment",
    "Ideas",
    "Gifts",
    "Reminders",
    "Vacation",
  ];

  const handleDropDownClick = (e, category) => {
    e.preventDefault();
    setSelectedCategory(category);
    setisDropDownOpen(false);
    
  };

  return (
    <div className="flex flex-row items-center gap-2 ">
      <h3
        className={`text-gray-600 text-sm font-medium ${
          selectedColor === colorPalletes[0].color
            ? "dark:text-white"
            : "dark:text-black"
        }`}
      >
        {" "}
        Select Category:{" "}
      </h3>

      <div
        ref={refDropDown}
        className={`flex flex-row w-2/6 h-10 px-4 items-center ${selectedColor === 'bg-white' ? 'dark:bg-zinc-900' : selectedColor} shadow-lg rounded-lg justify-between cursor-pointer hover:bg-gray-50 relative transition-all duration-200 ease-in-out dark:hover:bg-gray-500`}
        onClick={() => setisDropDownOpen(!isDropDownOpen)}
      >
        <h3
          className={`text-gray-600 text-sm font-medium ${
            selectedColor === colorPalletes[0].color
              ? "dark:text-white"
              : "dark:text-black"
          }`}
        >
          {selectedCategory}
        </h3>
        <RiArrowDownSLine />
        {isDropDownOpen && (
          <div className="w-full p-2 bg-white shadow absolute top-12 left-0 z-50 rounded-lg">
            {listOfCategories.map((category, index) => (
              <h3
                key={uuidv4()}
                className="text-gray-600 text-xs p-1 font-medium hover:bg-indigo-50 hover:pl-1 cursor-pointer rounded "
              >
                <div onClick={(e) => handleDropDownClick(e, category)}>
                  {category}
                </div>
              </h3>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDropDown;
