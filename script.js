const root = document.documentElement;
const invite = document.querySelector(".invite");
const video = document.querySelector(".invite__video");
const soundButton = document.querySelector("#soundButton");
const languageButtons = document.querySelectorAll("[data-lang]");
const calendarLink = document.querySelector(".action--primary");

const translations = {
  en: {
    label: "Save the date",
    date: "July 21, 2027",
    place: "Leopoldshafen, Germany",
    calendar: "Add to calendar",
    pageLabel: "Save the date for Maria and Noah",
    calendarLabel: "Add Maria and Noah save the date to calendar",
    soundOn: "Turn sound on",
    soundOff: "Turn sound off"
  },
  de: {
    label: "Bitte vormerken",
    date: "21. Juli 2027",
    place: "Leopoldshafen, Deutschland",
    calendar: "Kalender",
    pageLabel: "Save the Date für Maria und Noah",
    calendarLabel: "Maria und Noah im Kalender speichern",
    soundOn: "Ton einschalten",
    soundOff: "Ton ausschalten"
  },
  pt: {
    label: "Reserve a data",
    date: "21 de julho de 2027",
    place: "Leopoldshafen, Alemanha",
    calendar: "Calendário",
    pageLabel: "Save the date de Maria e Noah",
    calendarLabel: "Adicionar Maria e Noah ao calendário",
    soundOn: "Ligar som",
    soundOff: "Desligar som"
  }
};

let activeLanguage = "en";

function setViewportHeight() {
  root.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}

function setSoundState(isOn) {
  soundButton.classList.toggle("is-on", isOn);
  soundButton.setAttribute("aria-pressed", String(isOn));
  soundButton.setAttribute("aria-label", translations[activeLanguage][isOn ? "soundOff" : "soundOn"]);
}

async function toggleSound() {
  const shouldPlaySound = video.muted;
  video.muted = !shouldPlaySound;
  video.volume = shouldPlaySound ? 1 : 0;

  try {
    await video.play();
  } catch (error) {
    video.muted = true;
    video.volume = 0;
  }

  setSoundState(!video.muted && video.volume > 0);
}

function setLanguage(language) {
  activeLanguage = translations[language] ? language : "en";
  root.lang = activeLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translations[activeLanguage][element.dataset.i18n];
  });

  invite.setAttribute("aria-label", translations[activeLanguage].pageLabel);
  calendarLink.setAttribute("aria-label", translations[activeLanguage].calendarLabel);

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === activeLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  setSoundState(!video.muted && video.volume > 0);

  try {
    localStorage.setItem("saveDateLanguage", activeLanguage);
  } catch (error) {}
}

setViewportHeight();
window.addEventListener("resize", setViewportHeight);
window.addEventListener("orientationchange", setViewportHeight);
soundButton.addEventListener("click", toggleSound);
languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

video.addEventListener("volumechange", () => setSoundState(!video.muted && video.volume > 0));
video.play().catch(() => {});

try {
  setLanguage(localStorage.getItem("saveDateLanguage") || "en");
} catch (error) {
  setLanguage("en");
}
