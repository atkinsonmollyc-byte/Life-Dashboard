const STORAGE_KEY = 'lifeDashboardEntries';
const GOALS_STORAGE_KEY = 'lifeDashboardGoals';
const COMPANION_STORAGE_KEY = 'lifeDashboardCompanion';
const USER_NAME_STORAGE_KEY = 'lifeDashboardUserName';
const form = document.getElementById('entry-form');
const feedbackMessage = document.getElementById('feedback-message');
const successState = document.getElementById('success-state');
const duplicateWarning = document.getElementById('duplicate-warning');
const cancelDuplicateButton = document.getElementById('cancel-duplicate');
const saveDuplicateButton = document.getElementById('save-duplicate');
const editNotice = document.getElementById('edit-notice');
const editNoticeText = document.getElementById('edit-notice-text');
const submitEntryButton = document.getElementById('submit-entry-button');
const companionPopup = document.getElementById('companion-popup');
const companionPopupIcon = document.getElementById('companion-popup-icon');
const companionPopupMessage = document.getElementById('companion-popup-message');
const closeCompanionPopupButton = document.getElementById('close-companion-popup');
let pendingDuplicateEntry = null;
let pendingDuplicateEditIndex = null;
let editingIndex = null;

const defaultGoals = {
  water: 8,
  sleep: 8,
  exercise: 30,
  reading: 20,
  screenTime: 4,
};

const goalTypes = {
  water: 'minimum',
  sleep: 'minimum',
  exercise: 'minimum',
  reading: 'minimum',
  screenTime: 'maximum',
};

const avatarDetails = {
  cat: {
    icon: '🐱',
    message: 'Purrfect work! You completed a goal today.',
  },
  dog: {
    icon: '🐶',
    message: 'Pawsome job! You completed a goal today.',
  },
  flower: {
    icon: '🌸',
    message: "You're blooming! You completed a goal today.",
  },
  star: {
    icon: '⭐',
    message: "You're shining! You completed a goal today.",
  },
  moon: {
    icon: '🌙',
    message: 'Dreamy progress! You completed a goal today.',
  },
  butterfly: {
    icon: '🦋',
    message: 'Beautiful progress! You completed a goal today.',
  },
};

function todayYMD() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const fieldMap = {
  date: {
    input: document.getElementById('date'),
    error: document.getElementById('date-error'),
    rule: (value) => {
      const dateValue = value.trim();
      if (dateValue === '') return 'This field is required.';
      return dateValue > todayYMD() ? 'Future dates are not allowed.' : null;
    },
  },
  water: {
    input: document.getElementById('water'),
    error: document.getElementById('water-error'),
    rule: (value) => {
      if (value.trim() === '') return 'This field is required.';
      const number = Number(value);
      return Number.isNaN(number) || number < 0 || number > 30 ? 'Water must be between 0 and 30 glasses.' : null;
    },
  },
  sleep: {
    input: document.getElementById('sleep'),
    error: document.getElementById('sleep-error'),
    rule: (value) => {
      if (value.trim() === '') return 'This field is required.';
      const number = Number(value);
      return Number.isNaN(number) || number < 0 || number > 24 ? 'Sleep must be between 0 and 24 hours.' : null;
    },
  },
  exercise: {
    input: document.getElementById('exercise'),
    error: document.getElementById('exercise-error'),
    rule: (value) => {
      if (value.trim() === '') return 'This field is required.';
      const number = Number(value);
      return Number.isNaN(number) || number < 0 || number > 600 ? 'Exercise must be between 0 and 600 minutes.' : null;
    },
  },
  reading: {
    input: document.getElementById('reading'),
    error: document.getElementById('reading-error'),
    rule: (value) => {
      if (value.trim() === '') return 'This field is required.';
      const number = Number(value);
      return Number.isNaN(number) || number < 0 || number > 600 ? 'Reading must be between 0 and 600 minutes.' : null;
    },
  },
  screenTime: {
    input: document.getElementById('screenTime'),
    error: document.getElementById('screenTime-error'),
    rule: (value) => {
      if (value.trim() === '') return 'This field is required.';
      const number = Number(value);
      return Number.isNaN(number) || number < 0 || number > 24 ? 'Screen Time must be between 0 and 24 hours.' : null;
    },
  },
  mood: {
    input: document.getElementById('mood'),
    error: document.getElementById('mood-error'),
    rule: (value) => (value.trim() === '' ? 'Mood is required.' : null),
  },
};

function showFeedback(message, type) {
  feedbackMessage.textContent = message;
  feedbackMessage.className = `feedback ${type}`;
}

function clearFieldState(field) {
  const group = field.input.closest('.field-group');
  if (group) {
    group.classList.remove('invalid');
  }
  field.error.textContent = '';
}

function setFieldError(field, message) {
  const group = field.input.closest('.field-group');
  if (group) {
    group.classList.add('invalid');
  }
  field.error.textContent = message;
}

function validateFields() {
  let hasError = false;
  Object.entries(fieldMap).forEach(([key, field]) => {
    const value = field.input.value;
    const message = field.rule(value);

    clearFieldState(field);
    if (message) {
      setFieldError(field, message);
      hasError = true;
    }
  });

  return !hasError;
}

