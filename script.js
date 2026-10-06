/* =========================================
   POEMAS
========================================= */

const poems = [

    {
        title: "Poema de exemplo",
        author: "Autor do evento",

        image: "assets/autores/autor-01.jpg",

        audio: "assets/audios/poema-01.mp3"
    },


    {
        title: "Outra voz",
        author: "Autora do evento",

        image: "assets/autores/autor-02.jpg",

        audio: "assets/audios/poema-02.mp3"
    },


    {
        title: "Palavras ao vento",
        author: "Autor do evento",

        image: "assets/autores/autor-03.jpg",

        audio: "assets/audios/poema-03.mp3"
    }

];



/* =========================================
   ELEMENTOS DA PÁGINA
========================================= */

const list =
    document.getElementById("poemList");

const count =
    document.getElementById("poemCount");

const player =
    document.getElementById("player");

const audio =
    document.getElementById("audio");

const progress =
    document.getElementById("progress");

const playPause =
    document.getElementById("playPause");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const playerTitle =
    document.getElementById("playerTitle");

const playerAuthor =
    document.getElementById("playerAuthor");

const authorImage =
    document.getElementById("authorImage");

const authorInitials =
    document.getElementById("authorInitials");

const audioMessage =
    document.getElementById("audioMessage");



/* =========================================
   CONTROLE DO POEMA ATUAL
========================================= */

let currentIndex = -1;



/* =========================================
   CONTADOR DE POEMAS
========================================= */

count.textContent =
    `${String(poems.length).padStart(2, "0")} obras`;



/* =========================================
   PEGAR INICIAIS DO AUTOR
========================================= */

function initials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();

}



