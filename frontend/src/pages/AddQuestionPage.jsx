import React, { useEffect } from "react";
import useInput from "../hooks/useInput";
import { addQuestion } from "../utils/network-data";
import { useNavigate } from "react-router-dom";

const AddQuestionPage = ({ authUser }) => {
  const [question, onQuestionHandlerChanges] = useInput("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser === null) {
      alert("Silahkan login terlebih dahulu untuk menambahkan pertanyaan");
      navigate("/question");
    }
  }, []);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const newQuestion = async () => {
      const { message } = await addQuestion({ title: question });
      alert(message);
      if (!error) {
        document.getElementById("question").value = "";
      }
    };
    newQuestion();
  };
  return (
    <div className="mt-12 md:mx-[10%] md:w-[70%] w-full">
      <h1 className="text-2xl font-bold mb-8">Tambahkan Pertanyaan Baru</h1>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
        <div className="border border-gray-400 text-lg p-4 rounded-md shadow-md">
          <label htmlFor="question" className="font-semibold">
            Pertanyaan anda:{" "}
          </label>
          <input
            type="text"
            required
            name="question"
            value={question}
            onChange={onQuestionHandlerChanges}
            id="question"
            className="w-full focus:bg-transparent bg-transparent focus:font-medium focus:text-primary focus:outline-none border-b border-primary"
          />
        </div>
        <button className="px-8 py-2 bg-primary rounded-full text-white">
          Tambahkan Pertanyaan
        </button>
      </form>
    </div>
  );
};

export default AddQuestionPage;
