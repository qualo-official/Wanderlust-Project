// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// --------------------------------------------
// ------------ Index (tax switch) ------------
// --------------------------------------------

const taxSwitch = document.getElementById("flexSwitchCheckDefault");

if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    let taxInfo = document.querySelectorAll(".tax-info");
    for (let info of taxInfo) {
      info.classList.toggle("displayTaxInfo");
    }
  });
}

// ---------------------------------------------
// ------ Password Field (Login & Signup) ------
// ---------------------------------------------

const togglePassword = document.getElementById("toggle-password");

if (togglePassword) {
  togglePassword.addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("eye-icon");

    // Toggle the input type between "password" and "text"
    if (passwordField.type === "password") {
      passwordField.type = "text"; // Show password
      eyeIcon.classList.remove("bi-eye-slash"); // Remove the "eye-slash" class
      eyeIcon.classList.add("bi-eye"); // Add the "eye" class (open eye)
    } else {
      passwordField.type = "password"; // Hide password
      eyeIcon.classList.remove("bi-eye"); // Remove the "eye" class
      eyeIcon.classList.add("bi-eye-slash"); // Add the "eye-slash" class (closed eye)
    }
  });
}

const password = document.getElementById("password");

if (password) {
  password.addEventListener("input", function (event) {
    const password = event.target.value;
    const result = zxcvbn(password);
    const strengthDisplay = document.getElementById("password-strength");
    const passwordField = event.target;

    // Reset the strength feedback
    strengthDisplay.textContent = ""; // Clear any previous message
    strengthDisplay.classList.remove("valid-feedback", "invalid-feedback"); // Remove old feedback classes

    // Check password strength
    if (result.score < 1) {
      // Weak password
      strengthDisplay.textContent = "Password is too weak!";
      strengthDisplay.classList.add("invalid-feedback"); // Show invalid feedback
      passwordField.classList.add("is-invalid"); // Mark the input as invalid
      passwordField.classList.remove("is-valid"); // Remove any valid class
    } else if (result.score >= 1 && result.score < 3) {
      // Fair password
      strengthDisplay.textContent = "Password is fair, but weak!";
      strengthDisplay.classList.add("invalid-feedback"); // Show invalid feedback
      passwordField.classList.add("is-invalid"); // Mark the input as invalid
      passwordField.classList.remove("is-valid"); // Remove any valid class
    } else {
      // Strong password
      strengthDisplay.textContent = "Password is strong!";
      strengthDisplay.classList.add("valid-feedback"); // Show valid feedback
      passwordField.classList.add("is-valid"); // Mark the input as valid
      passwordField.classList.remove("is-invalid"); // Remove any invalid class
    }
  });
}
