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
          <button class="popup-link secondary" type="button" onclick="window.downloadICS()">Télécharger le fichier .ics</button>
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

function downloadICS() {
  if (!currentEvent) {
    return;
  }

  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const uid = `${now}@mariage-zeher-zeineb`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mariage Zeher & Zeineb//FR",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${currentEvent.startDate}`,
    `DTEND:${currentEvent.endDate}`,
    `SUMMARY:Mariage Zeher & Zeineb – ${currentEvent.name}`,
    `DESCRIPTION:${currentEvent.name} – ${currentEvent.date} – ${currentEvent.location}`,
    `LOCATION:${currentEvent.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "invitation-mariage.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadInvitationJPG() {
  if (!currentEvent) {
    return;
  }

  const width = 1080;
  const height = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#fdf9f3");
  gradient.addColorStop(1, "#f2e3cf");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#c7a57b";
  ctx.lineWidth = 5;
  roundRect(ctx, 35, 35, width - 70, height - 70, 26);
  ctx.stroke();

  ctx.strokeStyle = "#ddb887";
  ctx.lineWidth = 2;
  roundRect(ctx, 60, 60, width - 120, height - 120, 20);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#a56f3d";
  ctx.font = "italic 44px Georgia";
  ctx.fillText("Invitation", width / 2, 220);

  ctx.fillStyle = "#2e1f0f";
  ctx.font = "bold 76px Georgia";
  ctx.fillText("Zeher", width / 2, 360);
  ctx.font = "italic 40px Georgia";
  ctx.fillText("&", width / 2, 440);
  ctx.font = "bold 76px Georgia";
  ctx.fillText("Zeineb", width / 2, 520);

  ctx.fillStyle = "#c7a57b";
  ctx.font = "48px Georgia";
  ctx.fillText("♥", width / 2, 620);

  ctx.fillStyle = "#7a4720";
  ctx.font = "bold 42px Georgia";
  ctx.fillText(currentEvent.name, width / 2, 760);

  ctx.fillStyle = "#2e1f0f";
  ctx.font = "bold 42px Georgia";
  ctx.fillText(currentEvent.date, width / 2, 840);
  ctx.font = "32px Georgia";
  ctx.fillText(currentEvent.time, width / 2, 900);
  ctx.font = "32px Georgia";
  ctx.fillText(currentEvent.location, width / 2, 970);

  ctx.font = "italic 28px Georgia";
  ctx.fillStyle = "#a56f3d";
  ctx.fillText("Nous serons honorés de votre présence", width / 2, 1120);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invitation-mariage.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, "image/jpeg", 0.95);
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
window.downloadICS = downloadICS;
window.downloadInvitationJPG = downloadInvitationJPG;
window.openPopup = openPopup;
