function init() {
  setupEventListeners();

  const totalPatients = pulseOx.length;
  const whitePatients = races.filter(r => r.toLowerCase() === "white")
    .length;
  const blackPatients = races.filter(r => r.toLowerCase() === "black")
    .length;
  const hypoxemicPatients = o2Art.filter(o2 => o2 < artThresh).length;

  document.getElementById("total-patients").textContent = totalPatients;
  document.getElementById("white-patients").textContent = whitePatients;
  document.getElementById("black-patients").textContent = blackPatients;
  document.getElementById("hypoxemic-patients")
    .textContent = hypoxemicPatients;

  updateAnalysis();
}

window.addEventListener("load", init);

document.getElementById("year").innerHTML = new Date().getFullYear();


const loc = document.getElementById("histogram-container")
  .getBoundingClientRect();
const parentLoc = document.getElementById("histogram-container")
  .parentElement
  .getBoundingClientRect();

document.getElementsByTagName("nav")[0].style.top = (loc.top - parentLoc.top + 100) + "px";
