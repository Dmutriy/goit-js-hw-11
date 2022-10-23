import lightbox from './lightbox';
import CardTpl from '../templates/photo-cards.hbs';
import { refs } from './refs';

export default function createCard(r) {
  const card = r.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) =>
      CardTpl({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      })
  );

  refs.list.insertAdjacentHTML('beforeend', card.join(''));

  return lightbox();
}
