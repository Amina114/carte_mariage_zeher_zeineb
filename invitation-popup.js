const popupContent = [
  {
    title: "Invitation à la célébration traditionnelle",
    description:
      "Vous êtes chaleureusement invités à célébrer cette journée avec nous. Nous vous proposons ci-dessous plusieurs façons d’en garder un souvenir.",
    calendarLabel: "Ajouter au calendrier Google",
    calendarUrl: "https://calendar.app.google/QpLChc7DAzPsKYrd9",
    icsLabel: "Apple / Outlook (.ics)",
    icsUrl: "https://calendar.app.google/calendar/render?action=TEMPLATE&text=C%C3%A9l%C3%A9bration%20traditionnelle%20de%20Zeher%20et%20Zeineb&details=Invitation%20au%20mariage%20de%20Zeher%20et%20Zeineb&location=L%E2%80%99Opera%20Palace%2C%20Sfax",
    downloadLabel: "Télécharger l’invitation JPG",
    downloadUrl: "nzoul.jpeg",
  },
  {
    title: "Invitation à la cérémonie de mariage",
    description:
      "Merci de votre présence à cette étape importante de notre vie. Vous pouvez enregistrer l’événement ou télécharger l’invitation en image.",
    calendarLabel: "Ajouter au calendrier Google",
    calendarUrl: "https://calendar.app.google/9112EA7KT1rBHtuL6",
    icsLabel: "Apple / Outlook (.ics)",
    icsUrl: "https://calendar.app.google/calendar/render?action=TEMPLATE&text=C%C3%A9r%C3%A9monie%20de%20mariage%20de%20Zeher%20et%20Zeineb&details=Invitation%20au%20mariage%20de%20Zeher%20et%20Zeineb&location=Municipalit%C3%A9%20de%20la%20Kasbah%2C%20Tunis",
    downloadLabel: "Télécharger l’invitation JPG",
    downloadUrl: "3ers.jpeg",
  },
];

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
          <a class="popup-link primary" href="${content.calendarUrl}" target="_blank" rel="noopener noreferrer">${content.calendarLabel}</a>
          <a class="popup-link secondary" href="${content.icsUrl}" target="_blank" rel="noopener noreferrer">${content.icsLabel}</a>
          <a class="popup-link tertiary" href="${content.downloadUrl}" download>${content.downloadLabel}</a>
        </div>
      </div>
    </div>
  `;
}

function openPopup(index) {
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
