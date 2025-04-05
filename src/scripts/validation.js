
export function enableValidation(config) {
    const forms = Array.from(document.querySelectorAll(config.formSelector));
  
    forms.forEach((formElement) => {
      setEventListeners(formElement, config);
    });
  }
  
export function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
  
    inputList.forEach((inputElement) => {
      hideInputError(formElement, inputElement, config);
      inputElement.setCustomValidity('');
    });
  
    // Отключаем кнопку
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  }
  
  /* Вешаем слушатели на поля формы */
  function setEventListeners(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
  
    // Проверим, нужно ли блокировать кнопку при загрузке
    toggleButtonState(inputList, buttonElement, config);
  
    // Каждое поле слушаем на событие
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        checkInputValidity(formElement, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });
  }
  
  /* Проверка поля на валидность */
  function checkInputValidity(formElement, inputElement, config) {
    // Сбрасываем кастомное сообщение
    inputElement.setCustomValidity('');
  
    // Если нарушен паттерн — берём кастомное сообщение
    if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(inputElement.dataset.errorPattern || '');
    }
  
    // Если поле невалидно, показываем ошибку
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
      hideInputError(formElement, inputElement, config);
    }
  }
  
  /* Показываем ошибку */
  function showInputError(formElement, inputElement, errorMessage, config) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
  
  /* Скрываем ошибку */
  function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = '';
  }
  
  /* Блокируем/разблокируем кнопку */
  function toggleButtonState(inputList, buttonElement, config) {
    if (hasInvalidInput(inputList)) {
      buttonElement.classList.add(config.inactiveButtonClass);
      buttonElement.disabled = true;
    } else {
      buttonElement.classList.remove(config.inactiveButtonClass);
      buttonElement.disabled = false;
    }
  }
  
  /* Проверяем, есть ли невалидное поле */
  function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => !inputElement.validity.valid);
  }
  