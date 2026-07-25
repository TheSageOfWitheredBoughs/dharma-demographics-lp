/**
 * 少子化・人口減少統計LP - Chart.js アニメーション＆スライドインタラクション制御
 * Apple Style: スライド・ホバー追従・プログレッシブアニメーション対応
 */

let activeChart = null;

// 垂直ガイドライン (Vertical Crosshair Line) プラグイン
const verticalLinePlugin = {
  id: 'verticalLine',
  afterDraw: (chart) => {
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      const ctx = chart.ctx;
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(41, 151, 255, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }
  }
};

if (typeof Chart !== "undefined") {
  Chart.register(verticalLinePlugin);
}

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
  const focusEl = document.getElementById("chartFocusInfo");

  activeChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      animation: {
        duration: 1800,
        easing: "easeInOutQuart"
      },
      plugins: {
        legend: {
          labels: { color: "#f5f5f7", font: { family: "-apple-system, BlinkMacSystemFont, 'SF Pro JP', sans-serif", weight: "bold" } }
        },
        tooltip: {
          backgroundColor: "rgba(22, 22, 23, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#2997ff",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw} 万人`;
            }
          }
        }
      },
      onHover: (event, activeElements) => {
        if (activeElements.length > 0 && focusEl) {
          const index = activeElements[0].index;
          const year = data.labels[index];
          const val = data.datasets[0].data[index];
          focusEl.innerHTML = `<span style="color: var(--apple-blue); font-weight:800;">${year}年</span> の出生数: <span style="color:#ffffff; font-weight:800; font-family:var(--font-mono); font-size:1.15rem;">${val}</span> 万人`;
        }
      },
      scales: {
        x: {
          ticks: { color: "#86868b", font: { weight: "600" } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        y: {
          ticks: { color: "#86868b", font: { weight: "600" } },
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          title: { display: true, text: "万人", color: "#86868b", font: { weight: "bold" } }
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
  const focusEl = document.getElementById("chartFocusInfo");

  activeChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      animation: {
        duration: 1800,
        easing: "easeInOutQuart"
      },
      plugins: {
        legend: {
          labels: { color: "#f5f5f7", font: { family: "-apple-system, BlinkMacSystemFont, 'SF Pro JP', sans-serif", weight: "bold" } }
        },
        tooltip: {
          backgroundColor: "rgba(22, 22, 23, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#f5f5f7",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      },
      onHover: (event, activeElements) => {
        if (activeElements.length > 0 && focusEl) {
          const index = activeElements[0].index;
          const yearLabel = data.labels[index];
          const mVal = data.datasets[0].data[index];
          const fVal = data.datasets[1].data[index];
          focusEl.innerHTML = `<span style="color: var(--apple-blue); font-weight:800;">${yearLabel}</span> 男性: <span style="color:#2997ff; font-weight:800; font-family:var(--font-mono);">${mVal}%</span> / 女性: <span style="color:#ec4899; font-weight:800; font-family:var(--font-mono);">${fVal}%</span>`;
        }
      },
      scales: {
        x: {
          ticks: { color: "#86868b", font: { weight: "600" } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        y: {
          ticks: { color: "#86868b", font: { weight: "600" } },
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          title: { display: true, text: "%", color: "#86868b", font: { weight: "bold" } },
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
