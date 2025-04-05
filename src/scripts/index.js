
import { createCard } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import {
  getUserInfo,
  getInitialCards,
  editProfile,
  addCard,
  addLike,
  removeLike,
  deleteCard,
  updateAvatar
} from './api.js';

// Валидация
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
enableValidation(validationConfig);

// DOM-элементы
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const placesList = document.querySelector('.places__list');

// Попап "Редактировать профиль"
const editProfileButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const closeEditProfilePopupButton = popupEditProfile.querySelector('.popup__close');
const formEditProfile = popupEditProfile.querySelector('form');
const nameInput = formEditProfile.querySelector('input[name="name"]');
const descriptionInput = formEditProfile.querySelector('input[name="description"]');

// Попап "Новое место"
const addCardButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const closeNewCardPopupButton = popupNewCard.querySelector('.popup__close');
const formNewPlace = popupNewCard.querySelector('form');
const placeNameInput = formNewPlace.querySelector('input[name="place-name"]');
const linkInput = formNewPlace.querySelector('input[name="link"]');

// Попап "Просмотр картинки"
const popupImage = document.querySelector('.popup_type_image');
const closeImagePopupButton = popupImage.querySelector('.popup__close');

// Попап "Обновить аватар"
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');
const popupAvatar = document.querySelector('.popup_type_avatar');
const closeAvatarPopupButton = popupAvatar.querySelector('.popup__close');
const formAvatar = popupAvatar.querySelector('.popup__form');
const avatarLinkInput = formAvatar.querySelector('#avatar-link');

// Переменная для userId
let currentUserId = null;

// Загрузка пользователя и карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    // Заполняем профиль
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url("${userData.avatar}")`;

    cards.forEach((card) => {
      renderCard(card);
    });
  })
  .catch((err) => {
    console.log('Ошибка при загрузке данных:', err);
  });

// Редактирование профиля
function openEditProfilePopup() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);

  // Активируем кнопку сабмита, если форма валидна
  if (formEditProfile.checkValidity()) {
    const button = formEditProfile.querySelector(validationConfig.submitButtonSelector);
    button.classList.remove(validationConfig.inactiveButtonClass);
    button.disabled = false;
  }

  openPopup(popupEditProfile);
}

function closeEditProfilePopup() {
  closePopup(popupEditProfile);
  formEditProfile.reset();
}

function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();
  const buttonSubmit = formEditProfile.querySelector(validationConfig.submitButtonSelector);
  buttonSubmit.textContent = 'Сохранение...';

  editProfile(nameInput.value, descriptionInput.value)
    .then((updatedUser) => {
      profileTitle.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeEditProfilePopup();
    })
    .catch((err) => {
      console.log('Ошибка при редактировании профиля:', err);
    })
    .finally(() => {
      buttonSubmit.textContent = 'Сохранить';
    });
}

editProfileButton.addEventListener('click', openEditProfilePopup);
closeEditProfilePopupButton.addEventListener('click', closeEditProfilePopup);
formEditProfile.addEventListener('submit', handleEditProfileFormSubmit);

// Логика карточек
function handleCardClick(cardData) {
  const popupImageElement = popupImage.querySelector('.popup__image');
  const popupCaption = popupImage.querySelector('.popup__caption');
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(popupImage);
}

/**
 * Удаление карточки с сервера + из DOM
 * @param {HTMLElement} cardElement
 * @param {Object} cardData
 */
function handleDeleteClick(cardElement, cardData) {
  deleteCard(cardData._id)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log('Ошибка при удалении карточки:', err);
    });
}


function handleLikeClick(evt, cardData, cardLikeButton, cardLikeCount) {
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

function renderCard(cardData) {
  const cardElement = createCard(
    cardData,
    currentUserId,
    handleCardClick,
    handleDeleteClick,
    handleLikeClick
  );
  placesList.prepend(cardElement);
}

// Добавление новой карточки
function openNewCardPopup() {
  formNewPlace.reset();
  clearValidation(formNewPlace, validationConfig);
  openPopup(popupNewCard);
}

function closeNewCardPopup() {
  closePopup(popupNewCard);
  formNewPlace.reset();
}

function handleNewPlaceFormSubmit(evt) {
  evt.preventDefault();
  const buttonSubmit = formNewPlace.querySelector(validationConfig.submitButtonSelector);
  buttonSubmit.textContent = 'Сохранение...';

  const newName = placeNameInput.value;
  const newLink = linkInput.value;

  addCard(newName, newLink)
    .then((newCard) => {
      renderCard(newCard);
      closeNewCardPopup();
    })
    .catch((err) => {
      console.log('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      buttonSubmit.textContent = 'Сохранить';
    });
}

addCardButton.addEventListener('click', openNewCardPopup);
closeNewCardPopupButton.addEventListener('click', closeNewCardPopup);
formNewPlace.addEventListener('submit', handleNewPlaceFormSubmit);

// Попап с изображением
function closeImagePopup() {
  closePopup(popupImage);
}
closeImagePopupButton.addEventListener('click', closeImagePopup);

// Закрытие попапов по клику на оверлей
const popups = document.querySelectorAll('.popup');
popups.forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

// Попап "Обновить аватар"
function openAvatarPopup() {
  formAvatar.reset();
  clearValidation(formAvatar, validationConfig);
  openPopup(popupAvatar);
}

function closeAvatarPopup() {
  closePopup(popupAvatar);
  formAvatar.reset();
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = formAvatar.querySelector(validationConfig.submitButtonSelector);
  submitButton.textContent = 'Сохранение...';

  const newAvatarUrl = avatarLinkInput.value;

  updateAvatar(newAvatarUrl)
    .then((userData) => {
      profileImage.style.backgroundImage = `url("${userData.avatar}")`;
      closeAvatarPopup();
    })
    .catch((err) => {
      console.log('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить';
    });
}

avatarEditButton.addEventListener('click', openAvatarPopup);
closeAvatarPopupButton.addEventListener('click', closeAvatarPopup);
formAvatar.addEventListener('submit', handleAvatarFormSubmit);