function getEntryData() {
  return {
    date: fieldMap.date.input.value,
    water: Number(fieldMap.water.input.value),
    sleep: Number(fieldMap.sleep.input.value),
    exercise: Number(fieldMap.exercise.input.value),
    reading: Number(fieldMap.reading.input.value),
    screenTime: Number(fieldMap.screenTime.input.value),
    mood: fieldMap.mood.input.value,
  };
}

function loadEntries() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadGoals() {
  const saved = localStorage.getItem(GOALS_STORAGE_KEY);
  if (!saved) return defaultGoals;

  try {
    return { ...defaultGoals, ...JSON.parse(saved) };
  } catch {
    return defaultGoals;
  }
}

function loadCompanion() {
  return localStorage.getItem(COMPANION_STORAGE_KEY) || '';
}

function loadUserName() {
  return localStorage.getItem(USER_NAME_STORAGE_KEY) || '';
}

function personaliseMessage(message, name) {
  if (!name) return message;

  if (message.startsWith("You're blooming!")) {
    return `You're blooming, ${name}! You completed a goal today.`;
  }

  if (message.includes('!')) {
    return message.replace('!', `, ${name}!`);
  }

  return `${message} ${name}`;
}

function entryMeetsGoal(entry, key, goals) {
  const value = Number(entry[key]);
  const goal = Number(goals[key]);
  return goalTypes[key] === 'maximum' ? value <= goal : value >= goal;
}

function completedGoalCount(entry) {
  const goals = loadGoals();
  return Object.keys(goalTypes).filter((key) => entryMeetsGoal(entry, key, goals)).length;
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function entryExistsForDate(entries, date, ignoredIndex = null) {
  return entries.some((entry, index) => entry && entry.date === date && index !== ignoredIndex);
}

function hideDuplicateWarning() {
  duplicateWarning.classList.add('hidden');
  pendingDuplicateEntry = null;
  pendingDuplicateEditIndex = null;
}

function showDuplicateWarning(entry, editIndex = null) {
  pendingDuplicateEntry = entry;
  pendingDuplicateEditIndex = editIndex;
  duplicateWarning.classList.remove('hidden');
}

function showCompanionPopupIfNeeded(entry) {
  const companion = loadCompanion();
  const userName = loadUserName();
  const goalsCompleted = completedGoalCount(entry);
  const avatar = avatarDetails[companion];

  if (!avatar || goalsCompleted < 1) {
    return;
  }

  companionPopupIcon.textContent = avatar.icon;
  companionPopupMessage.textContent = personaliseMessage(avatar.message, userName);
  companionPopup.classList.remove('hidden');
}

function saveEntry(entry, editIndex = null) {
  const entries = loadEntries();

  if (editIndex !== null) {
    entries[editIndex] = entry;
    saveEntries(entries);
    window.location.href = 'history.html?updated=1';
    return;
  }

  entries.push(entry);
  saveEntries(entries);
  showSuccessState();
  showCompanionPopupIfNeeded(entry);
}

function showSuccessState() {
  form.classList.add('hidden');
  successState.classList.remove('hidden');
}

function fillEntryForm(entry) {
  Object.entries(fieldMap).forEach(([key, field]) => {
    field.input.value = entry[key] ?? '';
  });
}

function startEditMode() {
  const params = new URLSearchParams(window.location.search);
  const editIndexParam = params.get('editIndex');

  if (editIndexParam === null) {
    return;
  }

  const editIndex = Number(editIndexParam);

  if (!Number.isInteger(editIndex)) {
    return;
  }

  const entries = loadEntries();
  const entryToEdit = entries[editIndex];

  if (!entryToEdit) {
    showFeedback('That entry could not be found.', 'error');
    return;
  }

  editingIndex = editIndex;
  fillEntryForm(entryToEdit);
  editNoticeText.textContent = `Editing the entry for ${entryToEdit.date}. Your changes will update this saved day.`;
  editNotice.classList.remove('hidden');
  submitEntryButton.textContent = 'Save Changes';
}

Object.values(fieldMap).forEach((field) => {
  const validateField = () => {
    const value = field.input.value;
    const message = field.rule(value);

    if (message) {
      setFieldError(field, message);
    } else {
      clearFieldState(field);
    }

    if (field === fieldMap.date) {
      hideDuplicateWarning();
    }
  };

  field.input.addEventListener('input', validateField);
  field.input.addEventListener('change', validateField);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  hideDuplicateWarning();
  const valid = validateFields();

  if (!valid) {
    showFeedback('Please fix the highlighted fields.', 'error');
    return;
  }
  const entry = getEntryData();
  const entries = loadEntries();

  if (entryExistsForDate(entries, entry.date, editingIndex)) {
    showDuplicateWarning(entry, editingIndex);
    return;
  }

  saveEntry(entry, editingIndex);
});

cancelDuplicateButton.addEventListener('click', () => {
  hideDuplicateWarning();
});

saveDuplicateButton.addEventListener('click', () => {
  if (!pendingDuplicateEntry) return;
  saveEntry(pendingDuplicateEntry, pendingDuplicateEditIndex);
});

closeCompanionPopupButton.addEventListener('click', () => {
  companionPopup.classList.add('hidden');
});

startEditMode();
