const THEME_STORAGE_KEY = 'lifeDashboardTheme';
const VALID_THEMES = ['original', 'pastel', 'blue', 'peach'];

function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return VALID_THEMES.includes(savedTheme) ? savedTheme : 'original';
}

function applyTheme(theme) {
  const nextTheme = VALID_THEMES.includes(theme) ? theme : 'original';
  document.documentElement.dataset.theme = nextTheme;
}

function saveTheme(theme) {
  const nextTheme = VALID_THEMES.includes(theme) ? theme : 'original';
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
}

applyTheme(getSavedTheme());
