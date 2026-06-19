export const AUTH_KEYS = {
  token: "notes-app-token",
  user: "notes-app-user",
};

export const AUTH_EVENT = "notes-app-authchange";

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  return atob(normalized + (padding ? "=".repeat(4 - padding) : ""));
};

const decodeTokenUser = (token) => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(payloadPart));

    return {
      id: payload.userId,
      username: payload.username,
    };
  } catch {
    return null;
  }
};

const readUser = () => {
  const rawUser = localStorage.getItem(AUTH_KEYS.user);

  if (rawUser) {
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }

  const token = localStorage.getItem(AUTH_KEYS.token);
  return token ? decodeTokenUser(token) : null;
};

export const getAuthSession = () => ({
  token: localStorage.getItem(AUTH_KEYS.token),
  user: readUser(),
});

export const saveAuthSession = ({ token, user }) => {
  localStorage.setItem(AUTH_KEYS.token, token);

  if (user) {
    localStorage.setItem(AUTH_KEYS.user, JSON.stringify(user));
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_KEYS.token);
  localStorage.removeItem(AUTH_KEYS.user);
  window.dispatchEvent(new Event(AUTH_EVENT));
};