import React, { useEffect, useState } from "react";
import ContestBox from "../components/ContestBox";
import { getContests } from "../utils/network-data";

const ContestPage = () => {
  const [contests, setContests] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      const { data, error } = await getContests();
      if (!error) {
        setContests(data);
        setInitialized(true);
      }
    };
    fetchContest();
  }, []);

  if (!initialized) {
    return <div className="md:mx-[10%] my-12">Loading...</div>;
  }

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
