import { generateSecret } from "../generateSecret";
import { isValidGuess } from "../isValidGuess";
import { evaluateGuess } from "../evaluateGuess";
import { countPossibleSecrets } from "../countPossibleSecrets";

// --- Types ---
interface Move {
  guess: string;
  bulls: number;
  cows: number;
}

interface GameState {
  secret: string;
  length: number;
  base: string;
  attempts: Move[];
  startTime: number;
  isGameOver: boolean;
}

interface RecordEntry {
  attempts: number;
  time: number; // seconds
  length: number;
  base: string;
}

// --- Constants ---
const BASE_DIGITS_COUNT: Record<string, number> = {
  bin: 2,
  oct: 8,
  dec: 10,
  hex: 16,
};

const RECORDS_KEY = "bulls-and-cows-records";

// --- State (mutable reference to an immutable object) ---
let state: GameState | null = null;
let timerInterval: number | null = null;

// --- DOM refs ---
const settingsScreen = document.getElementById("settings-screen")!;
const gameScreen = document.getElementById("game-screen")!;
const recordsScreen = document.getElementById("records-screen")!;
const viewRecordsBtn = document.getElementById("view-records-btn")!;

const baseSelect = document.getElementById("base-select") as HTMLSelectElement;
const lengthSelect = document.getElementById(
  "length-select",
) as HTMLSelectElement;
const combinationsCount = document.getElementById("combinations-count")!;
const startBtn = document.getElementById("start-btn")!;

const attemptsCount = document.getElementById("attempts-count")!;
const possibleCount = document.getElementById("possible-count")!;
const timerDisplay = document.getElementById("timer")!;
const guessInput = document.getElementById("guess-input") as HTMLInputElement;
const submitGuessBtn = document.getElementById(
  "submit-guess-btn",
) as HTMLButtonElement;
const historyList = document.getElementById("history-list")!;
const newGameBtn = document.getElementById("new-game-btn")!;

const recordsTableBody = document.querySelector("#records-table tbody")!;
const backToSettingsBtn = document.getElementById("back-to-settings-btn")!;

// --- Helpers ---
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const getElapsedSeconds = (): number => {
  if (!state) return 0;
  return Math.floor((Date.now() - state.startTime) / 1000);
};

const updateCombinationsInfo = () => {
  const base = baseSelect.value;
  const length = Number(lengthSelect.value);
  const count = countPossibleSecrets(length, base, []);
  combinationsCount.textContent = String(count);
};

const populateLengthOptions = () => {
  const base = baseSelect.value;
  const maxDigits = BASE_DIGITS_COUNT[base] ?? 0;
  const current = Number(lengthSelect.value);

  lengthSelect.innerHTML = "";
  for (let len = 2; len <= 6; len++) {
    if (len > maxDigits) continue;
    const opt = document.createElement("option");
    opt.value = String(len);
    opt.textContent = String(len);
    if (len === current) opt.selected = true;
    lengthSelect.appendChild(opt);
  }

  // If current length is no longer valid, pick the max available.
  if (Number(lengthSelect.value) > maxDigits) {
    lengthSelect.value = String(maxDigits);
  }
};

// --- Records ---
const loadRecords = (): RecordEntry[] => {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRecord = (entry: RecordEntry): void => {
  const records = loadRecords();
  records.push(entry);
  // Sort by attempts asc, then time asc.
  records.sort((a, b) => a.attempts - b.attempts || a.time - b.time);
  // Keep top 10.
  const top = records.slice(0, 10);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(top));
};

const renderRecords = (): void => {
  const records = loadRecords();
  recordsTableBody.innerHTML = "";
  records.forEach((rec, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${rec.attempts}</td>
      <td>${formatTime(rec.time)}</td>
      <td>${rec.base} / ${rec.length}</td>
    `;
    recordsTableBody.appendChild(tr);
  });
};

// --- Game flow ---
const showSettings = (): void => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  state = null;
  settingsScreen.hidden = false;
  gameScreen.hidden = true;
  recordsScreen.hidden = true;
  populateLengthOptions();
  updateCombinationsInfo();
};

const startGame = (): void => {
  const base = baseSelect.value;
  const length = Number(lengthSelect.value);

  if (length < 2 || length > (BASE_DIGITS_COUNT[base] ?? 0)) {
    alert(`Invalid length for base ${base}.`);
    return;
  }

  const secret = generateSecret(length, base, Math.random);
  state = {
    secret,
    length,
    base,
    attempts: [],
    startTime: Date.now(),
    isGameOver: false,
  };

  settingsScreen.hidden = true;
  gameScreen.hidden = false;
  recordsScreen.hidden = true;

  attemptsCount.textContent = "0";
  possibleCount.textContent = String(countPossibleSecrets(length, base, []));
  historyList.innerHTML = "";
  guessInput.value = "";
  guessInput.disabled = false;
  submitGuessBtn.disabled = false;
  timerDisplay.textContent = "00:00";

  timerInterval = window.setInterval(() => {
    timerDisplay.textContent = formatTime(getElapsedSeconds());
  }, 1000);
};

const submitGuess = (): void => {
  if (!state || state.isGameOver) return;

  const guess = guessInput.value.trim().toLowerCase();
  if (!isValidGuess(guess, state.length, state.base)) {
    alert(
      `Invalid guess. Must be ${state.length} unique digits from base "${state.base}".`,
    );
    return;
  }

  const result = evaluateGuess(state.secret, guess);

  const newAttempts = [...state.attempts, { guess, ...result }];
  const isWin = result.bulls === state.length;

  state = {
    ...state,
    attempts: newAttempts,
    isGameOver: isWin,
  };

  // Update history
  const entry = document.createElement("div");
  entry.className = "history-entry";
  entry.innerHTML = `
    <span>${guess}</span>
    <span><span class="bulls">🐂 ${result.bulls}</span> <span class="cows">🐄 ${result.cows}</span></span>
  `;
  historyList.prepend(entry);

  attemptsCount.textContent = String(newAttempts.length);
  possibleCount.textContent = String(
    countPossibleSecrets(state.length, state.base, newAttempts),
  );
  guessInput.value = "";

  if (isWin) {
    const elapsed = getElapsedSeconds();
    timerDisplay.textContent = formatTime(elapsed);
    if (timerInterval !== null) clearInterval(timerInterval);
    timerInterval = null;

    guessInput.disabled = true;
    submitGuessBtn.disabled = true;

    saveRecord({
      attempts: newAttempts.length,
      time: elapsed,
      length: state.length,
      base: state.base,
    });

    setTimeout(() => {
      alert(
        `🎉 You won in ${newAttempts.length} attempts and ${formatTime(elapsed)}!`,
      );
    }, 100);
  }
};

const showRecords = (): void => {
  renderRecords();
  settingsScreen.hidden = true;
  gameScreen.hidden = true;
  recordsScreen.hidden = false;
};

// --- Init & Events ---
const init = (): void => {
  populateLengthOptions();
  updateCombinationsInfo();

  baseSelect.addEventListener("change", () => {
    populateLengthOptions();
    updateCombinationsInfo();
  });

  lengthSelect.addEventListener("change", updateCombinationsInfo);

  startBtn.addEventListener("click", startGame);
  viewRecordsBtn.addEventListener("click", showRecords);
  submitGuessBtn.addEventListener("click", submitGuess);
  guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitGuess();
  });

  newGameBtn.addEventListener("click", showSettings);
  backToSettingsBtn.addEventListener("click", showSettings);

  // Show records if any exist? Optional: add a button. For simplicity, just go back.
  // Could add a "Records" button on settings screen.
};

init();
