import React from "react";
import ResultItems from "./ResultItems";

const Results = ({ results }) => {
  return (
    <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-6xl mx-auto mt-4 items-stretch">
      {results?.map((result) => {
        // Cambiamos result.id por result.mal_id que es lo que manda Jikan
        return <ResultItems key={result.mal_id} results={result} />;
      })}
    </div>
  );
};

export default Results;