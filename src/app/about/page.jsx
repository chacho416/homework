import React from "react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 mt-8 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-6 border-b border-green-700 dark:border-green-500 pb-2 transition-colors">
        Acerca de Chachos Shonens
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-3 text-green-600 dark:text-green-400 transition-colors">El Proyecto</h2>
        <p className="text-lg leading-relaxed mb-4">
          <strong>Chachos Shonens</strong> es un catálogo interactivo diseñado para explorar el inmenso mundo del manga con una interfaz rápida, minimalista y de alto contraste. 
          La plataforma consume datos en tiempo real para mostrar los títulos más populares, obras en emisión y detalles precisos de cada manga, como su sinopsis, calificación, volúmenes y estado de publicación.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 text-green-600 dark:text-green-400 transition-colors">Tecnologías Utilizadas</h2>
        <ul className="list-disc list-inside text-lg space-y-2 ml-2">
          <li><strong>Frontend:</strong> Construido con <em>Next.js</em> y <em>React</em> para un renderizado rápido, eficiente y un enrutamiento dinámico.</li>
          <li><strong>Estilos:</strong> Interfaz diseñada con <em>Tailwind CSS</em>, implementando un sistema dual de modo claro y un modo oscuro puro para lectura cómoda.</li>
          <li><strong>Consumo de API:</strong> Integración asíncrona con <em>Jikan (MyAnimeList REST API)</em> para la obtención masiva de datos sin necesidad de administrar bases de datos locales.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 text-green-600 dark:text-green-400 transition-colors">Sobre el Desarrollador</h2>
        <p className="text-lg leading-relaxed">
          Este catálogo fue desarrollado como un proyecto práctico de ingeniería de software. Como estudiante de ingeniería en la Universidad de Guadalajara, mi enfoque está en crear arquitecturas limpias, tanto en el consumo de APIs en el frontend como en el desarrollo de sistemas robustos y eficientes en el backend. Chachos Shonens refleja mi interés en combinar código bien estructurado con interfaces visualmente atractivas.
        </p>
      </section>
    </div>
  );
};

export default About;