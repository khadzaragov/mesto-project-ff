import { initialCards } from './cards.js';
import { createCard } from './card.js';
import { openPopup, closePopup } from './modal.js';

// Список, куда будем добавлять карточки
const placesList = document.querySelector('.places__list');

// Элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Попап «Новое место»
const addButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupCloseButton = popupNewCard.querySelector('.popup__close');
const formNewPlace = popupNewCard.querySelector('form');
const placeNameInput = formNewPlace.querySelector('input[name="place-name"]');
const linkInput = formNewPlace.querySelector('input[name="link"]');

// Попап «Редактировать профиль»
const editButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const popupEditCloseButton = popupEditProfile.querySelector('.popup__close');
const formEditProfile = popupEditProfile.querySelector('form');
const nameInput = formEditProfile.querySelector('input[name="name"]');
const descriptionInput = formEditProfile.querySelector('input[name="description"]');

// --------------------- Рендер карточек ---------------------
function renderCard(cardData) {
  const cardElement = createCard(cardData);
  placesList.append(cardElement);
}

// При загрузке страницы — отрисовать все «initialCards»
initialCards.forEach(renderCard);

// --------------------- Попап «Новое место» ---------------------
// Открытие
addButton.addEventListener('click', () => {
  openPopup(popupNewCard);
});

// Закрытие
popupCloseButton.addEventListener('click', () => {
  closePopup(popupNewCard);
});

// Добавление новой карточки
formNewPlace.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCardData = {
    name: placeNameInput.value,
    link: linkInput.value,
  };

  renderCard(newCardData);

  closePopup(popupNewCard);
  formNewPlace.reset();
});

// --------------------- Попап «Редактировать профиль» ---------------------
// Открытие
editButton.addEventListener('click', () => {
  // Подставить текущие значения в инпуты
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openPopup(popupEditProfile);
});

// Закрытие
popupEditCloseButton.addEventListener('click', () => {
  closePopup(popupEditProfile);
});

// Сохранение изменений профиля
formEditProfile.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const updatedProfileData = {
    name: nameInput.value || nameInput.placeholder,
    description: descriptionInput.value || descriptionInput.placeholder,
  };

  profileTitle.textContent = updatedProfileData.name;
  profileDescription.textContent = updatedProfileData.description;

  closePopup(popupEditProfile);
  formEditProfile.reset();
});
