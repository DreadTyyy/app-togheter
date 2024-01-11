import React, { useState } from "react";
import ContestBox from "../components/ContestBox";
import { getAllContest } from "../utils/data";

const ContestPage = () => {
  const [contests, setContests] = useState(() => {
    return getAllContest() || null;
  });

  return (
    <main className="md:mx-[10%]">
      <h1 className="text-2xl font-bold my-12">Kontes Tersedia</h1>
      <div>
        <p className="text-lg">Filter: </p>
      </div>
      <section className="flex flex-col gap-4 mt-4 md:max-w-[80%]">
        {contests.map((contest) => {
          return <ContestBox key={contest.id} {...contest} />;
        })}
      </section>
    </main>
  );
};

export default ContestPage;
