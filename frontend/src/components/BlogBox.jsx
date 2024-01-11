import React from "react";
import { Link } from "react-router-dom";
import { getFormatedDateWithTime } from "../utils/formattedDate";

const BlogBox = ({ id, id_user, image_blog, title, created_at }) => {
  return (
    <article className="cursor-pointer group">
      <Link to={`/blog/${id}`}>
        <img
          src={`${image_blog}`}
          alt="blog image"
          className="w-full h-[120px] border rounded-md"
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
