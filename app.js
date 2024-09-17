const animeListContainer = document.querySelector('.anime-list');
const searchForm = document.querySelector('.nav-search form');
const searchInput = document.querySelector('input[name="value"]');

async function fetchAnimeData(query = '') {
    try {
        const url = query ?
            `https://api.jikan.moe/v4/anime?q=${query}&limit=20` :
            'https://api.jikan.moe/v4/top/anime?limit=20';

        const response = await axios.get(url);
        const animeList = response.data.data;

        animeListContainer.innerHTML = '';

        animeList.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');

            const animeImage = document.createElement('img');
            animeImage.src = anime.images.jpg.image_url;
            animeImage.alt = `Image of ${anime.title}`;
            animeImage.classList.add('img-anime');

            const cardDesk = document.createElement('div');
            cardDesk.classList.add('card-desk');

            const animeTitle = document.createElement('h4');
            animeTitle.textContent = anime.title;

            const animeGenres = document.createElement('p');
            const genreNames = anime.genres.map(genre => genre.name).join(', ');

            const genreSpan = document.createElement('span');
            genreSpan.textContent = genreNames;
            animeGenres.appendChild(genreSpan);

            const episodeCount = document.createElement('p');
            episodeCount.textContent = `Episode ${anime.episodes || 'N/A'}`;

            const onGoing = document.createElement('div');
            onGoing.classList.add('on-going');
            const day = document.createElement('p');
            day.textContent = anime.airing ? 'On Air' : 'Finished';
            onGoing.appendChild(day);

            const starIcon = document.createElement('span');
            starIcon.classList.add('material-symbols-outlined', 'card-icon');
            starIcon.textContent = 'star';

            cardDesk.appendChild(animeTitle);
            cardDesk.appendChild(animeGenres);
            cardDesk.appendChild(episodeCount);

            animeCard.appendChild(animeImage);
            animeCard.appendChild(cardDesk);
            animeCard.appendChild(onGoing);
            animeCard.appendChild(starIcon);

            animeListContainer.appendChild(animeCard);
        });
    } catch (error) {
        console.error('Error fetching anime data:', error);
        animeListContainer.innerHTML = '<p>Failed to load anime list.</p>';
    }
}

fetchAnimeData();

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        await fetchAnimeData(query);
    } else {
        await fetchAnimeData(); //
    }
});

// Fetch Genre List
async function fetchGenres() {
    try {
        const response = await axios.get('https://api.jikan.moe/v4/genres/anime');
        const genreList = response.data.data;
        const genreContainer = document.querySelector('.genre-list');
        genreContainer.innerHTML = '';

        genreList.forEach(genre => {
            const genreItem = document.createElement('a');
            genreItem.href = '#'; // 
            genreItem.textContent = genre.name;
            genreContainer.appendChild(genreItem);
        });
    } catch (error) {
        console.error('Error fetching genre list:', error);
    }
}

fetchGenres();

async function fetchSchedule() {
    try {
        const response = await axios.get('https://api.jikan.moe/v4/schedules');
        const schedule = response.data.data; // Anime airing schedule

        const scheduleContainer = document.querySelector('.schedule-list');
        scheduleContainer.innerHTML = ''; // Clear existing content

        schedule.forEach(anime => {
            const animeItem = document.createElement('div');
            animeItem.classList.add('schedule-item');
            animeItem.innerHTML = `
                <h4>${anime.title}</h4>
                <p>Episode ${anime.episodes || 'N/A'}</p>
                <p>Airing on: ${anime.broadcast.day || 'Unknown'}</p>
            `;
            scheduleContainer.appendChild(animeItem);
        });
    } catch (error) {
        console.error('Error fetching anime schedule:', error);
    }
}

fetchSchedule();