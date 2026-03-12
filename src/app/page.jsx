import Pagination from "@/components/Pagination/Pagination";
import Results from "@/components/ResultsData/Results";

const Home = async ({ searchParams }) => {
  const page = searchParams.page || "fetchTrending";
  const pageNumber = searchParams.pageNumber || 1;

  // 1. Configuramos las rutas de la API de Manga (Jikan)
  let apiUrl = "";

  if (page === "fetchTrending") {
    // Mangas más populares
    apiUrl = `https://api.jikan.moe/v4/top/manga?filter=bypopularity&page=${pageNumber}`;
  } else if (page === "fetchTopRated") {
    // Mangas con mejor calificación
    apiUrl = `https://api.jikan.moe/v4/top/manga?page=${pageNumber}`;
  } else if (page === "fetchNew") {
    // Mangas en publicación actualmente
    apiUrl = `https://api.jikan.moe/v4/top/manga?filter=publishing&page=${pageNumber}`;
  } else {
    apiUrl = `https://api.jikan.moe/v4/top/manga?page=${pageNumber}`;
  }

  // 2. Hacemos la petición (sin necesidad de API Key)
  // Guardamos en caché por 3600 segundos (1 hora) para que la página cargue súper rápido
  const res = await fetch(apiUrl, { next: { revalidate: 3600 } });

  if (!res.ok) throw new Error("Failed to fetch manga data!");

  const data = await res.json();

  return (
    <>
      {/* 3. Jikan guarda la lista de mangas dentro de 'data.data' */}
      <Results results={data?.data} />
      
      {/* 4. Ajustamos la paginación a la estructura que devuelve Jikan */}
      {data?.pagination?.last_visible_page >= 1 && (
        <Pagination 
          totalPages={data?.pagination?.last_visible_page} 
          currentPage={page} 
        />
      )}
    </>
  );
};

export default Home;