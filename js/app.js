/**
 * 少子化・人口減少統計LP - メインアプリケーション (一般公開・完全オープンアクセス版)
 */

document.addEventListener("DOMContentLoaded", () => {
  initCounters();
  renderReportCards();
  setupModal();
  setupSmoothLinks();

  if (typeof initChart === "function") {
    initChart();
  }
});

/* ==========================================================================
   Counter Animation (DES-01)
   ========================================================================== */
function initCounters() {
  const valueElements = document.querySelectorAll(".metric-value");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  valueElements.forEach(el => observer.observe(el));
}

function animateValue(element) {
  const targetStr = element.getAttribute("data-target");
  const targetVal = parseFloat(targetStr);
  const decimals = parseInt(element.getAttribute("data-decimals") || "0", 10);
  
  const duration = 1500; // ms
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
    const currentVal = targetVal * progress;

    if (decimals > 0) {
      element.textContent = currentVal.toFixed(decimals);
    } else {
      element.textContent = Math.round(currentVal).toLocaleString();
    }

    if (frame >= totalFrames) {
      clearInterval(counter);
      if (decimals > 0) {
        element.textContent = targetVal.toFixed(decimals);
      } else {
        element.textContent = Math.round(targetVal).toLocaleString();
      }
    }
  }, frameRate);
}

/* ==========================================================================
   Reports Card Generation (DES-03)
   ========================================================================== */
function renderReportCards() {
  const container = document.getElementById("reports-grid");
  if (!container || typeof REPORTS_DATA === "undefined") return;

  container.innerHTML = "";

  REPORTS_DATA.reports.forEach(report => {
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `
      <div>
        <div class="report-meta">
          <span class="report-category">${report.category}</span>
          <span>${report.date}</span>
        </div>
        <h3 class="report-card-title">${report.title}</h3>
        <p class="report-card-sub">${report.subtitle}</p>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">${report.summary}</p>
      </div>
      <button class="btn-open-modal" data-id="${report.id}">レポート全文を読む &rarr;</button>
    `;
    container.appendChild(card);
  });
}

/* ==========================================================================
   Modal Dialog Logic & TOC Generation
   ========================================================================== */
function setupModal() {
  const overlay = document.getElementById("report-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const titleEl = document.getElementById("modal-title");
  const subtitleEl = document.getElementById("modal-subtitle");
  const bodyEl = document.getElementById("modal-body");
  const tocListEl = document.getElementById("modal-toc-list");
  const tocBoxEl = document.getElementById("modal-toc-box");

  if (!overlay || !closeBtn) return;

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".btn-open-modal");
    if (trigger) {
      e.preventDefault();
      const reportId = trigger.getAttribute("data-id");
      openReportModal(reportId);
    }
  });

  function openReportModal(reportId) {
    const report = REPORTS_DATA.reports.find(r => r.id === reportId);
    if (!report) return;

    titleEl.textContent = report.title;
    subtitleEl.textContent = report.subtitle;

    let html = `<p style="margin-bottom: 1.5rem; font-size: 0.98rem; font-weight: 600; color: var(--text-main); line-height: 1.8; border-bottom: 1px solid var(--border-color); padding-bottom: 1.2rem;">${report.summary}</p>`;
    let tocItems = [];
    let headingIndex = 0;

    if (report.contentBlocks && Array.isArray(report.contentBlocks)) {
      report.contentBlocks.forEach(block => {
        if (block.type === "heading") {
          headingIndex++;
          const sectionId = `sec-heading-${headingIndex}`;
          tocItems.push({ id: sectionId, text: block.text });
          html += `<h3 id="${sectionId}" style="font-size: 1.3rem; font-weight: 800; color: #ffffff; margin: 2rem 0 1rem; border-left: 4px solid var(--accent-red); padding-left: 0.8rem; scroll-margin-top: 2rem;">${block.text}</h3>`;
        } else if (block.type === "subheading") {
          html += `<h4 style="font-size: 1.1rem; font-weight: 700; color: var(--accent-amber); margin: 1.5rem 0 0.6rem;">${block.text}</h4>`;
        } else if (block.type === "paragraph") {
          html += `<p style="font-size: 0.94rem; color: var(--text-muted); line-height: 1.85; margin-bottom: 1.1rem;">${block.text}</p>`;
        } else if (block.type === "list" && Array.isArray(block.items)) {
          html += `<ul style="margin: 0.8rem 0 1.4rem 1.4rem; padding-left: 0.5rem; color: var(--text-muted); font-size: 0.93rem; line-height: 1.8;">`;
          block.items.forEach(item => {
            html += `<li style="margin-bottom: 0.7rem;">${item}</li>`;
          });
          html += `</ul>`;
        }
      });
    }

    if (tocItems.length > 0) {
      tocBoxEl.style.display = "block";
      tocListEl.innerHTML = tocItems.map(item => `
        <li><a href="#${item.id}" class="modal-toc-link">${item.text}</a></li>
      `).join("");
    } else {
      tocBoxEl.style.display = "none";
    }

    bodyEl.innerHTML = html;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    tocListEl.querySelectorAll(".modal-toc-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElem = document.getElementById(targetId);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function closeModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);
  
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeModal();
    }
  });
}

function setupSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.classList.contains('btn-open-modal') || this.classList.contains('modal-toc-link')) return;
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
