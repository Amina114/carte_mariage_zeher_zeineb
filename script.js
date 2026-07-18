// Cérémonie : lundi 24 août 2026 à 17 h, heure de Tunis.
const weddingDate = new Date("2026-08-24T17:00:00+01:00").getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  const distance = weddingDate - Date.now();

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

const storageKey = "weddingResponseData";

function loadResponseData() {
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }

  return null;
}

function saveResponseData(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

const responseData =
  loadResponseData() || {
    traditional: { yes: 0, maybe: 0, answered: null },
    ceremony: { yes: 0, maybe: 0, answered: null },
  };

const calendarLinks = {
  traditional: "https://calendar.app.google/QpLChc7DAzPsKYrd9",
  ceremony: "https://calendar.app.google/9112EA7KT1rBHtuL6",
};

function updateResponseSummary(eventCard, key) {
  const summary = eventCard.querySelector(".response-summary");
  const counts = responseData[key];

  if (summary && counts) {
    summary.innerHTML = `Réponses reçues : <span class="count-yes">${counts.yes}</span> confirmés, <span class="count-maybe">${counts.maybe}</span> peut-être.`;
  }
}

function restoreResponseState() {
  document.querySelectorAll(".event-card").forEach((eventCard) => {
    const key = eventCard.dataset.eventKey;
    const counts = responseData[key];

    if (!counts) {
      return;
    }

    updateResponseSummary(eventCard, key);
  });
}

restoreResponseState();

// Cœurs flottants.
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.setAttribute("aria-hidden", "true");
  heart.textContent = "♥";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${Math.random() * 18 + 14}px`;
  heart.style.animationDuration = `${Math.random() * 3 + 5}s`;

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}

setInterval(createHeart, 700);

// Confirmation de participation pour chaque événement.
document.querySelectorAll(".rsvp-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const eventName = button.dataset.event;
    const response = button.dataset.response;
    const eventCard = button.closest(".event-card");
    const eventKey = eventCard.dataset.eventKey || eventName.toLowerCase().replace(/\s+/g, "-");
    const thankYou = eventCard.querySelector(".thank-you");
    const responseButtons = eventCard.querySelectorAll(".rsvp-btn");

    if (response === "yes") {
      responseData[eventKey].yes += 1;
      responseData[eventKey].answered = "yes";
      thankYou.textContent = `Merci ! Votre participation à ${eventName} est bien prise en compte. ${responseData[eventKey].yes} personnes ont déjà confirmé.`;
      launchConfetti();
    } else {
      responseData[eventKey].maybe += 1;
      responseData[eventKey].answered = "maybe";
      thankYou.textContent = `Merci pour votre réponse. ${responseData[eventKey].maybe} personnes ont répondu « peut-être » pour ${eventName}.`;
    }

    const calendarUrl = calendarLinks[eventKey];
    if (calendarUrl) {
      window.open(calendarUrl, "_blank", "noopener,noreferrer");
    }

    saveResponseData(responseData);
    updateResponseSummary(eventCard, eventKey);
    thankYou.style.display = "block";
    responseButtons.forEach((item) => {
      item.disabled = true;
    });
  });
});

// Confettis.
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confetti = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  confetti = [];

  for (let i = 0; i < 120; i += 1) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 4 + 2,
      angle: Math.random() * 360,
      rotation: Math.random() * 10,
    });
  }

  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((piece) => {
    piece.y += piece.speed;
    piece.angle += piece.rotation;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate((piece.angle * Math.PI) / 180);
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
    ctx.restore();
  });

  confetti = confetti.filter((piece) => piece.y < canvas.height + 20);

  if (confetti.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}

function getRandomColor() {
  const colors = ["#b76e79", "#d8a48f", "#fff1e6", "#7b3f4c", "#f4c2c2"];
  return colors[Math.floor(Math.random() * colors.length)];
}
