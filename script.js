/* global PRICE_DATA */

const CONTACT = {
  email: "info@linkify.tech",
  phoneE164: "+4915563477504",
  displayPhone: "+49 155 63477504",
};

const REPAIR_LABELS = ["Display", "Akku", "Ladeport", "Rückkamera", "Anderes/unklar (Diagnose)"];
const STEP_COUNT = 4;
const AUTO_ADVANCE = true;

const el = {
  year: document.getElementById("year"),
  category: document.getElementById("category"),
  model: document.getElementById("model"),
  repair: document.getElementById("repair"),
  unclearBox: document.getElementById("unclearBox"),
  notes: document.getElementById("notes"),
  price: document.getElementById("price"),
  priceNote: document.getElementById("priceNote"),
  summaryText: document.getElementById("summaryText"),
  copyBtn: document.getElementById("copyBtn"),
  mailtoBtn: document.getElementById("mailtoBtn"),
  telBtn: document.getElementById("telBtn"),
  form: document.getElementById("calcForm"),
  slides: document.getElementById("wizardSlides"),
  backBtn: document.getElementById("backBtn"),
  nextBtn: document.getElementById("nextBtn"),
  wizardBarFill: document.getElementById("wizardBarFill"),
  stepBtns: Array.from(document.querySelectorAll("[data-step-btn]")),
  imprintDialog: document.getElementById("imprintDialog"),
  imprintOpen: document.getElementById("imprintOpen"),
  imprintClose: document.getElementById("imprintClose"),
};

let currentStep = 0;

function euro(amount) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
}

function getSelectedSymptoms() {
  const chips = el.unclearBox.querySelectorAll('input[type="checkbox"]');
  const items = [];
  chips.forEach((c) => {
    if (c.checked) items.push(c.value);
  });
  return items;
}

function makeSummary({ categoryKey, modelName, repairName, priceValue }) {
  const categoryLabel = categoryKey ? PRICE_DATA[categoryKey]?.label : "";
  const now = new Date();
  const lines = [];
  lines.push("Anfrage – DeviceDoctor Preisrechner");
  lines.push("");
  if (categoryLabel) lines.push(`Kategorie: ${categoryLabel}`);
  if (modelName) lines.push(`Modell: ${modelName}`);
  if (repairName) lines.push(`Schaden: ${repairName}`);

  if (repairName === "Anderes/unklar (Diagnose)") {
    const symptoms = getSelectedSymptoms();
    if (symptoms.length) lines.push(`Symptome: ${symptoms.join(", ")}`);
    const notes = (el.notes.value || "").trim();
    if (notes) lines.push(`Beschreibung: ${notes}`);
    lines.push("");
    lines.push("Bitte kurz prüfen, was sinnvoll ist (Diagnose/Preis).");
  } else if (typeof priceValue === "number") {
    lines.push(`Richtpreis: ${euro(priceValue)}`);
  }

  lines.push("");
  lines.push(`Zeitpunkt: ${now.toLocaleString("de-DE")}`);
  return lines.join("\n");
}

function setLinkState({ enabled, href }, node) {
  node.setAttribute("href", href || "#");
  node.setAttribute("aria-disabled", enabled ? "false" : "true");
}

function currentSelection() {
  const categoryKey = el.category.value || "";
  const modelName = el.model.value || "";
  const repairName = el.repair.value || "";
  let priceValue;

  if (categoryKey && modelName && repairName && repairName !== "Anderes/unklar (Diagnose)") {
    priceValue = PRICE_DATA?.[categoryKey]?.models?.[modelName]?.repairs?.[repairName];
  }

  return { categoryKey, modelName, repairName, priceValue };
}

function canGoToStep(stepIdx) {
  const { categoryKey, modelName, repairName } = currentSelection();
  if (stepIdx <= 0) return true;
  if (stepIdx === 1) return Boolean(categoryKey);
  if (stepIdx === 2) return Boolean(categoryKey && modelName);
  if (stepIdx >= 3) return Boolean(categoryKey && modelName && repairName);
  return true;
}

