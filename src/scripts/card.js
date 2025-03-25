const cardTemplate = document.querySelector('#card-template');

export function createCard(cardData, handleCardClick, handleDeleteClick, handleLikeClick) {
  const cardClone = cardTemplate.content.cloneNode(true);
  const cardElement = cardClone.querySelector('.card');
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardDeleteButton.addEventListener('click', () => {
    handleDeleteClick(cardElement);
  });

  cardImage.addEventListener('click', () => {
    handleCardClick(cardData);
  });

  cardLikeButton.addEventListener('click', (evt) => {
    handleLikeClick(evt);
  });

  return cardElement;
}