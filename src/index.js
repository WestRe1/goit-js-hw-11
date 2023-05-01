import './css/style.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const btnLoadMoreRef = document.querySelector('.load-more');
const guard = document.querySelector('.js-guard');

const API_KEY = '35940270-7e869872595346a1578cf7fe2';
const BASE_URL = 'https://pixabay.com/api/';
let inputValue = '';
let simpleLightBox = new SimpleLightbox('.gallery a');
let page = 1;

const optionsObserver = {
  root: null,
  rootMargin: '500px',
  threshold: 0,
};

formRef.addEventListener('submit', onSubmit);
const observer = new IntersectionObserver(onPagination, optionsObserver);

async function onSubmit(evt) {
  evt.preventDefault();
  galleryRef.innerHTML = '';
  inputValue = evt.target.elements.searchQuery.value.trim();
  const responses = await queryFetch(inputValue);
  const totalHits = responses.totalHits;

  if (responses.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    galleryRef.innerHTML = createCards(responses.hits);
  }

  if (responses.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else
    galleryRef.insertAdjacentHTML('beforeend', createCards(responses.hits));

  simpleLightBox.refresh();
  evt.target.reset();
}

async function queryFetch(name) {
  try {
    const query = `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    const response = await axios.get(query);
    const filteredResponse = response.data;
    page += 1;
    return filteredResponse;
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function onPagination(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      const result = await queryFetch(inputValue);
      page += 1;
      console.log(page);
      if (result.hits.length < 40) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }

      galleryRef.insertAdjacentHTML('beforeend', createCards(result));
      simpleLightBox.refresh();
    }
  });
}

function createCards(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}" class="gallery-link">
  <img src="${webformatURL}" alt="${tags}"  loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
    ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </a>
</div>`;
      }
    )
    .join('');
}