function updateWizardUI() {
  const clamped = Math.max(0, Math.min(STEP_COUNT - 1, currentStep));
  currentStep = clamped;

  if (el.slides) {
    el.slides.style.transform = `translateX(-${clamped * 100}%)`;
  }

  const progress = STEP_COUNT <= 1 ? 0 : (clamped / (STEP_COUNT - 1)) * 100;
  if (el.wizardBarFill) el.wizardBarFill.style.width = `${progress}%`;

  // Step buttons: done/active/disabled
  el.stepBtns.forEach((btn) => {
    const idx = Number(btn.getAttribute("data-step-btn"));
    const allowed = canGoToStep(idx);
    btn.disabled = !allowed;
    btn.dataset.active = idx === clamped ? "true" : "false";
    btn.dataset.done = idx < clamped ? "true" : "false";
  });

  // Nav buttons
  const canBack = clamped > 0;
  el.backBtn.disabled = !canBack;

  const canNext = canGoToStep(clamped + 1);
  el.nextBtn.disabled = clamped >= STEP_COUNT - 1 ? true : !canNext;
  el.nextBtn.textContent = clamped >= STEP_COUNT - 2 ? "Preis anzeigen" : "Weiter";
}

function goToStep(stepIdx) {
  const target = Math.max(0, Math.min(STEP_COUNT - 1, stepIdx));
  // nicht "vorwärts" springen, wenn Voraussetzungen fehlen
  if (target > currentStep && !canGoToStep(target)) return;
  currentStep = target;
  updateWizardUI();
}

function refreshModels() {
  const categoryKey = el.category.value;
  const cat = PRICE_DATA[categoryKey];

  // Bei Wechsel: nachgelagerte Auswahl zurücksetzen
  el.model.value = "";
  el.repair.value = "";

  el.model.innerHTML = "";
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = cat ? "Bitte auswählen…" : "Bitte zuerst Kategorie wählen…";
  opt0.disabled = true;
  opt0.selected = true;
  el.model.appendChild(opt0);

  if (!cat) {
    el.model.disabled = true;
    return;
  }

  Object.keys(cat.models)
    .sort((a, b) => a.localeCompare(b, "de-DE"))
    .forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      el.model.appendChild(opt);
    });

  el.model.disabled = false;
}

function refreshRepairs() {
  const { categoryKey, modelName } = currentSelection();
  const model = PRICE_DATA?.[categoryKey]?.models?.[modelName];

  // Bei Wechsel: Schaden zurücksetzen
  el.repair.value = "";

  el.repair.innerHTML = "";
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = model ? "Bitte auswählen…" : "Bitte zuerst Modell wählen…";
  opt0.disabled = true;
  opt0.selected = true;
  el.repair.appendChild(opt0);

  if (!model) {
    el.repair.disabled = true;
    return;
  }

  REPAIR_LABELS.forEach((r) => {
    // Nur die Reparaturen anbieten, die es in der Liste gibt, plus "unklar".
    if (r !== "Anderes/unklar (Diagnose)" && !model.repairs[r]) return;
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    el.repair.appendChild(opt);
  });

  el.repair.disabled = false;
}

