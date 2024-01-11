import React, { useEffect, useState } from "react";
import BlogBox from "../components/BlogBox";
import NotFoundItem from "../components/NotFoundItem";
import { Link } from "react-router-dom";
import { getBlogs } from "../utils/network-data";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await getBlogs();
      setBlogs(data);
      setInitialized(true);
    };
    fetchBlogs();
  }, []);

  if (!initialized) {
    return <div className="md:mx-[10%] my-12">Loading...</div>;
  }
  if (blogs?.length <= 0) {
    return <NotFoundItem>Blog</NotFoundItem>;
  }

  return (
    <main className="md:mx-[10%]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold my-12">Konten Blog</h1>
        <Link to={"/blogs/add"} className="text-lg underline text-primary">
          Buat Blog
        </Link>
      </div>
      <div>
        <p className="text-lg">Filter: </p>
      </div>
      <section className="grid md:grid-cols-4 grid-cols-1 gap-4 mt-4 md:max-w-[80%]">
        {blogs.map((blog) => {
          return (
            <div
              key={blog.id}
              className="border-gray-400 border-b-[0.1px] md:border-none py-6">
              <BlogBox {...blog} />
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default BlogsPage;
