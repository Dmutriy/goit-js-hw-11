import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export default function simpleLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    showCounter: true,
    enableKeyboard: true,
    docClose: true,
    scrollZoom: true,
    animationSlide: true,
    maxZoom: 1.5,
  });
  lightbox.refresh();
}
