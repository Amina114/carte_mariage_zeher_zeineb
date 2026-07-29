const popupContent = [
  {
    title: "Invitation à la célébration traditionnelle",
    description:
      "Nous serons heureux de vous retrouver pour cette belle journée à Sfax.",
    name: "Célébration traditionnelle",
    date: "Vendredi 21 août 2026",
    time: "Après-midi",
    location: "L’Opera Palace, Sfax",
    startDate: "20260821T140000",
    endDate: "20260821T220000",
    downloadUrl: "nzoul.jpeg",
    downloadName: "traditionnelle.jpeg",
  },
  {
    title: "Invitation à la cérémonie de mariage",
    description:
      "Nous vous invitons à partager ce moment important avec nous à Tunis.",
    name: "Cérémonie de mariage",
    date: "Lundi 24 août 2026",
    time: "17:00",
    location: "Municipalité de la Kasbah, Tunis",
    startDate: "20260824T170000",
    endDate: "20260824T230000",
    downloadUrl: "3ers.jpeg",
    downloadName: "ceremonie.jpeg",
  },
];

let currentEvent = null;

function createPopupMarkup(index) {
  const content = popupContent[index];

  return `
    <div class="popup-overlay" id="popupOverlay" role="dialog" aria-modal="true" aria-labelledby="popupTitle">
      <div class="popup-modal">
        <button class="popup-close" type="button" aria-label="Fermer la popup">×</button>
        <p class="popup-kicker">Invitation spéciale</p>
        <h3 class="popup-title" id="popupTitle">${content.title}</h3>
        <p class="popup-description">${content.description}</p>
        <div class="popup-actions">
          <button class="popup-link primary" type="button" onclick="window.addToGoogleCalendar()">Ajouter au calendrier Google</button>
          <button class="popup-link tertiary" type="button" onclick="window.downloadInvitationJPG()">Télécharger l’invitation JPG</button>
        </div>
      </div>
    </div>
  `;
}

function openPopup(index) {
  currentEvent = popupContent[index];

  const popup = document.getElementById("popupOverlay");
  if (popup) {
    popup.remove();
  }

  document.body.insertAdjacentHTML("beforeend", createPopupMarkup(index));

  const overlay = document.getElementById("popupOverlay");
  overlay.classList.add("is-open");

  overlay.querySelector(".popup-close").addEventListener("click", () => {
    overlay.remove();
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });
}

function buildGoogleCalendarUrl(event) {
  return [
    "https://calendar.google.com/calendar/render?action=TEMPLATE",
    `&text=${encodeURIComponent(`Mariage Zeher & Zeineb – ${event.name}`)}`,
    `&dates=${event.startDate}/${event.endDate}`,
    `&details=${encodeURIComponent(`${event.name} – ${event.date} – ${event.location}`)}`,
    `&location=${encodeURIComponent(event.location)}`,
  ].join("");
}

function addToGoogleCalendar() {
  if (!currentEvent) {
    return;
  }

  window.open(buildGoogleCalendarUrl(currentEvent), "_blank", "noopener,noreferrer");
}

function downloadInvitationJPG() {
  if (!currentEvent || !currentEvent.downloadUrl) {
    return;
  }

  const link = document.createElement("a");
  link.href = currentEvent.downloadUrl;
  link.download = currentEvent.downloadName || currentEvent.downloadUrl.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

window.addToGoogleCalendar = addToGoogleCalendar;
window.downloadInvitationJPG = downloadInvitationJPG;
window.openPopup = openPopup;
