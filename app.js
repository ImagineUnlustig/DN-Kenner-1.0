(() => {
  "use strict";
  const DATA_URL = "./data/measurements.json";
  const systemButtons = [...document.querySelectorAll(".system-choice")];
  const searchInput = document.querySelector("#search");
  const fittingSelect = document.querySelector("#fitting");
  const sizeSelect = document.querySelector("#size");
  const results = document.querySelector("#results");
  const count = document.querySelector("#result-count");
  const resetButton = document.querySelector("#reset");
  let records = [];
  let activeSystem = "Kupfer";

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);

  function visibleRecords() {
    const term = searchInput.value.trim().toLocaleLowerCase("de");
    return records.filter(row => {
      if (row.system !== activeSystem) return false;
      if (fittingSelect.value && row.fitting !== fittingSelect.value) return false;
      if (sizeSelect.value && String(row.size) !== sizeSelect.value) return false;
      const haystack = [row.fitting, row.name, row.size, row.connection, ...(row.dimensions || []).flatMap(d => [d.label, d.value])]
        .join(" ").toLocaleLowerCase("de");
      return !term || haystack.includes(term);
    });
  }

  function fillSelect(select, values, label) {
    const current = select.value;
    select.replaceChildren(new Option(label, ""));
    [...new Set(values.filter(v => v !== undefined && v !== null && String(v).trim() !== ""))]
      .sort((a,b) => String(a).localeCompare(String(b), "de", {numeric:true}))
      .forEach(value => select.add(new Option(value, String(value))));
    if ([...select.options].some(o => o.value === current)) select.value = current;
  }

  function refreshFilters() {
    const subset = records.filter(row => row.system === activeSystem);
    fillSelect(fittingSelect, subset.map(row => row.fitting), "Alle Fittingarten");
    fillSelect(sizeSelect, subset.map(row => row.size), "Alle Größen");
  }

  function render() {
    const rows = visibleRecords();
    count.textContent = rows.length === 1 ? "1 Maßdatensatz" : `${rows.length} Maßdatensätze`;
    if (!rows.length) {
      results.innerHTML = `<div class="empty-state"><div class="empty-icon">⌕</div><h3>Keine erfassten Maße gefunden</h3><p>Für diese Auswahl ist noch kein passender Datensatz hinterlegt. Das ist keine Aussage darüber, ob der Fitting existiert. Es wurden keine Werte ergänzt oder geraten.</p></div>`;
      return;
    }
    const columns = ["System", "Fitting", "Größe", "Anschluss", "Maße", "Quelle"];
    const body = rows.map(row => {
      const dims = (row.dimensions || []).map(d => `${safe(d.label)}: <b>${safe(d.value)}</b>`).join("<br>") || "Keine Maße erfasst";
      const source = `PDF-Seite ${safe(row.source?.pdfPage ?? "nicht angegeben")}` +
        (row.source?.bookPage ? `<br>Buchseite ${safe(row.source.bookPage)}` : "") +
        (row.source?.table ? `<br>${safe(row.source.table)}` : "");
      return `<tr><td>${safe(row.system)}</td><td>${safe(row.name || row.fitting)}</td><td>${safe(row.size || "–")}</td><td>${safe(row.connection || "–")}</td><td>${dims}</td><td>${source}</td></tr>`;
    }).join("");
    results.innerHTML = `<table class="data-table"><thead><tr>${columns.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table><p class="source-note">Die Angaben sind aus dem hinterlegten PDF übertragen. Eine unabhängige Prüfung gegen eine Norm ist damit nicht verbunden.</p>`;
  }

  function setSystem(system) {
    activeSystem = system;
    systemButtons.forEach(button => {
      const selected = button.dataset.system === system;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    refreshFilters();
    render();
  }

  systemButtons.forEach(button => button.addEventListener("click", () => setSystem(button.dataset.system)));
  [searchInput, fittingSelect, sizeSelect].forEach(control => control.addEventListener("input", render));
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    fittingSelect.value = "";
    sizeSelect.value = "";
    render();
  });

  fetch(DATA_URL)
    .then(response => {
      if (!response.ok) throw new Error("Daten konnten nicht geladen werden");
      return response.json();
    })
    .then(data => {
      records = Array.isArray(data.records) ? data.records : [];
      refreshFilters();
      render();
    })
    .catch(() => {
      count.textContent = "Datenbank konnte nicht geladen werden";
      results.innerHTML = `<div class="empty-state"><h3>Daten konnten nicht geladen werden</h3><p>Prüfe, ob data/measurements.json im GitHub-Repository vorhanden ist.</p></div>`;
    });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {
      document.querySelector("#connection").textContent = "Offline-Modus nicht aktiv";
    }));
  }
})();