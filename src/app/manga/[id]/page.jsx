import Image from "next/image";
import React from "react";
import { AiFillStar } from "react-icons/ai";
import { BsBook } from "react-icons/bs"; // Cambiamos el ícono de dólar por un libro
import { BiTimeFive } from "react-icons/bi";

// Cambiamos el nombre del componente de MoviePage a MangaPage
const MangaPage = async ({ params }) => {
  const paramsId = params.id;

  try {
    // 1. Apuntamos al endpoint individual de Jikan usando el ID
    const api = await fetch(`https://api.jikan.moe/v4/manga/${paramsId}`);

    if (!api.ok) throw new Error("¡No se pudo obtener la información del manga!");

    const response = await api.json();
    // 2. Jikan siempre devuelve la información dentro de la propiedad "data"
    const data = response.data; 

    return (
      <div className="p-6 flex flex-col lg:flex-row items-center content-center mt-12 max-w-6xl mx-auto ">
        <Image
          className="rounded-lg mb-4 sm:mr-4 object-cover"
          src={data?.images?.webp?.large_image_url || data?.images?.jpg?.image_url}
          width={500}
          height={400}
          style={{ maxWidth: "100%", height: "auto", aspectRatio: "2/3" }}
          placeholder="blur"
          blurDataURL="/spinner.svg"
          alt={data?.title || "Portada del manga"}
        />
        <div className="sm:w-9/12">
          <h2 className="text-2xl font-bold text-cyan-500 mb-2">
            {data?.title} {data?.title_japanese ? `(${data?.title_japanese})` : ""}
          </h2>
          <p className="mt-2 text-sm md:text-base">
            <span className="text-xl font-semibold text-cyan-500 mr-1">
              Sinopsis:
            </span>
            {data?.synopsis || "No hay sinopsis disponible."}
          </p>
          <p className="mt-2">
            <span className="text-xl font-semibold text-cyan-500 mr-1">
              Revista / Publicación:
            </span>
            {/* Buscamos la primera revista en la que se serializó */}
            {data?.serializations?.[0]?.name || "Desconocida"}
          </p>
          <p className="mt-2">
            <span className="text-xl font-semibold text-cyan-500 mr-1">
              Fechas:
            </span>
            {data?.published?.string || "Desconocida"}
          </p>
          <div className="flex items-center mt-4 flex-wrap gap-6">
            <p className="flex items-center mb-2">
              <AiFillStar className="text-amber-500 mr-1 text-xl" />
              {data?.score ? Number(data.score).toFixed(1) : "N/A"}
            </p>
            
            {/* Si tiene volúmenes los mostramos, si no, indicamos que sigue en publicación */}
            <p className="flex items-center mb-2">
              <BsBook className="mr-1 text-xl text-green-500" />
              {data?.volumes ? `${data.volumes} Volúmenes` : "En publicación"}
            </p>
            
            <p className="flex items-center mb-2">
              <BiTimeFive className="mr-1 text-xl text-cyan-500" />
              {data?.status || "Desconocido"}
            </p>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl text-red-500 font-bold mb-4">Error</h1>
        <p className="text-lg">{err.message}</p>
      </div>
    );
  }
};

export default MangaPage;