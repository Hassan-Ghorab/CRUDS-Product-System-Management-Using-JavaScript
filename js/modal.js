const modalContainer = document.getElementById("modal-container");

function customModal(title, body, message = "", btnId, deleteBtnClass = "", btn) {
  modalContainer.classList.remove("ds-none-toggler");

  let modal = `
  <div id="overlay" class="modal-overlay close-modal"></div>
    <div class="modal">
      <div class="modal-title flex">
        <h2>${title}</h2>
        <i class="icon-cancel-circle close-modal"></i>
      </div>
      <div class="modal-content">
      ${body}
      ${message}
        <div class="modal-btn-container">
          <button id="${btnId}" class="btn ${deleteBtnClass}">${btn}</button>
          <button class="btn close-modal">Cancel</button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modal;
}

modalContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-modal")) {
    closeModal();
  }

});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

function closeModal() {
  modalContainer.classList.add("ds-none-toggler");
}
