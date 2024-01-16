import React, { useEffect, useRef } from "react";
import { useState } from "react";

const UploadPage = () => {
  const [image, setImage] = useState(null);
  const inputFileRef = useRef(null);
  const [blob, setBlob] = useState(null);
  const [listImage, setListImage] = useState(null);
  const BASE_URL = import.meta.env.VITE_APP_BASEURL;

  console.log(listImage);

  const getimage = async () => {
    const url =
      "https://nscsglpus98pyphm.public.blob.vercel-storage.com/contoh-presentasi-bisnis-makanan-Ul4ic2cWu8WQkxsA1pHNglIeMZ6Ds1.jpg";
    const image = await fetch(url, {
      method: "GET",
    });
    const blob = await image.blob();
    const data = URL.createObjectURL(blob);
    document.getElementById("image").src = data;
    console.log({ blob });
    console.log({ data });
  };

  function donwload() {
    // const getdonwload = async () => {
    //   console.log("masuk");
    //   const response = await fetch(`${BASE_URL}/api/download`);
    //   const responseJson = await response.json();
    //   setListImage(responseJson[0].url);
    // };
    // getdonwload();
  }

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const file = inputFileRef.current.files[0];
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch(
            `${BASE_URL}/api/upload?filename=${file.name}`,
            {
              method: "POST",
              body: formData,
            }
          );
          const newBlob = await response.json();
          setBlob(newBlob);
        }}>
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
      <button onClick={getimage}>Check here</button>
      <img alt="" id="image" className="w-[200px] h-[200px]" />
      {/* <ul>
        {listImage.map((item) => {
          <li key={item.url}>
            <img src={item.url} alt="" />
          </li>;
        })}
      </ul> */}
    </>
  );
};

export default UploadPage;
