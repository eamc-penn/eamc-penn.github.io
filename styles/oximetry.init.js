function init() {
  setupEventListeners();

  const totalPatients = pulseOx.length;
  const whitePatients = races.filter(r => r.toLowerCase() === "white")
    .length;
  const blackPatients = races.filter(r => r.toLowerCase() === "black")
    .length;
  const hypoxemicPatients = o2Art.filter(o2 => o2 < artThresh).length;

  updateAnalysis();
}

window.addEventListener("load", init);

const loc = document.getElementById("histogram-container")
  .getBoundingClientRect();
const parentLoc = document.getElementById("histogram-container")
  .parentElement
  .getBoundingClientRect();
