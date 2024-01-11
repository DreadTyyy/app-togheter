import React from "react";
import { getFormattedDate } from "../utils/formattedDate";
import { Link } from "react-router-dom";

const ContestBox = ({
  id,
  title,
  deadline,
  brief,
  author,
  submited,
  award,
}) => {
  let isAwarded = 0;

  award.forEach((element) => {
    element === "" ? isAwarded : (isAwarded += 1);
  });
  return (
    <article className="border border-gray-400 p-4 rounded-md shadow-md hover:bg-gray-50 cursor-pointer transition-all">
      <Link to={`/contest/${id}`}>
        <div className="flex justify-between">
          <h2 className="font-semibold text-xl text-primary max-w-[70%]">
            {title}
          </h2>
          <h3 className="text-md">Deadline: {getFormattedDate(deadline)}</h3>
        </div>
        <p
          className="text-md my-4 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            maxHeight: 5 + "rem",
          }}>
          {brief}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <img src="x" alt="profil img" className="w-4 h-4 rounded-full" />
            <p className="text-sm">
              Penyelenggara: {author} | Pemenang: {isAwarded}/{award.length}
            </p>
          </div>
          <h4 className="text-md text-gray-500">
            Sedang mengikuti: {submited.length}
          </h4>
        </div>
      </Link>
    </article>
  );
};

export default ContestBox;