/* =========================================
   FORMATO DO TEMPO
========================================= */

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {

        return "0:00";

    }

    const minutes =
        Math.floor(seconds / 60);

    const secondsFormatted =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${minutes}:${secondsFormatted}`;

}



/* =========================================
   MOSTRAR OS POEMAS
========================================= */

function renderList() {

    list.innerHTML = poems.map(
        (poem, index) => `

        <button
            class="poem-card ${index === currentIndex ? "active" : ""}"
            data-index="${index}"
        >

            <div class="poem-number">

                ${String(index + 1).padStart(2, "0")}

            </div>


            <div>

                <h2 class="poem-title">

                    ${poem.title}

                </h2>


                <p class="poem-author">

                    ${poem.author}

                </p>

            </div>


            <span class="poem-play">

                ▶

            </span>

        </button>

    `
    ).join("");


    /*
        Quando clicar em qualquer poema
    */

    list
        .querySelectorAll(".poem-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    selectPoem(
                        Number(card.dataset.index)
                    );

                }
            );

        });

}



/* =========================================
   FOTO DO AUTOR
========================================= */

function setAuthorImage(poem) {

    /*
        Mostra inicialmente
        as iniciais do autor
    */

    authorInitials.textContent =
        initials(poem.author);

    authorInitials.style.display =
        "block";


    /*
        Remove foto anterior
    */

    authorImage
        .querySelector("img")
        ?.remove();


    /*
        Tenta carregar a nova foto
    */

    const img =
        new Image();


    img.onload = () => {

        authorInitials.style.display =
            "none";

        img.alt =
            `Foto de ${poem.author}`;

        authorImage.appendChild(img);

    };


    img.onerror = () => {

        authorInitials.style.display =
            "block";

    };


    img.src =
        poem.image;

}



/* =========================================
   SELECIONAR POEMA
========================================= */

function selectPoem(index) {

    currentIndex =
        index;


    const poem =
        poems[index];


    /*
        Atualiza informações
    */

    playerTitle.textContent =
        poem.title;

    playerAuthor.textContent =
        poem.author;


    /*
        Atualiza foto
    */

    setAuthorImage(poem);


    /*
        Para o áudio anterior
    */

    audio.pause();

    audio.currentTime =
        0;


    /*
        Carrega novo áudio
    */

    audio.src =
        poem.audio;


    /*
        Reseta barra
    */

    progress.value =
        0;


    currentTime.textContent =
        "0:00";


    duration.textContent =
        "0:00";


    audioMessage.textContent =
        "";


    /*
        Abre o player
    */

    player.classList.add(
        "open"
    );


    player.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
        Atualiza o card selecionado
    */

    renderList();


    /*
        Carrega o áudio
    */

    audio.load();


    /*
        Tenta iniciar automaticamente
    */

    audio
        .play()
        .then(() => {

            updatePlayButton();

        })
        .catch(() => {

            updatePlayButton();

            audioMessage.textContent =
                "Adicione o arquivo de áudio para reproduzir esta obra.";

        });

}



/* =========================================
   BOTÃO PLAY / PAUSE
========================================= */

function updatePlayButton() {

    if (audio.paused) {

        playPause.textContent =
            "▶";

        playPause.setAttribute(
            "aria-label",
            "Reproduzir"
        );

    } else {

        playPause.textContent =
            "Ⅱ";

        playPause.setAttribute(
            "aria-label",
            "Pausar"
        );

    }

}



/* =========================================
   PLAY / PAUSE
========================================= */

playPause.addEventListener(
    "click",
    async () => {

        /*
            Se nenhum poema foi selecionado
        */

        if (currentIndex < 0) {

            return;

        }


        /*
            Se estiver parado
        */

        if (audio.paused) {

            try {

                await audio.play();

                audioMessage.textContent =
                    "";

            }

            catch {

                audioMessage.textContent =
                    "Áudio não encontrado.";

            }

        }

        /*
            Se estiver tocando
        */

        else {

            audio.pause();

        }


        updatePlayButton();

    }
);



/* =========================================
   FECHAR PLAYER
========================================= */

document
    .getElementById("closePlayer")
    .addEventListener(
        "click",
        () => {

            audio.pause();

            player.classList.remove(
                "open"
            );

            player.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );



/* =========================================
   POEMA ANTERIOR
========================================= */

document
    .getElementById("previous")
    .addEventListener(
        "click",
        () => {

            if (!poems.length) {

                return;

            }


            const previousIndex =
                (
                    currentIndex -
                    1 +
                    poems.length
                )
                %
                poems.length;


            selectPoem(
                previousIndex
            );

        }
    );



/* =========================================
   PRÓXIMO POEMA
========================================= */

document
    .getElementById("next")
    .addEventListener(
        "click",
        () => {

            if (!poems.length) {

                return;

            }


            const nextIndex =
                (
                    currentIndex +
                    1
                )
                %
                poems.length;


            selectPoem(
                nextIndex
            );

        }
    );



/* =========================================
   QUANDO O ÁUDIO CARREGAR
========================================= */

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);



/* =========================================
   ATUALIZAÇÃO DO ÁUDIO
========================================= */

audio.addEventListener(
    "timeupdate",
    () => {

        /*
            Atualiza barra
        */

        if (audio.duration) {

            progress.value =
                (
                    audio.currentTime /
                    audio.duration
                )
                *
                100;

        }


        /*
            Atualiza tempo
        */

        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

    }
);



/* =========================================
   QUANDO COMEÇAR
========================================= */

audio.addEventListener(
    "play",
    () => {

        updatePlayButton();

    }
);



/* =========================================
   QUANDO PAUSAR
========================================= */

audio.addEventListener(
    "pause",
    () => {

        updatePlayButton();

    }
);



/* =========================================
   QUANDO TERMINAR
========================================= */

audio.addEventListener(
    "ended",
    () => {

        updatePlayButton();


        /*
            Passa automaticamente
            para o próximo poema
        */

        if (
            currentIndex <
            poems.length - 1
        ) {

            selectPoem(
                currentIndex + 1
            );

        }

    }
);



/* =========================================
   ARRASTAR BARRA DO ÁUDIO
========================================= */

progress.addEventListener(
    "input",
    () => {

        if (audio.duration) {

            audio.currentTime =
                (
                    Number(
                        progress.value
                    )
                    /
                    100
                )
                *
                audio.duration;

        }

    }
);



/* =========================================
   INICIAR SITE
========================================= */

renderList();

/* =========================================
   INSTALAR COMO APLICATIVO
========================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {

                console.log(
                    "Aplicativo preparado para funcionar offline."
                );

            })
            .catch(error => {

                console.error(
                    "Erro ao registrar o aplicativo:",
                    error
                );

            });

    });

}
