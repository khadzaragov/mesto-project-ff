const cardTemplate = document.querySelector('#card-template');

/**
 * Создаём карточку
 * @param {Object} cardData - данные карточки
 * @param {String} userId - _id пользователя
 * @param {Function} handleCardClick - колбэк для клика по картинке
 * @param {Function} handleDeleteClick - колбэк для удаления карточки
 * @param {Function} handleLikeClick - колбэк для постановки лайка
 * @returns {HTMLElement} cardElement - DOM-элемент карточки
 */

export function createCard(cardData, userId, handleCardClick, handleDeleteClick, handleLikeClick) {
  // Клонируем содержимое template
  const cardClone = cardTemplate.content.cloneNode(true);
  const cardElement = cardClone.querySelector('.card');

  // Основные элементы
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardLikeCount = cardElement.querySelector('.card__like-count');

  // Заполняем данные
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Массив лайкнувших пользователей
  const likesArray = cardData.likes || [];
  cardLikeCount.textContent = likesArray.length;

  // Если карточка не принадлежит пользователю, скрываем кнопку удаления
  if (cardData.owner && cardData.owner._id !== userId) {
    cardDeleteButton.style.display = 'none';
  }

  // Проверяем, лайкнута ли карточка
  const isLikedByMe = likesArray.some((likeUser) => likeUser._id === userId);
  if (isLikedByMe) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  // Слушатель на удаление карточки
  cardDeleteButton.addEventListener('click', () => {
    handleDeleteClick(cardElement, cardData);
  });

  // Открытие картинки в попапе
  cardImage.addEventListener('click', () => {
    handleCardClick(cardData);
  });

  // Лайк
  cardLikeButton.addEventListener('click', (evt) => {
    handleLikeClick(evt, cardData, cardLikeButton, cardLikeCount);
  });

  return cardElement;
}
