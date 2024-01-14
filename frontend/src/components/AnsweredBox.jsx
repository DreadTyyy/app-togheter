import React from "react";
import { getFormatedDateWithTime } from "../utils/formattedDate";
import PropTypes from "prop-types";

const AnsweredBox = ({ authAnswer, answer_date, answer }) => {
  return (
    <div className="my-4 border border-gray-400 p-4 rounded-md shadow-md">
      <div className="head flex items-center gap-4 ">
        <img
          src="../../public/profile/valak.jfif"
          alt="profil image"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <h2 className="loose-normal text-md font-semibold">{authAnswer}</h2>
          <p className="text-gray-400 text-sm">
            {getFormatedDateWithTime(answer_date)}
          </p>
        </div>
      </div>
      <p className="mt-4 text-md">{answer}</p>
    </div>
  );
};
export default AnsweredBox;

AnsweredBox.propTypes = {
  authAnswer: PropTypes.string.isRequired,
  answer_date: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};
