import { openPopup, popupImage, popupImageElement, popupCaption } from './modal.js';

// Шаблон можно получить один раз: он есть в index.html с id="card-template"
const cardTemplate = document.getElementById('card-template'); 
// Или: document.querySelector('#card-template')

export function createCard(cardData) {
  // Клонируем шаблон карточки
  const cardClone = cardTemplate.content.cloneNode(true);

  // Получаем элементы карточки из шаблона
  const cardElement = cardClone.querySelector('.card');
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Удаление карточки
  cardDeleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  // Открытие изображения в поп-апе при клике
  cardImage.addEventListener('click', () => {
    popupImageElement.src = cardData.link;
    popupImageElement.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openPopup(popupImage);
  });

  // Лайк
  cardLikeButton.addEventListener('click', () => {
    cardLikeButton.classList.toggle('card__like-button_is-active');
  });

  // Возвращаем готовую карточку
  return cardElement;
}
