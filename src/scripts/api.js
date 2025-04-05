
const config = {
    baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-35',
    headers: {
      authorization: '04954376-3434-488e-9ac4-1edefd7d44d0',
      'Content-Type': 'application/json'
    }
  };
  
  function request(url, options) {
    return fetch(url, options).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }
  
  // GET /users/me
  export function getUserInfo() {
    return request(`${config.baseUrl}/users/me`, {
      method: 'GET',
      headers: config.headers
    });
  }
  
  // GET /cards
  export function getInitialCards() {
    return request(`${config.baseUrl}/cards`, {
      method: 'GET',
      headers: config.headers
    });
  }
  
  // PATCH /users/me
  export function editProfile(name, about) {
    return request(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({ name, about })
    });
  }
  
  // POST /cards
  export function addCard(name, link) {
    return request(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({ name, link })
    });
  }
  
  // PUT /cards/likes/:cardId
  export function addLike(cardId) {
    return request(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: config.headers
    });
  }
  
  // DELETE /cards/likes/:cardId
  export function removeLike(cardId) {
    return request(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: config.headers
    });
  }
  
  export function deleteCard(cardId) {
    return request(`${config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: config.headers
    });
  }  
  
  export function updateAvatar(newAvatarUrl) {
    return request(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({ avatar: newAvatarUrl })
    });
  }