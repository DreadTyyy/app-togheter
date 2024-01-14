import React, { useEffect } from "react";
import { useState } from "react";
import QuestionBox from "../components/QuestionBox";
import BlogBox from "../components/BlogBox";
import { getBlogs, getQuestions } from "../utils/network-data";
import NotFoundItem from "../components/NotFoundItem";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const resQuestions = await getQuestions();
      const resBlogs = await getBlogs();
      setQuestions(resQuestions.data);
      setBlogs(resBlogs.data);
      setInitialized(true);
    };
    fetchContent();
  }, []);

  return (
    <div className="mt-12 flex flex-col md:grid grid-cols-5 gap-6 md:w-[90%] w-full place ">
      <div className=" col-span-3">
        <h1 className="text-2xl font-semibold">Diskusi Terkini</h1>
        <section className="mt-8 flex flex-col gap-4 md:w-[100%]">
          {!initialized ? (
            <div className="md:mx-[10%] my-12">Loading...</div>
          ) : questions.length > 0 ? (
            questions.map((data) => {
              return (
                <div key={data.id}>
                  <QuestionBox {...data} />
                </div>
              );
            })
          ) : (
            <NotFoundItem>Pertanyaan</NotFoundItem>
          )}
        </section>
      </div>
      <div className=" col-span-2">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <section className="mt-8 w-[100%] ">
          <div className="border flex flex-wrap md:grid grid-cols-2 gap-x-2 gap-y-6 border-gray-400 p-4 rounded-md shadow-md">
            {!initialized ? (
              <div className="md:mx-[10%] my-12">Loading...</div>
            ) : questions.length > 0 ? (
              blogs.map((blog) => {
                return (
                  <div
                    key={blog.id}
                    className="border-gray-400 w-full pb-4 border-b-[0.1px] md:border-none">
                    <BlogBox {...blog} />
                  </div>
                );
              })
            ) : (
              <NotFoundItem>Pertanyaan</NotFoundItem>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
