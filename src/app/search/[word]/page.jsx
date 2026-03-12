import Pagination from "@/components/Pagination/Pagination";
import Results from "@/components/ResultsData/Results";
import React from "react";

const Search = async ({ params, searchParams }) => {
  // decodificamos la palabra por si tiene espacios (ej. "Dragon Ball" en vez de "Dragon%20Ball")
  const searchWord = decodeURI(params.word);
  const pageNumber = searchParams.pageNumber || 1;

  try {
    // Apuntamos al buscador oficial de Jikan sin necesidad de API Keys
    const searchApi = await fetch(
      `https://api.jikan.moe/v4/manga?q=${searchWord}&page=${pageNumber}`
    );

    if (!searchApi.ok) throw new Error("¡Hubo un error al buscar el manga!");

    const data = await searchApi.json();

    // Verificamos si Jikan nos devolvió resultados o si la lista viene vacía
    const hasResults = data?.data && data.data.length > 0;

    return (
      <div className="min-h-screen">
        {hasResults ? (
          <>
            {/* Le pasamos data.data que es donde Jikan guarda la lista */}
            <Results results={data.data} />
            
            {/* Paginación ajustada a las páginas de Jikan */}
            {data?.pagination?.last_visible_page > 1 && (
              <Pagination totalPages={data.pagination.last_visible_page} />
            )}
          </>
        ) : (
          <h1 className="text-center text-xl mt-20 text-cyan-500 font-bold">
            No se encontraron mangas para la búsqueda: "{searchWord}"
          </h1>
        )}
      </div>
    );
  } catch (error) {
    return (
      <h1 className="text-center text-xl mt-20 text-red-500">
        {error.message}
      </h1>
    );
  }
};

export default Search;