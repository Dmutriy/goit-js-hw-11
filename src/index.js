import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { initNotiflix } from './js/initNotiflix';

import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoCardsTpl from './templates/photo-cards.hbs';

import imageApiService from './js/pixabayAPI';
import { refs } from './js/refs';

const searchImageService = new imageApiService();
const lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
window.addEventListener('scroll', throttle(infiniteScroll, 500));

let bottomReached = false;

async function onSearch(event) {
  event.preventDefault();

  clearGallery();
  const inputValue = event.currentTarget.elements.query.value;
  if (inputValue === '') {
    return;
  }
  searchImageService.query = inputValue;
  searchImageService.resetPage();
  try {
    await searchImageService.fetchImages().then(appendImageGalleryMarkup);
    if (searchImageService.totalHits !== 0) {
      Notify.success(
        `Ура! Ми знайшли ${searchImageService.totalHits} зображень.`,
        initNotiflix
      );
    }
    scrollToTop();
    onSearchHits();
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  if (bottomReached) {
    hideLoading();
    return;
  }
  hideLoading();
  searchImageService.incrementPage();
  await searchImageService.fetchImages().then(appendImageGalleryMarkup);
  onSearchHits();
  lightbox.refresh();
  showLoading();
  if (searchImageService.totalHits <= searchImageService.getFetchElNum()) {
    bottomReached = true;
    Notify.info(
      `Вибачте, але ви досягли кінця пошуку результатів.`,
      initNotiflix
    );
    hideLoading();
    return;
  }
}

function appendImageGalleryMarkup(hits) {
  const markup = photoCardsTpl(hits);
  refs.imgGallery.insertAdjacentHTML('beforeend', markup);
  showLoading();
}

function clearGallery() {
  refs.imgGallery.innerHTML = '';
}

function onSearchHits() {
  if (searchImageService.totalHits === 0) {
    Notify.failure(
      'Вибачте, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз.',
      initNotiflix
    );
    hideLoading();
  }
}

function infiniteScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 1400) {
    onLoadMore();
  }
}

function scrollToTop() {
  const { top: cardTop } = refs.imgGallery.getBoundingClientRect();
  window.scrollBy({
    top: cardTop - 100,
    behavior: 'smooth',
  });
}

function showLoading() {
  refs.loadMoreBtn.classList.remove('is-hidden');
  refs.loadSpinner.classList.remove('is-hidden');
}

function hideLoading() {
  refs.loadMoreBtn.classList.add('is-hidden');
  refs.loadSpinner.classList.add('is-hidden');
}
