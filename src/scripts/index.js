import { initialCards } from './cards.js';
import { createCard } from './card.js';
import { openPopup, closePopup } from './modal.js';

// DOM-элементы
const placesList = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Попап «Новое место»
const addCardButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const closeNewCardPopupButton = popupNewCard.querySelector('.popup__close');
const formNewPlace = popupNewCard.querySelector('form');
const placeNameInput = formNewPlace.querySelector('input[name="place-name"]');
const linkInput = formNewPlace.querySelector('input[name="link"]');

// Попап «Редактировать профиль»
const editProfileButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const closeEditProfilePopupButton = popupEditProfile.querySelector('.popup__close');
const formEditProfile = popupEditProfile.querySelector('form');
const nameInput = formEditProfile.querySelector('input[name="name"]');
const descriptionInput = formEditProfile.querySelector('input[name="description"]');

// Попап с картинкой
const popupImage = document.querySelector('.popup_type_image');
const closeImagePopupButton = popupImage.querySelector('.popup__close');

function handleCardClick(cardData) {
  const popupImageElement = popupImage.querySelector('.popup__image');
  const popupCaption = popupImage.querySelector('.popup__caption');
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(popupImage);
}

function handleDeleteClick(cardElement) {
  cardElement.remove();
}

function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

function renderCard(cardData) {
  const cardElement = createCard(cardData, handleCardClick, handleDeleteClick, handleLikeClick);
  placesList.prepend(cardElement);
}

initialCards.forEach(renderCard);

function openNewCardPopup() {
  openPopup(popupNewCard);
}

function closeNewCardPopup() {
  closePopup(popupNewCard);
}

function handleNewPlaceFormSubmit(evt) {
  evt.preventDefault();
  const newCardData = { name: placeNameInput.value, link: linkInput.value };
  renderCard(newCardData);
  closeNewCardPopup();
  formNewPlace.reset();
}

addCardButton.addEventListener('click', openNewCardPopup);
closeNewCardPopupButton.addEventListener('click', closeNewCardPopup);
formNewPlace.addEventListener('submit', handleNewPlaceFormSubmit);

function openEditProfilePopup() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openPopup(popupEditProfile);
}

function closeEditProfilePopup() {
  closePopup(popupEditProfile);
}

function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();
  const updatedProfileData = {
    name: nameInput.value || nameInput.placeholder,
    description: descriptionInput.value || descriptionInput.placeholder
  };
  profileTitle.textContent = updatedProfileData.name;
  profileDescription.textContent = updatedProfileData.description;
  closeEditProfilePopup();
  formEditProfile.reset();
}

editProfileButton.addEventListener('click', openEditProfilePopup);
closeEditProfilePopupButton.addEventListener('click', closeEditProfilePopup);
formEditProfile.addEventListener('submit', handleEditProfileFormSubmit);

function closeImagePopup() {
  closePopup(popupImage);
}
closeImagePopupButton.addEventListener('click', closeImagePopup);

const popups = document.querySelectorAll('.popup');
popups.forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});