
import {
  createCard,
  handleDeleteCard,
  handleLikeCard
} from './card.js';
import {
  openPopup,
  closePopup
} from './modal.js';
import {
  enableValidation,
  clearValidation
} from './validation.js';
import {
  getUserInfo,
  getInitialCards,
  editProfile,
  addCard,
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

// Попап Редактировать профиль
const editProfileButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const closeEditProfilePopupButton = popupEditProfile.querySelector('.popup__close');
const formEditProfile = popupEditProfile.querySelector('form');
const nameInput = formEditProfile.querySelector('input[name="name"]');
const descriptionInput = formEditProfile.querySelector('input[name="description"]');

// Попап Новое место
const addCardButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const closeNewCardPopupButton = popupNewCard.querySelector('.popup__close');
const formNewPlace = popupNewCard.querySelector('form');
const placeNameInput = formNewPlace.querySelector('input[name="place-name"]');
const linkInput = formNewPlace.querySelector('input[name="link"]');

// Попап Просмотр картинки
const popupImage = document.querySelector('.popup_type_image');
const closeImagePopupButton = popupImage.querySelector('.popup__close');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaptionElement = popupImage.querySelector('.popup__caption');

// Попап Обновить аватар
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');
const popupAvatar = document.querySelector('.popup_type_avatar');
const closeAvatarPopupButton = popupAvatar.querySelector('.popup__close');
const formAvatar = popupAvatar.querySelector('.popup__form');
const avatarLinkInput = formAvatar.querySelector('#avatar-link');

// Глобальная переменная
let currentUserId = null;

// Загрузка пользователя
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url("${userData.avatar}")`;

    // Отрисовываем карточки
    cards.forEach((cardData) => {
      renderCard(cardData);
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
  const submitButton = formEditProfile.querySelector(validationConfig.submitButtonSelector);
  submitButton.textContent = 'Сохранение...';

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
      submitButton.textContent = 'Сохранить';
    });
}

editProfileButton.addEventListener('click', openEditProfilePopup);
closeEditProfilePopupButton.addEventListener('click', closeEditProfilePopup);
formEditProfile.addEventListener('submit', handleEditProfileFormSubmit);

// Открытие картинки
function handleCardClick(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaptionElement.textContent = cardData.name;
  openPopup(popupImage);
}

// Рендер карточки
function renderCard(cardData) {
  const cardElement = createCard(
    cardData,
    currentUserId,
    handleCardClick,
    handleDeleteCard,
    handleLikeCard
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
  const submitButton = formNewPlace.querySelector(validationConfig.submitButtonSelector);
  submitButton.textContent = 'Сохранение...';

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
      submitButton.textContent = 'Сохранить';
    });
}

addCardButton.addEventListener('click', openNewCardPopup);
closeNewCardPopupButton.addEventListener('click', closeNewCardPopup);
formNewPlace.addEventListener('submit', handleNewPlaceFormSubmit);

// Закрытие попапа с изображением
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

// Обновление аватара
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