export const setAllThemes = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value.default));
};

export const setToLS = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromLS = (key) => {
  window.localStorage.removeItem(key);
};

export const getFromLS = (key) => {
  const value = window.localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
};
