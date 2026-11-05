document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form[onsubmit]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      const confirmation = form.getAttribute("onsubmit");
      if (confirmation && confirmation.includes("confirm(")) {
        // Inline confirmation remains active for the delete forms.
      }
    });
  });
});
