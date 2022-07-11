document.getElementById("log-out-button").onclick = function () {
  window.open("/log-out", "_self");
};
document.getElementById("home-button").onclick = function () {
  window.open("/", "_self");
};
document.getElementById("secret-link-button").onclick = function () {
  let element = document.getElementById("help-modal");
  element.classList.toggle("show");
  element.classList.toggle("help-modal");
};
