function calculateMetrics(indices, threshold) {
  let tp = 0, fp = 0, tn = 0, fn = 0;

  for (const i of indices) {
    const actualHypoxemic = o2Art[i] < artThresh;
    const predictedHypoxemic = pulseOx[i] < threshold;

    tp += (actualHypoxemic && predictedHypoxemic);
    fp += (!actualHypoxemic && predictedHypoxemic);
    fn += (actualHypoxemic && !predictedHypoxemic);
    tn += (!actualHypoxemic && !predictedHypoxemic);
  }

  const sensitivity = tp / (tp + fn) || 0;
  const specificity = tn / (tn + fp) || 0;
  const accuracy = (tp + tn) / (tp + tn + fp + fn) || 0;

  return { sensitivity, specificity, accuracy };
}

function calculateClassWiseMetrics(whiteTresh, blackThresh) {
  let tp = 0, fp = 0, tn = 0, fn = 0;

  for (let i = 0; i < pulseOx.length; i++) {
    const actualHypoxemic = o2Art[i] < artThresh;
    const race = races[i].toLowerCase();
    const threshold = race === white_ ? whiteThresh : blackThresh;
    const predictedHypoxemic = pulseOx[i] < threshold;

    tp += (actualHypoxemic && predictedHypoxemic);
    fp += (!actualHypoxemic && predictedHypoxemic);
    fn += (actualHypoxemic && !predictedHypoxemic);
    tn += (!actualHypoxemic && !predictedHypoxemic);
  }

  const sensitivity = tp / (tp + fn) || 0;
  const specificity = tn / (tn + fp) || 0;
  const accuracy = (tp + tn) / (tp + tn + fp + fn) || 0;

  return { sensitivity, specificity, accuracy };
}

function updateAnalysis() {
  let globalMetrics;
  if (currentMode === "global") {
    const allIndices = Array.from({length: pulseOx.length}, (_, i) => i);
    globalMetrics = calculateMetrics(allIndices, globalThreshold);
  } else {
    globalMetrics = calculateClassWiseMetrics(whiteThreshold, blackThreshold);
  }

  const whiteIndices = [], blackIndices = [];
  for (let i = 0; i < races.length; i++) {
    if (races[i] === white_)
      whiteIndices.push(i);
    else if (races[i] === black_)
        blackIndices.push(i);
  }

  const whiteThresh = (
    currentMode === "global" ? globalThreshold : whiteThreshold
  );
  const blackThresh = (
    currentMode === "global" ? globalThreshold : blackThreshold
  );
    
  const whiteMetrics = calculateMetrics(whiteIndices, whiteThresh);
  const blackMetrics = calculateMetrics(blackIndices, blackThresh);

  updateMetricsDisplay("global", globalMetrics);
  updateMetricsDisplay("white", whiteMetrics);
  updateMetricsDisplay("black", blackMetrics);
  plotHistogram("White", whiteThresh);
  plotHistogram("Black", blackThresh);
}

