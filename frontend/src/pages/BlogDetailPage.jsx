import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundItem from "../components/NotFoundItem";
import { getDetailBlog } from "../utils/network-data";
import { getFormatedDateWithTime } from "../utils/formattedDate";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      const { error, data } = await getDetailBlog({ id });
      setBlog(data[0]);
      if (!error) {
        setInitialized(true);
      }
    };
    fetchBlog();
  }, []);

  if (!initialized) {
    return <div className="md:mx-[10%] my-12">Loading...</div>;
  }
  if (blog.length < 1) {
    return <NotFoundItem>Blog</NotFoundItem>;
  }
  return (
    <section className="mt-12 md:mx-[10%] md:w-[70%] w-full">
      <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center gap-4">
        <img src="x" alt="profil image" className="w-6 h-6 rounded-full" />
        <div>
          <h2 className="text-md font-medium">{blog.id_user}</h2>
          <h3 className="text-sm text-gray-500">
            Dibuat pada {getFormatedDateWithTime(blog.created_at)}
          </h3>
        </div>
      </div>
      <article className="my-4">
        <img
          src={`${blog.image_blog}`}
          alt="image blog"
          className="mb-6 w-full h-[480px] max-h-[480px] rounded-lg bg-gray-700"
        />
        <hr />
        <p className="my-8 md:text-lg">{blog.body}</p>
      </article>
    </section>
  );
};

export default BlogDetailPage;
