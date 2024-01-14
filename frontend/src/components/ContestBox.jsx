import React from "react";
import { getFormattedDate } from "../utils/formattedDate";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ContestBox = ({
  id,
  title,
  deadline,
  brief,
  id_user,
  submited,
  award,
}) => {
  let isAwarded = 0;

  const splitAward = award.split(",");
  splitAward.map((item) => {
    item !== "0" && isAwarded++;
  });
  return (
    <article className="border border-gray-400 p-4 rounded-md shadow-md hover:bg-gray-50 cursor-pointer transition-all">
      <Link to={`/contest/${id}`}>
        <div className="flex justify-between md:flex-nowrap flex-wrap">
          <h2 className="font-semibold text-xl text-primary max-w-[100%]">
            {title}
          </h2>
          <h3 className="text-md text-gray-500">
            Deadline: {getFormattedDate(deadline)}
          </h3>
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
            <img
              src="/profile/valak.jfif"
              alt="profil img"
              className="w-4 h-4 rounded-full"
            />
            <p className="text-sm">
              Penyelenggara: {id_user} | Pemenang: {isAwarded}/
              {splitAward.length}
            </p>
          </div>
          <h4 className="text-md text-gray-500">
            Sedang mengikuti: {submited}
          </h4>
        </div>
      </Link>
    </article>
  );
};

export default ContestBox;

ContestBox.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  deadline: PropTypes.string.isRequired,
  brief: PropTypes.string.isRequired,
  id_user: PropTypes.string.isRequired,
  submited: PropTypes.number.isRequired,
  award: PropTypes.string.isRequired,
};
