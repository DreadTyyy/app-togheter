import React, { useState, useEffect } from "react";
import useInput from "../hooks/useInput";
import checkFormattedImage from "../utils/formattedImage";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import NotFoundItem from "../components/NotFoundItem";
import { sendSubmit } from "../utils/network-data";
import { getDetailContest } from "../utils/network-data";

const SubmitPage = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [title, onTitleChanges] = useInput();
  const [description, onDescriptionChanges] = useInput();
  const [selectedImage, setSelectedImage] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      const { error, data } = await getDetailContest(id);
      if (!error) {
        setContest(data.data[0]);
        setInitialized(true);
      }
    };
    fetchContest();
  }, []);

  useEffect(() => {
    if (selectedImage !== null) {
      const result = checkFormattedImage(selectedImage);
      if (!result) {
        setSelectedImage(null);
      }
    }
  }, [selectedImage]);

  if (!initialized) {
    return <div className="md:mx-[10%] my-12">Loading...</div>;
  }

  if (contest === null) {
    return <NotFoundItem>Kontes</NotFoundItem>;
  }
  const onSubmitHandler = (event) => {
    event.preventDefault();
    const postSubmit = async () => {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("id_contest", id);
      const { error, message } = await sendSubmit(formData);
      alert(message);
      if (!error) {
        navigate(`/contest/${id}`);
      }
    };
    postSubmit();
  };

  return (
    <section className="mt-12 md:mx-[10%]">
      <Link to={`/contest/${id}`} className="text-primary underline">
        Back
      </Link>
      <h1 className="text-2xl font-bold mb-4">Submit Karya</h1>
      <form
        onSubmit={onSubmitHandler}
        className="w-full flex gap-4 md:flex-row flex-col">
        <main className="border md:max-w-[70%] w-full border-gray-400 p-4 rounded-md shadow-md">
          <div>
            <label htmlFor="title" className="font-medium">
              Judul:{" "}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={onTitleChanges}
              name="title"
              className="w-[90%] font-normal bg-transparent focus:bg-transparent focus:outline-none border-b border-primary"
              required
            />
          </div>
          <div className="flex flex-col my-4">
            <label htmlFor="description" className="font-medium">
              Deskripsi:{" "}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={onDescriptionChanges}
              name="description"
              className="w-[100%] min-h-[200px] font-normal bg-transparent focus:bg-transparent focus:outline-none border border-gray-400 rounded-md p-2"
              required
            />
          </div>
          <button className="px-8 py-2 bg-primary rounded-full text-white">
            Submit
          </button>
        </main>
        <article className="border min-w-[30%] border-gray-400 p-4 rounded-md shadow-md">
          {selectedImage === null ? (
            <input
              type="file"
              id="file"
              className="w-full"
              required
              onInput={(event) => setSelectedImage(event.target.files[0])}
            />
          ) : (
            <div className="flex justify-between">
              <p>{selectedImage.name}</p>
              <p
                className="text-red-600 font-medium cursor-pointer"
                onClick={() => setSelectedImage(null)}>
                X
              </p>
            </div>
          )}
        </article>
      </form>
    </section>
  );
};

export default SubmitPage;
