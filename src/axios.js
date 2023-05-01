const list = document.querySelector('.js-list');
const guard = document.querySelector('.js-guard');
// const guard2 = document.querySelector('.js-guard2')
const BASE_URL = 'https://api.themoviedb.org/3';
const ENDPOINT = '/trending/movie/week';
const API_KEY = '345007f9ab440e5b86cef51be6397df1';
const options = {
  root: null,
  rootMargin: '1900px',
  threshold: 0,
};

const observer = new IntersectionObserver(onPagination, options);
let currentPage = 998;

// observer.observe(guard2)

function getTrending(page = 1) {
  return fetch(`${BASE_URL}${ENDPOINT}?api_key=${API_KEY}&page=${page}`).then(
    resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      return resp.json();
    }
  );
}

getTrending()
  .then(data => {
    list.insertAdjacentHTML('beforeend', createMarkup(data.results));
    if (data.page !== data.total_pages) {
      observer.observe(guard);
    }
  })
  .catch(err => console.log(err));

function createMarkup(arr) {
  return arr
    .map(
      ({ poster_path, title, vote_average }) => `<li>
      <img src="${
        poster_path
          ? 'https://image.tmdb.org/t/p/w400' + poster_path // "https://image.tmdb.org/t/p/w400null"
          : 'https://www.reelviews.net/resources/img/default_poster.jpg'
      }" width="400" alt="${title}">
      <p>${vote_average || 'Not found'}</p>
      <h2>${title || 'No name'}</h2>
  </li>`
    )
    .join('');
}

function onPagination(entries, observer) {
  // console.log(entries);
  entries.forEach(entry => {
    console.log(entry);
    if (entry.isIntersecting) {
      currentPage += 1;
      getTrending(currentPage).then(data => {
        list.insertAdjacentHTML('beforeend', createMarkup(data.results));
        if (data.page === data.total_pages) {
          observer.unobserve(guard);
        }
      });
    }
  });
}

function onPagination(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      const result = await queryFetch(inputValue);

      if (result.hits.length < 40) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }

      galleryRef.insertAdjacentHTML('beforeend', createMarkup(result));
      let simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    }
  });
}
