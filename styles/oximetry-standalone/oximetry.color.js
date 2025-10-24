document.getElementsByClassName("light-dark-toggle")[0].onclick = function () {
  const body = document.getElementsByTagName("html")[0];

  if (body.className.includes("dark-theme")) {
    body.className = "";
    document.getElementById("light-dark-toggle-icon").className = "fa fa-moon-o";
  } else {
    body.className += " dark-theme";
    document.getElementById("light-dark-toggle-icon").className = "fa fa-sun-o";
  }
}

if (window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.getElementsByTagName("html")[0].className = "dark-theme";
  var toggleButton = document.getElementById("light-dark-toggle-icon");
  if (toggleButton != null) {
    toggleButton.className = "fa fa-sun-o";
  }
}
