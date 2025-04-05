
import { addLike, removeLike, deleteCard } from './api.js';

/**
 * Создаём карточку.
 * @param {Object} cardData - объект (name, link, likes, owner и т.д.)
 * @param {String} userId - _id текущего пользователя
 * @param {Function} handleCardClick - колбэк для клика по картинке (открытие полноразмерного фото)
 * @returns {HTMLElement} DOM-элемент карточки
 */
export function createCard(cardData, userId, handleCardClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  // Находим элементы
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardLikeCount = cardElement.querySelector('.card__like-count');

  // Заполняем данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Количество лайков
  const likesArray = cardData.likes || [];
  cardLikeCount.textContent = likesArray.length;

  // Если карточка не принадлежит пользователю, скрываем кнопку
  if (cardData.owner && cardData.owner._id !== userId) {
    cardDeleteButton.style.display = 'none';
  }

  // Проверяем, лайкнута ли карточка
  const isLikedByMe = likesArray.some((likeUser) => likeUser._id === userId);
  if (isLikedByMe) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  // Клик по картинке
  cardImage.addEventListener('click', () => {
    handleCardClick(cardData);
  });

  // Клик по кнопке удаления
  cardDeleteButton.addEventListener('click', () => {
    deleteCard(cardData._id)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.log('Ошибка при удалении карточки:', err);
      });
  });

  // Клик по лайку
  cardLikeButton.addEventListener('click', () => {
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
  });

  return cardElement;
}