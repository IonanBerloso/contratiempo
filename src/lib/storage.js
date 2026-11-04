const STATE_STORAGE_KEY = "contratiempo-demo-v2";
export const loadSavedState = () => {
  try {
    return JSON.parse(localStorage.getItem(STATE_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};
export const persistState = (state) => {
  try {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {}
};
