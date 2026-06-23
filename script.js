const STORAGE_KEY = 'lifeDashboardEntries';
const form = document.getElementById('entry-form');
const feedbackMessage = document.getElementById('feedback-message');
const successState = document.getElementById('success-state');

const fieldMap = {
  date: {
    input: document.getElementById('date'),
    error: document.getElementById('date-error'),
    rule: (value) => value.trim() === '' ? 'This field is required.' : null,
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

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function showSuccessState() {
  form.classList.add('hidden');
  successState.classList.remove('hidden');
}

Object.values(fieldMap).forEach((field) => {
  field.input.addEventListener('input', () => {
    const value = field.input.value;
    const message = field.rule(value);

    if (message) {
      setFieldError(field, message);
    } else {
      clearFieldState(field);
    }
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = validateFields();

  if (!valid) {
    showFeedback('Please fix the highlighted fields.', 'error');
    return;
  }
  const entry = getEntryData();
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);

  showSuccessState();
});
