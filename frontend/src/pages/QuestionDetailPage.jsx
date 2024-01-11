import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnsweredBox from "../components/AnsweredBox";
import { BiSend } from "react-icons/bi";
import NotFoundItem from "../components/NotFoundItem";
import { addAnswer, getDetailQuestion } from "../utils/network-data";
import { getFormattedDate } from "../utils/formattedDate";

const SideBar = ({ onAnswer, onSend, authUser }) => {
  return (
    <section className="border h-fit w-[40%] border-gray-400 p-4 rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Jawab Pertanyaan</h2>
        <h3 className="font-medium text-md underline">{authUser}</h3>
      </div>
      <div
        onInput={onAnswer}
        className="my-4 p-2 w-full border border-gray-400 h-[5rem] overflow-auto md:h-[15rem] rounded-md"
        contentEditable></div>
      <button
        onClick={onSend}
        className="px-6 py-2 flex gap-1 items-center bg-primary rounded-full text-white">
        <BiSend size={20} /> Kirim
      </button>
    </section>
  );
};

const QuestionDetailPage = ({ authUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [myAnswer, setMyAnswer] = useState("");
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      const { error, data } = await getDetailQuestion(id);
      if (!error) {
        setQuestion(data.question);
        setAnswers(data.answers);
      }
      setInitialized(true);
    };
    fetchQuestion();
  }, []);

  const onAnswerHandlerChanges = (event) => {
    setMyAnswer(event.target.innerHTML);
  };
  const onSendHandler = (e) => {
    e.preventDefault();
    if (myAnswer.length <= 0) {
      return alert("Jawaban tidak boleh kosong jika ingin mengirim jawaban!");
    }
    const sendAnswer = async () => {
      const { error } = await addAnswer({
        id_question: question.id_question,
        body: myAnswer,
      });
      if (!error) {
        window.location.reload();
      }
    };
    sendAnswer();
  };

  if (!initialized) {
    return <div className="md:mx-[10%] my-12">Loading...</div>;
  }
  if (question === null) {
    return <NotFoundItem>Pertanyaan</NotFoundItem>;
  }
  return (
    <>
      <section className="mt-12 md:mx-[10%] flex gap-4 ">
        <main className="max-w-[60%] min-w-[450px] w-[640px]">
          <div className="border border-gray-400 p-4 rounded-md shadow-md">
            <h1 className="font-bold text-xl">{question.title}</h1>
            <div className="flex gap-4 items-center mt-4">
              <img src="x" alt="profil" className="w-8 h-8 rounded-full" />
              <h2 className="font-semibold text-md underline text-primary mr-auto">
                {question.author}
              </h2>
              <p className="text-sm text-gray-400">
                {getFormattedDate(question.question_date)}
              </p>
            </div>
          </div>
          <article className="my-8">
            <p className="text-md">Jawaban terkait:</p>
            {question.is_answer === "true" ? (
              answers.map((item) => {
                return <AnsweredBox key={item.id_answer} {...item} />;
              })
            ) : (
              <p className="my-4 border border-gray-400 p-4 rounded-md shadow-md font-medium">
                Belum terdapat jawaban
              </p>
            )}
          </article>
        </main>
        {window.innerWidth > 600 && authUser !== null && (
          <SideBar
            authUser={authUser}
            body={myAnswer}
            onAnswer={onAnswerHandlerChanges}
            onSend={onSendHandler}
          />
        )}
      </section>
    </>
  );
};

export default QuestionDetailPage;
