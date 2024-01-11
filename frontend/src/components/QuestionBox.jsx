import React from "react";
import { PiNotePencilBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { getFormattedDate } from "../utils/formattedDate";

const QuestionBox = ({ id, id_user, title, created_at, is_answer }) => {
  return (
    <article className="border border-gray-400 p-4 rounded-md shadow-md ">
      <div className="head flex justify-between items-center gap-4 mb-4">
        <img
          src="https://picsum.photos/"
          alt="profil image"
          className="w-8 h-8 rounded-full"
        />
        <div className="mr-auto text-sm">
          <h2 className="loose-normal font-semibold">{id_user}</h2>
          <p className="text-gray-400">{getFormattedDate(created_at)}</p>
        </div>
        <p className="text-sm font-medium text-primary">
          {is_answer === "true" ? "Diskusi berlangsung" : "Belum ada diskusi"}
        </p>
      </div>
      <Link
        to={`/question/${id}`}
        className="text-md font-semibold cursor-pointer hover:underline">
        {title}
      </Link>
      <div className="mt-4">
        <Link
          to={`/question/${id}`}
          className="px-4 py-1 w-fit cursor-pointer flex gap-1 items-center border border-primary text-primary rounded-full hover:bg-primary hover:text-white font-medium transition-all">
          <PiNotePencilBold size={20} />
          Jawab
        </Link>
      </div>
    </article>
  );
};

export default QuestionBox;
