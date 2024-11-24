const API_URL = "https://api.thecatapi.com/v1/breeds";

document.addEventListener("DOMContentLoaded", () => {
  const galeria = document.getElementById("galeria");
  const ordenAlfabeticoBTN = document.getElementById("ordenAlfabetico");
  const pequeBTN = document.getElementById("peque");
  const medianoBTN = document.getElementById("mediano");
  const grandeBTN = document.getElementById("grande");
  const pagina = document.createElement("div");
  pagina.id = "pagina";
  galeria.after(pagina);

  let gatos = [];
  let gatosFiltrados = [];
  let paginaActual = 1;
  const gatosPorPagina = 10;

  async function fetchGatos() {
    try {
      const response = await fetch(API_URL);
      gatos = await response.json();

      gatos.forEach((gatito) => {
        if (!gatito.image) {
          gatito.image = {
            url: gatito.reference_image_id
              ? `https://cdn2.thecatapi.com/images/${gatito.reference_image_id}.jpg`
              : "no.png",
          };
        }
      });

      gatosFiltrados = [...gatos];
      cadaPagina();
    } catch (error) {
      console.error("Error fetching datos de apicat:", error);
      galeria.innerHTML = "<p>Error al cargar los datos de los gatos.</p>";
    }
  }

  function cadaPagina() {
    const inicio = (paginaActual - 1) * gatosPorPagina;
    const final = inicio + gatosPorPagina;
    const gatosEnCadaPagina = gatosFiltrados.slice(inicio, final);

    divGatos(gatosEnCadaPagina);
    paginas();
  }

  function divGatos(cadaGato) {
    galeria.innerHTML = "";
    cadaGato.forEach((gatito) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${gatito.image.url}" alt="${gatito.name}">
        <h3>${gatito.name}</h3>
        <button class="verBTN">Ver</button>
      `;
      const botonVer = card.querySelector(".verBTN");
      botonVer.addEventListener("click", () => mostrarDetallesGato(gatito));

      galeria.appendChild(card);
    });
  }

  function mostrarDetallesGato(gatito) {
    pequeBTN.style.display = 'none';
    medianoBTN.style.display = 'none';
    grandeBTN.style.display = 'none';
    pagina.style.display = 'none';
    ordenAlfabeticoBTN.style.display = 'none';

    galeria.innerHTML = `
      <div class="detallesGato">
        <img src="${gatito.image.url}" alt="${gatito.name}">
        <h3>${gatito.name}</h3>
        <p><strong>Raza:</strong> ${gatito.name}</p>
        <p><strong>Descripción:</strong> ${gatito.description || "No hay descripción disponible."}</p>
        <p><strong>Peso:</strong> ${gatito.weight.metric} kg</p>
        <button class="atrasBTN">Atrás</button>
      </div>
    `;

    const atrasBTN = document.querySelector(".atrasBTN");
    atrasBTN.addEventListener("click", () => {
      paginaActual = 1;
      cadaPagina();

      pequeBTN.style.display = 'inline-block';
      medianoBTN.style.display = 'inline-block';
      grandeBTN.style.display = 'inline-block';
      pagina.style.display = 'block';
      ordenAlfabeticoBTN.style.display = 'inline-block';
    });
  }

  function paginas() {
    pagina.innerHTML = "";
    const todasPaginas = Math.ceil(gatosFiltrados.length / gatosPorPagina);

    for (let i = 1; i <= todasPaginas; i++) {
      const boton = document.createElement("button");
      boton.textContent = i;
      boton.className = i === paginaActual ? "activo" : "";
      boton.addEventListener("click", () => {
        paginaActual = i;
        cadaPagina();
      });
      pagina.appendChild(boton);
    }
  }

  ordenAlfabeticoBTN.addEventListener("click", () => {
    pequeBTN.classList.remove("activo");
    medianoBTN.classList.remove("activo");
    grandeBTN.classList.remove("activo");

    ordenAlfabeticoBTN.classList.add("activo");
    gatosFiltrados = [...gatos];
    gatosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
    paginaActual = 1;
    cadaPagina();
  });
  
  function filtroPeso(rangoPeso) {
      ordenAlfabeticoBTN.classList.remove("activo");
      pequeBTN.classList.remove("activo");
      medianoBTN.classList.remove("activo");
      grandeBTN.classList.remove("activo");

      if (rangoPeso === "peque") pequeBTN.classList.add("activo");
      if (rangoPeso === "medio") medianoBTN.classList.add("activo");
      if (rangoPeso === "grande") grandeBTN.classList.add("activo");
  
    gatosFiltrados = gatos.filter((gatito) => {
      const peso = gatito.weight.metric.split(" - ").map(Number);
      const compara = (peso[0] + peso[1]) / 2;

      if (rangoPeso === "peque") return compara < 4;
      if (rangoPeso === "medio") return compara >= 4 && compara <= 6;
      if (rangoPeso === "grande") return compara > 6;
    });
    paginaActual = 1;
    cadaPagina();
  }

  pequeBTN.addEventListener("click", () => { filtroPeso("peque"); });

  medianoBTN.addEventListener("click", () => { filtroPeso("medio"); });

  grandeBTN.addEventListener("click", () => { filtroPeso("grande"); });

  fetchGatos();
});
