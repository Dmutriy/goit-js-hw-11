import axios from 'axios';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { initNotiflix } from './initNotiflix';

axios.defaults.baseURL = ' https://pixabay.com/api/';

// Pagination and HTTP requests
export default class PixabayAPI {
  #query = '';
  #page = 1;
  #totalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      key: '30736831-5d9a33b1aa7d5f5197006ba7d',
      orientation: 'horizontal',
      image_type: 'photo',
      safesearch: 'true',
      per_page: 40,
    },
  };

  async getPhotos() {
    const urlAXIOS = `?q=${this.#query}&page=${this.#page}`;
    const { data } = await axios.get(urlAXIOS, this.#params);
    return data;
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }

  totalPages(totalHits) {
    const pageAmount = totalHits / this.#perPage - this.#page;
    if (pageAmount < 0) {
      return Notify.info(
        'Вибачте, але ви досягли кінця результатів пошуку.',
        initNotiflix
      );
    }
  }
}
