import axios from 'axios';

export default class imageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalHits = 0;
  }

  async fetchImages() {
    const KEY_API = '30736831-5d9a33b1aa7d5f5197006ba7d';
    const URL_API = 'https://pixabay.com/api/';
    const parametrs = new URLSearchParams({
      key: KEY_API,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: this.perPage,
      page: this.page,
    });
    const url = `${URL_API}?${parametrs}`;
    this.incrementPage();
    const response = await axios.get(url);
    this.totalHits = response.data.totalHits;
    if (!response.data.hits) {
      throw new Error('Error');
    }
    return response.data.hits;
  }

  getFetchElNum() {
    return this.perPage * this.page;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
    this.resetPage();
  }
}
