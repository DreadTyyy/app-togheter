import React, { useEffect, useState } from "react";
import { getAllDatas } from "../utils/data";
import QuestionBox from "../components/QuestionBox";
import NotFoundItem from "../components/NotFoundItem";
import { Link } from "react-router-dom";
import { getQuestions } from "../utils/network-data";

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await getQuestions();
      setQuestions(data);
      setInitialized(true);
    };
    fetchQuestions();
  }, []);

  if (!initialized) {
    return <div className="md:mx-[10%] my-12">Loading...</div>;
  }
  if (questions.length <= 0) {
    return <NotFoundItem>Diskusi</NotFoundItem>;
  }
  return (
    <main className="md:mx-[10%]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold my-12">Forum Diskusi</h1>
        <Link to={"/questions/add"} className="text-lg underline text-primary">
          Buat Pertanyaan
        </Link>
      </div>
      <div>
        <p className="text-lg">Filter: </p>
      </div>
      <section className="flex flex-col gap-4 mt-4 md:max-w-[80%]">
        {questions.map((question, index) => {
          if (index < 3) {
            return <QuestionBox key={question.id} {...question} />;
          }
        })}
      </section>
    </main>
  );
};

export default QuestionPage;
