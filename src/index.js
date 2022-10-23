import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { initNotiflix } from './js/initNotiflix';

import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayAPI from './js/pixabayAPI';
import createCard from './js/cardMarkup';
import { refs } from './js/refs';
import { spinnerPlay, spinnerStop } from './js/spinner';

const pixabay = new PixabayAPI();

const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting && entry.intersectionRect.bottom > 550) {
      pixabay.incrementPage();
      observer.unobserve(entry.target);

      try {
        spinnerPlay();
        const { hits, totalHits } = await pixabay.getPhotos();
        createCard(hits);
        pixabay.totalPages(totalHits);

        if (pixabay.isShowLoadMore) {
          const target = document.querySelector('.photo-card:last-child');
          io.observe(target);
        }
      } catch (error) {
        Notify.failure(
          error.message,
          'Вибачте, щось пішло не так. Будь ласка спробуйте ще раз!',
          initNotiflix
        );
        clearPage();
      } finally {
        spinnerStop();
      }
    }
  });
};

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const io = new IntersectionObserver(callback, options);

const onSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return Notify.failure(
      'Ой, ви повинні ввести щось для пошуку...',
      initNotiflix
    );
  }

  pixabay.query = query;
  clearPage();

  try {
    spinnerPlay();
    const { hits, totalHits } = await pixabay.getPhotos();
    if (hits.length === 0) {
      return Notify.failure(
        'Вибачте, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз.',
        initNotiflix
      );
    }
    Notify.success(
      `Ура! Ми знайшли ${totalHits} зображень за запитом "${query}".`,
      initNotiflix
    );
    createCard(hits);
    pixabay.calculateTotalPages(totalHits);
    if (pixabay.isShowLoadMore) {
      const target = document.querySelector('.photo-card:last-child');
      io.observe(target);
    }
  } catch (error) {
    Notify.failure(
      error.message,
      'Вибачте, тут щось пішло не так. Будь ласка спробуйте ще раз!',
      initNotiflix
    );
    clearPage();
  } finally {
    spinnerStop();
  }
};

refs.form.addEventListener('submit', onSubmit);

function clearPage() {
  pixabay.resetPage();
  refs.list.innerHTML = '';
}
