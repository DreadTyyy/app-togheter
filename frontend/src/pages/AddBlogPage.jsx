import React, { useEffect, useState } from "react";
import useInput from "../hooks/useInput";
import { addBlog } from "../utils/network-data";
import { checkFormattedImage } from "../utils/formattedImage";
import { useNavigate } from "react-router-dom";

const AddBlogPage = ({ authUser }) => {
  const [title, onTitleHandlerChanges] = useInput("");
  const [body, setBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser === null) {
      alert("Silahkan login terlebih dahulu untuk menambahkan blog");
      navigate("/blogs");
    }
  }, []);

  useEffect(() => {
    if (selectedImage !== null) {
      const result = checkFormattedImage(selectedImage);
      if (!result) {
        setSelectedImage(null);
        setShow(false);
      } else {
        setShow(true);
      }
    } else {
      setShow(false);
    }
  }, [selectedImage]);

  const onBodyHandlerChanges = (e) => {
    setBody(e.target.innerHTML);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (body.length <= 0) {
      return alert("Isi konten tidak boleh kosong!");
    }
    if (selectedImage === null) {
      return alert("Upload cover blog terlebih dahulu!");
    }
    const newBlog = async () => {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("title", title);
      formData.append("body", body);

      const { error, message } = await addBlog(formData, selectedImage);
      alert(message);
      if (!error) {
        document.getElementById("title").value = "";
        document.getElementById("body").innerHTML = "";
        setBody("");
        setShow(false);
        setSelectedImage(null);
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
            id="title"
            className="w-[90%] font-normal bg-transparent focus:bg-transparent focus:font-medium focus:text-primary focus:outline-none border-b border-primary"
          />
        </div>
        <div className="border border-gray-400 p-4 rounded-md shadow-md">
          <p className="text-md font-semibold">Isi konten: </p>
          <div
            onInput={onBodyHandlerChanges}
            id="body"
            className="w-full p-4 focus:outline-none min-h-[15rem] h-auto border border-primary rounded-sm overflow-auto"
            contentEditable></div>
        </div>

        <div>
          <p className="text-md font-semibold">Cover Blog: </p>
          {show && (
            <div className="w-full flex justify-center items-center">
              <img src={URL.createObjectURL(selectedImage)} alt="cover blog" />
            </div>
          )}
          {selectedImage === null ? (
            <input
              type="file"
              name="file"
              onInput={(event) => setSelectedImage(event.target.files[0])}
            />
          ) : (
            <button
              className="px-4 py-1 text-sm bg-red-700 mt-2 rounded-full text-white"
              onClick={() => {
                setShow(false);
                setSelectedImage(null);
              }}>
              Reset Cover
            </button>
          )}
        </div>
        <button className="px-8 py-2 bg-primary rounded-full text-white">
          Buat
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
