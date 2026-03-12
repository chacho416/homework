import React from "react";
import Card from "../UI/Card";
import Link from "next/link";
import Image from "next/image";
import { FaRegThumbsUp } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";

const ResultItems = ({ results }) => {
  const mangaId = results?.mal_id;
  const imageUrl = results?.images?.webp?.large_image_url || results?.images?.jpg?.image_url;

  return (
    <Card>
      <Link href={`/manga/${mangaId}`}>
        <Image
          className="rounded-t-lg group-hover:opacity-70 transition-opacity duration-200 object-cover"
          src={imageUrl}
          width={500}
          height={300}
          style={{ maxWidth: "100%", height: "auto", aspectRatio: "2/3" }}
          placeholder="blur"
          blurDataURL="/spinner.svg"
          alt={results?.title || "Portada de manga"}
        />
        <div className="px-2">
          <p className="mt-2 line-clamp-2 text-sm">
            {results?.synopsis || "Sin sinopsis disponible."}
          </p>
          
          {/* Título: verde oscuro (claro) / verde neón (oscuro) */}
          <h2 className="truncate text-lg font-bold text-green-700 dark:text-green-400 my-2 transition-colors">
            {results?.title}
          </h2>
          
          <div className="flex justify-between items-center flex-wrap text-sm pb-2">
            <p className="mt-1">
              {results?.published?.prop?.from?.year || "N/A"}
            </p>
            
            <p className="flex items-center mt-1 mx-1">
              {/* Ícono de pulgar arriba dinámico */}
              <FaRegThumbsUp className="mr-1 text-green-700 dark:text-green-400 transition-colors" />
              {results?.members ? (results.members / 1000).toFixed(1) + "k" : "0"}
            </p>
            
            <p className="flex items-center mt-1">
              <AiFillStar className="text-amber-500 mr-1" />
              {results?.score ? Number(results.score).toFixed(1) : "N/A"}
            </p>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ResultItems;