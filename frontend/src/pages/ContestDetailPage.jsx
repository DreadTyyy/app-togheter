import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getContest } from "../utils/data";

const ContestDetailPage = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(() => {
    return getContest(id) || null;
  });

  return (
    <>
      <div>ContestDetailPage</div>
      <div>ID : {contest.title}</div>
    </>
  );
};

export default ContestDetailPage;