function refreshResult() {
  const { categoryKey, modelName, repairName, priceValue } = currentSelection();

  const showUnclear = repairName === "Anderes/unklar (Diagnose)";
  el.unclearBox.hidden = !showUnclear;

  const hasEnough = Boolean(categoryKey && modelName && repairName);
  el.copyBtn.disabled = !hasEnough;

  const summary = makeSummary({ categoryKey, modelName, repairName, priceValue });
  el.summaryText.textContent = hasEnough ? summary : "—";

  if (!hasEnough) {
    el.price.textContent = "—";
    el.priceNote.textContent = "Bitte Auswahl treffen.";
  } else if (showUnclear) {
    el.price.textContent = "Diagnose";
    el.priceNote.textContent =
      "Unklare Fälle: Ich melde mich mit einer sinnvollen Einschätzung/Preis nach kurzer Rückfrage oder Sichtprüfung.";
  } else if (typeof priceValue === "number") {
    el.price.textContent = euro(priceValue);
    el.priceNote.textContent = "Richtpreis gemäß Preisliste.";
  } else {
    el.price.textContent = "—";
    el.priceNote.textContent = "Für diese Kombination ist kein Preis hinterlegt.";
  }

  const canContact = hasEnough;
  const subject = encodeURIComponent("Reparaturanfrage – DeviceDoctor");
  const body = encodeURIComponent(summary);

  setLinkState(
    {
      enabled: canContact,
      href: `mailto:${CONTACT.email}?subject=${subject}&body=${body}`,
    },
    el.mailtoBtn
  );
  setLinkState(
    {
      enabled: canContact,
      href: `tel:${CONTACT.phoneE164}`,
    },
    el.telBtn
  );

  updateWizardUI();
}

function init() {
  el.year.textContent = String(new Date().getFullYear());

  // Kategorien
  Object.entries(PRICE_DATA)
    .map(([key, val]) => ({ key, label: val.label }))
    .sort((a, b) => a.label.localeCompare(b.label, "de-DE"))
    .forEach(({ key, label }) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = label;
      el.category.appendChild(opt);
    });

  // Kontakttext im Button (optional sichtbar im UI)
  el.telBtn.textContent = `Anrufen (${CONTACT.displayPhone})`;
  el.mailtoBtn.textContent = `E-Mail (${CONTACT.email})`;

  el.category.addEventListener("change", () => {
    refreshModels();
    refreshRepairs();
    refreshResult();
    if (AUTO_ADVANCE && canGoToStep(1)) goToStep(1);
  });
  el.model.addEventListener("change", () => {
    refreshRepairs();
    refreshResult();
    if (AUTO_ADVANCE && canGoToStep(2)) goToStep(2);
  });
  el.repair.addEventListener("change", () => {
    refreshResult();
    if (AUTO_ADVANCE && canGoToStep(3)) goToStep(3);
  });
  el.form.addEventListener("input", refreshResult);

  el.backBtn.addEventListener("click", () => goToStep(currentStep - 1));
  el.nextBtn.addEventListener("click", () => goToStep(currentStep + 1));
  el.stepBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-step-btn"));
      goToStep(idx);
    });
  });

  el.copyBtn.addEventListener("click", async () => {
    const text = el.summaryText.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      el.copyBtn.textContent = "Kopiert";
      setTimeout(() => (el.copyBtn.textContent = "Text kopieren"), 1200);
    } catch {
      // Fallback: Hidden textarea + execCommand
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "true");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        el.copyBtn.textContent = "Kopiert";
        setTimeout(() => (el.copyBtn.textContent = "Text kopieren"), 1200);
      } catch {
        // Letzter Fallback: Auswahl markieren, damit man manuell kopieren kann
        const range = document.createRange();
        range.selectNodeContents(el.summaryText);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      } finally {
        document.body.removeChild(ta);
      }
    }
  });

  if (el.imprintOpen && el.imprintDialog) {
    el.imprintOpen.addEventListener("click", () => {
      if (typeof el.imprintDialog.showModal === "function") el.imprintDialog.showModal();
      else el.imprintDialog.setAttribute("open", "true");
    });
  }
  if (el.imprintClose && el.imprintDialog) {
    el.imprintClose.addEventListener("click", () => {
      if (typeof el.imprintDialog.close === "function") el.imprintDialog.close();
      else el.imprintDialog.removeAttribute("open");
    });
  }
  if (el.imprintDialog) {
    el.imprintDialog.addEventListener("click", (e) => {
      if (e.target === el.imprintDialog) {
        if (typeof el.imprintDialog.close === "function") el.imprintDialog.close();
        else el.imprintDialog.removeAttribute("open");
      }
    });
  }

  refreshModels();
  refreshRepairs();
  refreshResult();
  goToStep(0);
}

init();

