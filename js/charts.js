/**
 * 少子化・人口減少統計LP - Chart.js 制御ロジック
 */

let activeChart = null;

document.addEventListener("DOMContentLoaded", () => {
  initChart();
  setupChartToggles();
});

function initChart() {
  const ctx = document.getElementById("demographicsChart");
  if (!ctx || typeof Chart === "undefined" || typeof REPORTS_DATA === "undefined") {
    return;
  }
  renderBirthsChart(ctx.getContext("2d"));
}

function renderBirthsChart(ctx) {
  if (activeChart) {
    activeChart.destroy();
  }

  const data = REPORTS_DATA.chartData.birthsHistory;

  activeChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#cbd5e1", font: { family: "'Inter', sans-serif" } }
        },
        tooltip: {
          backgroundColor: "#1e293b",
          titleColor: "#ffffff",
          bodyColor: "#cbd5e1",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255,255,255,0.05)" },
          title: { display: true, text: "万人", color: "#94a3b8" }
        }
      }
    }
  });
}

function renderChildlessChart(ctx) {
  if (activeChart) {
    activeChart.destroy();
  }

  const data = REPORTS_DATA.chartData.childlessHistory;

  activeChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#cbd5e1", font: { family: "'Inter', sans-serif" } }
        },
        tooltip: {
          backgroundColor: "#1e293b",
          titleColor: "#ffffff",
          bodyColor: "#cbd5e1",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255,255,255,0.05)" },
          title: { display: true, text: "%", color: "#94a3b8" },
          max: 60
        }
      }
    }
  });
}

function setupChartToggles() {
  const btnBirths = document.getElementById("btn-chart-births");
  const btnChildless = document.getElementById("btn-chart-childless");
  const ctx = document.getElementById("demographicsChart");

  if (!btnBirths || !btnChildless || !ctx) return;

  btnBirths.addEventListener("click", () => {
    btnBirths.classList.add("active");
    btnChildless.classList.remove("active");
    renderBirthsChart(ctx.getContext("2d"));
  });

  btnChildless.addEventListener("click", () => {
    btnChildless.classList.add("active");
    btnBirths.classList.remove("active");
    renderChildlessChart(ctx.getContext("2d"));
  });
}
