function notLoggedIn() {
  // window.open("/", "_self");
  (window.location.href = "/"), "_self";
}
module.exports = { notLoggedIn: notLoggedIn };
