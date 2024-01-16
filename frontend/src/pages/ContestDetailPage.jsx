import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import NotFoundItem from "../components/NotFoundItem";
import { getDetailContest } from "../utils/network-data";
import { getImageBlob } from "../utils/formattedImage";
import PropTypes from "prop-types";

const SubmitedBox = ({ index, submit_image, submit_title, user_submit }) => {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    async function getImage() {
      const image = await getImageBlob(submit_image);
      setImageUrl(image);
    }
    getImage();
  }, []);

  return (
    <div className="relative w-full rounded-md border border-gray-400 shadow-md overflow-hidden">
      <p className="absolute top-[2%] left-[2%] text-sm font-semibold bg-primary text-white p-1 rounded-sm">
        #{index}
      </p>
      <img
        src={imageUrl}
        alt={`karya ${user_submit}`}
        className="w-full h-fit object-cover bg-red-500 aspect-square"
      />
      <h3 className="text-md font-semibold mt-2 px-2">{submit_title}</h3>
      <div className="flex gap-2 items-center px-2 pb-2">
        <img
          src="/profile/valak.jfif"
          alt="profil img"
          className="w-4 h-4 rounded-full"
        />
        <p className="text-sm">{user_submit}</p>
      </div>
    </div>
  );
};

const ContestDetailPage = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [submit, setSubmit] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      const { error, data } = await getDetailContest(id);
      if (!error) {
        setContest(data.data[0]);
        setSubmit(data.item_submit);
        setInitialized(true);
      }
    };
    fetchContest();
  }, []);

  if (!initialized) {
    return <div className="md:mx-[10%] my-12">Loading...</div>;
  }

  if (contest === null) {
    return <NotFoundItem>Kontes</NotFoundItem>;
  }

  return (
    <section className="mt-12 md:mx-[10%]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">{contest.title}</h1>
        <Link
          to={`/contest/${id}/submit`}
          className="px-6 py-2 bg-primary rounded-full text-white border border-transparent hover:border-white">
          Submit Kontes
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <img
          src="/profile/valak.jfif"
          alt="profil img"
          className="w-6 h-6 rounded-full"
        />
        <p className="text-sm">{contest.id_user} </p>
      </div>
      <div className="my-6">
        <h2 className="text-lg font-semibold">Deskripsi kontes: </h2>
        <p className="text-normal text-justify">{contest.brief}</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Karya kontes: </h2>
        <main className="grid md:grid-cols-5 grid-cols-2 gap-4">
          {contest.submited > 0 ? (
            submit.map((item, index) => {
              return (
                <SubmitedBox
                  index={contest.submited - index}
                  key={item.id_submit}
                  {...item}
                />
              );
            })
          ) : (
            <p className="w-[280px] font-semibold">
              Belum ada karya yang disubmit.
            </p>
          )}
        </main>
      </div>
    </section>
  );
};

export default ContestDetailPage;

SubmitedBox.propTypes = {
  index: PropTypes.number,
  submit_image: PropTypes.string.isRequired,
  submit_title: PropTypes.string.isRequired,
  user_submit: PropTypes.string.isRequired,
};