function plotHistogram(raceTarget, raceThresh) {
  const width = 375;
  const height = 250;
  const margin = { top: 0, right: 10, bottom: 50, left: 10};
  const binWidth = 0.5;
  const dotRadius = 5;
  const dotSpacing = 12;

  const xScale = (value) => margin.left + (
    ((value - minPulse) / (maxPulse - minPulse)) * (
      width - margin.left - margin.right
    )
  );

  let svg = document.getElementById("histogram-" + raceTarget + "-svg");
  let isNew = false;
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.id = "histogram-" + raceTarget + "-svg";
    document.getElementById("histogram-" + raceTarget).appendChild(svg);
    isNew = true;
  }

  const minPulse = Math.floor(Math.min(...pulseOx));
  const maxPulse = Math.ceil(Math.max(...pulseOx));
  const numBins = Math.ceil((maxPulse - minPulse) / binWidth);

  const bins = [];
  for (let i = 0; i < numBins; i++) {
    bins.push({
      range: [minPulse + i * binWidth, minPulse + (i + 1) * binWidth],
      data: []
    });
  }

  for (let i = 0; i < pulseOx.length; i++) {
    const binIndex = Math.min(
      Math.floor((pulseOx[i] - minPulse) / binWidth), numBins - 1
    );
    if (races[i] != raceTarget)
      continue;
    bins[binIndex].data.push({
      pulse: pulseOx[i], ygt: o2Art[i] >= artThresh
    });
  }

  var elements = svg.getElementsByClassName("icon");
  while (elements[0])
    svg.removeChild(elements[0]);
  bins.forEach((bin, binIndex) => {
    if (bin.data.length === 0) return;
    
    const binCenterX = xScale(bin.range[0] + binWidth / 2);
    const sortedData = bin.data.sort((a, b) => {
      return a.ygt === b.ygt ? 0 : (a.ygt ? 1 : -1);
    });
    sortedData.forEach((point, index) => {
      const x = binCenterX;
      const y = height - margin.bottom - (index * dotSpacing) - dotRadius;
      let color, opacity, strokeOpacity;
      if (point.ygt === (point.pulse >= raceThresh)) {
        color = "var(--BLUE)";
        opacity = point.artAboveThresh ? 1 : 0.3;
        strokeOpacity = point.artAboveThresh ? 1 : 0.4;
      } else {
        color = "var(--FADED-COLOR)";
        opacity = point.artAboveThresh ? 1 : 0.3;
        strokeOpacity = point.artAboveThresh ? 1 : 0.4;
      }
        
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("class", "icon");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", dotRadius);
      circle.setAttribute("fill", color);
      circle.setAttribute("stroke", color);
      circle.setAttribute("fill-opacity", opacity);
      circle.setAttribute("stroke-opacity", strokeOpacity);
        
      svg.appendChild(circle);
    });
  });

  let thresholdLine = document.getElementById("threshLine-" + raceTarget);
  if (!thresholdLine) {
    thresholdLine = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    thresholdLine.id = "threshLine-" + raceTarget;
    thresholdLine.setAttribute("y", margin.top);
    thresholdLine.setAttribute("width", 1.5);
    thresholdLine.setAttribute("height", height - margin.top - margin.bottom);
    thresholdLine.setAttribute("fill", "var(--FONT-COLOR)");
    svg.appendChild(thresholdLine);
  }
  thresholdLine.setAttribute("x", xScale(raceThresh));

  if (!isNew)
    return;

  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
  xAxis.setAttribute("class", "histogram-axis");
  xAxis.setAttribute("transform", `translate(0,${height - margin.bottom + 8})`);
        
  const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
  axisLine.setAttribute("class", "domain");
  axisLine.setAttribute("stroke", "currentColor");
  axisLine.setAttribute("fill", "none");
  axisLine.setAttribute("d", `M${margin.left},0H${width - margin.right}`);
  xAxis.appendChild(axisLine);

  const tickValues = [];
  for (let i = minPulse; i <= maxPulse; i += 1)
    tickValues.push(i);
  tickValues.forEach(value => {
    const x = xScale(value);

    const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tick.setAttribute("stroke", "currentColor");
    tick.setAttribute("x1", x);
    tick.setAttribute("x2", x);
    tick.setAttribute("y1", 0);
    tick.setAttribute("y2", 6);
    xAxis.appendChild(tick);
    
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("fill", "currentColor");
    label.setAttribute("x", x);
    label.setAttribute("y", 18);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "var(--X-SMALL)");
    label.textContent = value;
    xAxis.appendChild(label);
  });

  svg.appendChild(xAxis);

  const xTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xTitle.setAttribute("x", width / 2);
  xTitle.setAttribute("y", height - 8);
  xTitle.setAttribute("text-anchor", "middle");
  xTitle.setAttribute("font-size", "var(--X-SMALL)");
  xTitle.setAttribute("font-weight", "var(--NORMAL)");
  xTitle.setAttribute("font-color", "var(--FONT-COLOR)");
  xTitle.textContent = "Pulse Oximetry Reading (%)";
  svg.appendChild(xTitle);
}
