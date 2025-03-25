// Находим попап с картинкой (для его открытия из card.js)
export const popupImage = document.querySelector('.popup_type_image');
export const popupImageElement = popupImage.querySelector('.popup__image');
export const popupCaption = popupImage.querySelector('.popup__caption');

// Универсальная функция открытия
export function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

// Универсальная функция закрытия
export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

// Закрытие по клику на оверлей (один раз для всех попапов)
const popups = document.querySelectorAll('.popup');
popups.forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    // Если клик именно по самому попапу (а не по содержимому), значит по фону
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

// Закрытие по клавише Esc
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}
