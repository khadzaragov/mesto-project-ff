
import { deleteCard, addLike, removeLike } from './api.js';

/**
 * Обработчик удаления карточки
 * @param {HTMLElement} cardElement
 * @param {Object} cardData
 */
export function handleDeleteCard(cardElement, cardData) {
  deleteCard(cardData._id)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log('Ошибка при удалении карточки:', err);
    });
}

/**
 * Обработчик клика по лайку
 * @param {Object} cardData
 * @param {HTMLElement} cardLikeButton
 * @param {HTMLElement} cardLikeCount
 */
export function handleLikeCard(cardData, cardLikeButton, cardLikeCount) {
  const isLiked = cardLikeButton.classList.contains('card__like-button_is-active');
  
  if (!isLiked) {
    addLike(cardData._id)
      .then((updatedCard) => {
        cardLikeButton.classList.add('card__like-button_is-active');
        cardLikeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log('Ошибка при постановке лайка:', err);
      });
  } else {
    removeLike(cardData._id)
      .then((updatedCard) => {
        cardLikeButton.classList.remove('card__like-button_is-active');
        cardLikeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log('Ошибка при снятии лайка:', err);
      });
  }
}

/**
 * @param {Object}   cardData
 * @param {String}   userId
 * @param {Function} handleCardClick   
 * @param {Function} handleDeleteCard
 * @param {Function} handleLikeCard
 * @returns {HTMLElement}
 */
export function createCard(cardData, userId, handleCardClick, handleDeleteCard, handleLikeCard) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardLikeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Начальное количество лайков
  const likesArray = cardData.likes || [];
  cardLikeCount.textContent = likesArray.length;

  if (cardData.owner && cardData.owner._id !== userId) {
    cardDeleteButton.style.display = 'none';
  }

  // Проверяем, лайкнута ли уже
  const isLikedByMe = likesArray.some((likeUser) => likeUser._id === userId);
  if (isLikedByMe) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  // Открыть попап
  cardImage.addEventListener('click', () => {
    handleCardClick(cardData);
  });

  // Вызвать колбэк удаления
  cardDeleteButton.addEventListener('click', () => {
    handleDeleteCard(cardElement, cardData);
  });

  // Вызвать колбэк лайка
  cardLikeButton.addEventListener('click', () => {
    handleLikeCard(cardData, cardLikeButton, cardLikeCount);
  });

  return cardElement;
}