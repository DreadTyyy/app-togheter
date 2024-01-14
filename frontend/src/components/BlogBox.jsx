import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getFormatedDateWithTime } from "../utils/formattedDate";

const BlogBox = ({ id, id_user, image_blog, title, created_at }) => {
  const pathImage = import.meta.env.VITE_APP_BASEURL;

  return (
    <article className="cursor-pointer group">
      <Link to={`/blog/${id}`}>
        <img
          src={`${pathImage}/images/${image_blog}`}
          alt="blog image"
          className="w-full min-h-[120px] border rounded-md aspect-[4/3] object-cover object-center"
        />
        <h2 className="font-medium text-gray-500 text-sm">Oleh: {id_user}</h2>
        <p className="my-1 font-medium text-primary leading-6 group-hover:underline">
          {title}
        </p>
        <p className="text-gray-500">{getFormatedDateWithTime(created_at)}</p>
      </Link>
    </article>
  );
};

export default BlogBox;

BlogBox.propTypes = {
  id: PropTypes.number.isRequired,
  id_user: PropTypes.string.isRequired,
  image_blog: PropTypes.string,
  title: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
};
