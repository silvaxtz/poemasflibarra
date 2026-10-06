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

document.addEventListener("DOMContentLoaded", () => {

    const home = document.getElementById("home");
    const library = document.getElementById("library");
    const enterButton = document.getElementById("enterButton");
    const backHome = document.getElementById("backHome");

    const list = document.getElementById("poemList");
    const count = document.getElementById("poemCount");

    const player = document.getElementById("player");
    const audio = document.getElementById("audio");

    const progress = document.getElementById("progress");
    const playPause = document.getElementById("playPause");

    const currentTime = document.getElementById("currentTime");
    const duration = document.getElementById("duration");

    const playerTitle = document.getElementById("playerTitle");
    const playerAuthor = document.getElementById("playerAuthor");

    const authorImage = document.getElementById("authorImage");
    const authorInitials = document.getElementById("authorInitials");

    const audioMessage = document.getElementById("audioMessage");

    let currentIndex = -1;


    /* =========================
       ENTRAR PELO LOGO
    ========================= */

    enterButton.addEventListener("click", function () {

        console.log("Logo clicada");

        home.classList.add("hidden");

        setTimeout(() => {
            library.classList.add("visible");
        }, 180);

    });


    /* =========================
       VOLTAR PARA HOME
    ========================= */

    backHome.addEventListener("click", function () {

        audio.pause();

        player.classList.remove("open");
        player.setAttribute("aria-hidden", "true");

        library.classList.remove("visible");

        setTimeout(() => {
            home.classList.remove("hidden");
        }, 180);

    });


    /* =========================
       CONTADOR
    ========================= */

    count.textContent =
        String(poems.length).padStart(2, "0");


    /* =========================
       INICIAIS DO AUTOR
    ========================= */

    function initials(name) {

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0])
            .join("")
            .toUpperCase();

    }


    /* =========================
       TEMPO
    ========================= */

    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const minutes =
            Math.floor(seconds / 60);

        const secs =
            Math.floor(seconds % 60)
                .toString()
                .padStart(2, "0");

        return `${minutes}:${secs}`;

    }


    /* =========================
       LISTA DE OBRAS
    ========================= */

    function renderList() {

        list.innerHTML =
            poems.map((poem, index) => {

                return `
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
                            <img
                                src="play.svg"
                                alt="Reproduzir"
                            >
                        </span>

                    </button>
                `;

            }).join("");


        list.querySelectorAll(".poem-card")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(card.dataset.index);

                        selectPoem(index);

                    }
                );

            });

    }


    /* =========================
       FOTO DO AUTOR
    ========================= */

    function setAuthorImage(poem) {

        authorInitials.textContent =
            initials(poem.author);

        authorInitials.style.display =
            "block";

        const oldImage =
            authorImage.querySelector("img");

        if (oldImage) {
            oldImage.remove();
        }

        const img = new Image();

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

        img.src = poem.image;

    }


    /* =========================
       SELECIONAR OBRA
    ========================= */

    function selectPoem(index) {

        if (
            index < 0 ||
            index >= poems.length
        ) {
            return;
        }

        currentIndex = index;

        const poem = poems[index];

        playerTitle.textContent =
            poem.title;

        playerAuthor.textContent =
            poem.author;

        setAuthorImage(poem);

        audio.pause();

        audio.currentTime = 0;

        audio.src = poem.audio;

        progress.value = 0;

        currentTime.textContent =
            "0:00";

        duration.textContent =
            "0:00";

        audioMessage.textContent =
            "";

        player.classList.add("open");

        player.setAttribute(
            "aria-hidden",
            "false"
        );

        renderList();

        audio.load();

        audio.play()
            .then(() => {
                updatePlayButton();
            })
            .catch(() => {

                updatePlayButton();

                audioMessage.textContent =
                    "Áudio não encontrado. Adicione o arquivo desta obra.";

            });

    }


    /* =========================
       ÍCONE DE PLAY
    ========================= */

    playPause.innerHTML = `
        <img
            src="play.svg"
            alt="Reproduzir"
            class="shared-play-icon"
        >
    `;


    /* =========================
       BOTÃO PLAY / PAUSE
    ========================= */

    function updatePlayButton() {

        if (audio.paused) {

            playPause.classList.remove(
                "is-playing"
            );

            playPause.setAttribute(
                "aria-label",
                "Reproduzir"
            );

        } else {

            playPause.classList.add(
                "is-playing"
            );

            playPause.setAttribute(
                "aria-label",
                "Pausar"
            );

        }

    }


    playPause.addEventListener(
        "click",
        async () => {

            if (currentIndex < 0) {
                return;
            }

            if (audio.paused) {

                try {

                    await audio.play();

                    audioMessage.textContent =
                        "";

                } catch {

                    audioMessage.textContent =
                        "Áudio não encontrado.";

                }

            } else {

                audio.pause();

            }

            updatePlayButton();

        }
    );


    /* =========================
       FECHAR PLAYER
    ========================= */

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


    /* =========================
       OBRA ANTERIOR
    ========================= */

    document
        .getElementById("previous")
        .addEventListener(
            "click",
            () => {

                if (!poems.length) {
                    return;
                }

                const index =
                    (
                        currentIndex -
                        1 +
                        poems.length
                    ) %
                    poems.length;

                selectPoem(index);

            }
        );


    /* =========================
       PRÓXIMA OBRA
    ========================= */

    document
        .getElementById("next")
        .addEventListener(
            "click",
            () => {

                if (!poems.length) {
                    return;
                }

                const index =
                    (
                        currentIndex +
                        1
                    ) %
                    poems.length;

                selectPoem(index);

            }
        );


    /* =========================
       ÁUDIO
    ========================= */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            duration.textContent =
                formatTime(audio.duration);

        }
    );


    audio.addEventListener(
        "timeupdate",
        () => {

            if (audio.duration) {

                progress.value =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;

            }

            currentTime.textContent =
                formatTime(
                    audio.currentTime
                );

        }
    );


    audio.addEventListener(
        "play",
        updatePlayButton
    );


    audio.addEventListener(
        "pause",
        updatePlayButton
    );


    audio.addEventListener(
        "ended",
        () => {

            updatePlayButton();

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


    progress.addEventListener(
        "input",
        () => {

            if (audio.duration) {

                audio.currentTime =
                    (
                        Number(
                            progress.value
                        ) / 100
                    ) *
                    audio.duration;

            }

        }
    );


    /* =========================
       INICIA A LISTA
    ========================= */

    renderList();


    /* =========================
       SERVICE WORKER
    ========================= */

    if ("serviceWorker" in navigator) {

        window.addEventListener(
            "load",
            () => {

                navigator.serviceWorker
                    .register(
                        "./service-worker.js"
                    )
                    .then(() => {

                        console.log(
                            "Service Worker ativo"
                        );

                    })
                    .catch(error => {

                        console.error(
                            "Erro no Service Worker:",
                            error
                        );

                    });

            }
        );

    }

});
