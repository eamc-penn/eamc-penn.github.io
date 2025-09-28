function setupEventListeners() {
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".mode-btn").forEach(
        b => b.classList.remove("active")
      );
      this.classList.add('active');
      
      currentMode = this.dataset.mode;
      toggleThresholdControls();
      updateAnalysis();
    });
  });

  document.getElementById("global-threshold-slider")
    .addEventListener("input", function(e) {
      globalThreshold = parseFloat(e.target.value);
      document.getElementById("global-threshold-display")
        .textContent = globalThreshold.toFixed(1);
      updateAnalysis();
    });
  document.getElementById("white-threshold-slider")
    .addEventListener("input", function(e) {
      whiteThreshold = parseFloat(e.target.value);
      document.getElementById("white-threshold-display")
        .textContent = whiteThreshold.toFixed(1);
      updateAnalysis();
    });
  document.getElementById("black-threshold-slider")
    .addEventListener('input', function(e) {
      blackThreshold = parseFloat(e.target.value);
      document.getElementById("black-threshold-display")
        .textContent = blackThreshold.toFixed(1);
      updateAnalysis();
    });
}

function toggleThresholdControls() {
  const globalControls = document.getElementById("global-controls");
  const classControls = document.getElementById("class-wise-controls");
  
  if (currentMode === "global") {
    globalControls.style.display = "block";
    classControls.classList.remove("active");
  } else {
    globalControls.style.display = "none";
    classControls.classList.add("active");
  }
}

function updateMetricsDisplay(prefix, metrics) {
  document.getElementById(`${prefix}-sensitivity`)
    .textContent = (metrics.sensitivity * 100).toFixed(1) + "%";
  document.getElementById(`${prefix}-specificity`)
    .textContent = (metrics.specificity * 100).toFixed(1) + "%";
  document.getElementById(`${prefix}-accuracy`)
    .textContent = (metrics.accuracy * 100).toFixed(1) + "%";
}
