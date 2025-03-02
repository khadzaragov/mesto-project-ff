// @todo: DOM узлы
const placesList = document.querySelector('.places__list'); // Список мест
const cardTemplate = document.getElementById('card-template'); // Шаблон карточки

// @todo: Получаем элементы для кнопки и поп-апа
const addButton = document.querySelector('.profile__add-button'); // Кнопка добавления
const popupNewCard = document.querySelector('.popup_type_new-card'); // Поп-ап для нового места
const popupCloseButton = popupNewCard.querySelector('.popup__close'); // Кнопка закрытия поп-апа для нового места
const popupImage = document.querySelector('.popup_type_image'); // Поп-ап для изображения
const popupImageElement = popupImage.querySelector('.popup__image'); // Элемент изображения в поп-апе
const popupCaption = popupImage.querySelector('.popup__caption'); // Элемент подписи к изображению

// @todo: Получаем элементы для поп-апа редактирования профиля
const editButton = document.querySelector('.profile__edit-button'); // Кнопка редактирования профиля
const popupEditProfile = document.querySelector('.popup_type_edit'); // Поп-ап редактирования профиля
const popupEditCloseButton = popupEditProfile.querySelector('.popup__close'); // Кнопка закрытия поп-апа редактирования профиля

// @todo: Получаем форму для редактирования профиля
const formEditProfile = popupEditProfile.querySelector('form'); // Форма для редактирования профиля
const nameInput = formEditProfile.querySelector('input[name="name"]'); // Поле для имени
const descriptionInput = formEditProfile.querySelector('input[name="description"]'); // Поле для описания

// @todo: Получаем форму для добавления нового места
const formNewPlace = popupNewCard.querySelector('form'); // Форма для нового места
const placeNameInput = formNewPlace.querySelector('input[name="place-name"]'); // Поле для названия места
const linkInput = formNewPlace.querySelector('input[name="link"]'); // Поле для ссылки

// @todo: Функция создания карточки
function createCard(cardData) {
  // Клонируем шаблон карточки
  const cardClone = cardTemplate.content.cloneNode(true);

  // Получаем элементы карточки из шаблона
  const cardElement = cardClone.querySelector('.card');
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button'); // Кнопка лайка

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // @todo: Функция удаления карточки
  cardDeleteButton.addEventListener('click', function () {
    cardElement.remove();
  });

  // @todo: Открытие изображения в поп-апе при клике на картинку
  cardImage.addEventListener('click', function () {
    popupImage.classList.add('popup_is-opened'); // Показываем поп-ап
    popupImageElement.src = cardData.link; // Устанавливаем изображение
    popupCaption.textContent = cardData.name; // Устанавливаем подпись
  });

  // Переключение состояния сердечка
  cardLikeButton.addEventListener('click', function () {
    cardLikeButton.classList.toggle('card__like-button_is-active');
  });

  // Добавляем карточку на страницу
  placesList.append(cardClone);
}

// Вывести карточки на страницу
initialCards.forEach(createCard); // Проходим по всем картам и выводим их

// Открытие поп-апа для нового места
addButton.addEventListener('click', function () {
  popupNewCard.classList.add('popup_is-opened');
});

// Закрытие поп-апа для нового места
popupCloseButton.addEventListener('click', function () {
  popupNewCard.classList.remove('popup_is-opened');
});

// Закрытие поп-апа с изображением
popupImage.querySelector('.popup__close').addEventListener('click', function () {
  popupImage.classList.remove('popup_is-opened');
});

// Открытие поп-апа для редактирования профиля
editButton.addEventListener('click', function () {
  nameInput.value = '';
  descriptionInput.value = '';
  popupEditProfile.classList.add('popup_is-opened');
});

// Закрытие поп-апа редактирования профиля
popupEditCloseButton.addEventListener('click', function () {
  popupEditProfile.classList.remove('popup_is-opened');
});

// Обновленяем данные профиля
formEditProfile.addEventListener('submit', function (event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы

  const updatedProfileData = {
    name: nameInput.value || nameInput.placeholder, // Если поле не пустое, то обновляем, иначе placeholder
    description: descriptionInput.value || descriptionInput.placeholder, // То же для описания
  };

  // Обновляем данные профиля на странице
  document.querySelector('.profile__title').textContent = updatedProfileData.name;
  document.querySelector('.profile__description').textContent = updatedProfileData.description;

  // Закрываем поп-ап и очищаем форму
  popupEditProfile.classList.remove('popup_is-opened');
  formEditProfile.reset();
});

// @todo: Добавляем новую карточку при отправке формы
formNewPlace.addEventListener('submit', function (event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы

  const newCardData = {
    name: placeNameInput.value,
    link: linkInput.value,
  };

  // Создаем карточку
  createCard(newCardData);

  // Закрываем поп-ап и очищаем форму
  popupNewCard.classList.remove('popup_is-opened');
  formNewPlace.reset();
});