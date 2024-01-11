import React, { useState } from "react";
import useInput from "../hooks/useInput";
import { addBlog } from "../utils/network-data";

const AddBlogPage = () => {
  const [title, onTitleHandlerChanges] = useInput("");
  const [body, setBody] = useState("");

  const onBodyHandlerChanges = (e) => {
    setBody(e.target.innerHTML);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (body.length <= 0) {
      return alert("Isi konten tidak boleh kosong!");
    }
    const newBlog = async () => {
      const { error, message } = await addBlog({ title, body });
      alert(message);
      if (!error) {
        document.getElementById("title").value = "";
        document.getElementById("body").innerHTML = "";
        setBody("");
      }
    };
    newBlog();
  };
  return (
    <div className="mt-12 md:mx-[10%] md:w-[70%] w-full">
      <h1 className="text-2xl font-bold mb-8">Tambahkan Blog Baru</h1>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
        <div className="border border-gray-400 p-4 rounded-md shadow-md">
          <label htmlFor="title" className="text-md font-semibold">
            Judul Blog:{" "}
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onTitleHandlerChanges}
            required
            id="title"
            className="w-[90%] font-normal bg-transparent focus:bg-transparent focus:font-medium focus:text-primary focus:outline-none border-b border-primary"
          />
        </div>
        <div className="border border-gray-400 p-4 rounded-md shadow-md">
          <p className="text-md font-semibold">Isi konten: </p>
          <div
            onInput={onBodyHandlerChanges}
            id="body"
            className="w-full p-4 focus:outline-none h-[15rem] border border-primary rounded-sm overflow-auto"
            contentEditable
            required></div>
        </div>
        <button className="px-8 py-2 bg-primary rounded-full text-white">
          Buat
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
