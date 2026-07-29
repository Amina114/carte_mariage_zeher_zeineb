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

// Remplace l'URL par ton URL Web App Apps Script déployé pour écrire dans Google Sheets.
const sheetWebhookUrl = "https://script.google.com/macros/s/AKfycbyByIdHzEvOvot20uhnnW5RwybYuETBOOGfcStqg71dS7TATM5JDZQInq2CZpYsN8RC/exec";

function saveLocalRsvpCount(eventKey) {
  const storageKey = "weddingRsvpCounts";
  const counts = JSON.parse(localStorage.getItem(storageKey) || "{}");
  counts[eventKey] = (counts[eventKey] || 0) + 1;
  localStorage.setItem(storageKey, JSON.stringify(counts));
  console.warn(
    "Google Sheets update skipped. RSVP count saved locally because the page is loaded from file:// or null origin.",
    counts
  );
}

function sendSheetUpdate(eventKey) {
  if (!sheetWebhookUrl || sheetWebhookUrl.includes("YOUR_SCRIPT_ID")) {
    return;
  }

  if (location.protocol === "file:" || location.origin === "null") {
    saveLocalRsvpCount(eventKey);
    return;
  }

  const formData = new URLSearchParams();
  formData.set("event", eventKey);

  fetch(sheetWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: formData.toString(),
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Sheet update failed (${response.status})`);
      }
      return response.text();
    })
    .then((text) => {
      console.log("Sheet update response:", text);
    })
    .catch((error) => {
      console.warn("Google Sheets POST failed:", error);
      saveLocalRsvpCount(eventKey);
    });
}

// Confirmation de participation pour chaque événement.
document.querySelectorAll(".rsvp-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const eventName = button.dataset.event;
    const eventCard = button.closest(".event-card");
    const eventKey = eventCard.dataset.eventKey;
    const thankYou = eventCard.querySelector(".thank-you");
    const responseButtons = eventCard.querySelectorAll(".rsvp-btn");

    // Message privé uniquement.
    thankYou.textContent = `Merci ❤️ Votre présence à ${eventName} est bien confirmée.`;

    // Animation.
    launchConfetti();

    // Ouvre le nouveau popup d'invitation.
    if (eventKey === "traditional") {
      openPopup(0);
    }

    if (eventKey === "ceremony") {
      openPopup(1);
    }

    // Envoie le clic au Google Sheet via Apps Script.
    sendSheetUpdate(eventKey);

    // Cache le bouton après réponse.
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
