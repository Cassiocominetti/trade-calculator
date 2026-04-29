const translations = {
  pt: {
    title: "CALCULADORA DE TRADE<br />++ VIVER DE CRIPTO ++",
    tab_calc: "Calculadora",
    tab_hist: "Histórico",
    tab_doc: "Documentação",
    label_loss: "Perda máxima ($)",
    label_entry: "Preço de entrada ($) (opcional)",
    label_direction: "Direção da operação",
    label_stop: "Stop loss (%)",
    label_leverage: "Alavancagem (X)",
    label_target: "Alvo (risco:retorno)",
    btn_calc: "Calcular",
    res_loss: "Perda máxima:",
    res_entry: "Entrada:",
    res_sl: "Stop-Loss:",
    res_tp: "Take-Profit:",
    res_pos: "Tamanho da posição:",
    res_margin: "Margem utilizada:",
    res_target: "Valor alvo:",
    disclaimer_title: "Aviso Legal:",
    disclaimer_body:
      "Os cálculos apresentados são apenas <strong>estimativas</strong> e não constituem recomendação de investimento. Considere sempre o <strong>preço de liquidação</strong> e as <strong>taxas da corretora</strong>.",
    btn_clear: "Apagar histórico",
    btn_export: "Exportar",
    doc_download: "Baixar planilha",
    doc_read: "Ler documentação",
    alert_invalid: "Valores inválidos",
    alert_no_export: "Não há dados para exportar",
    alert_no_clear: "Não há dados para apagar.",
    confirm_clear: "Deseja realmente apagar o histórico?",
    hist_empty:
      "Nenhum dado no histórico ainda.<br>Seus cálculos aparecerão aqui.",
    hist_direction: "Direção",
    hist_entry: "Entrada",
    hist_stop: "Stop loss",
    hist_leverage: "Alavancagem",
    hist_pos: "Tamanho da posição",
    hist_margin: "Margem",
    hist_target: "Alvo",
    hist_max_loss: "Perda máxima",
  },
  en: {
    title: "TRADE CALCULATOR<br />++ LIVE ON CRYPTO ++",
    tab_calc: "Calculator",
    tab_hist: "History",
    tab_doc: "Documentation",
    label_loss: "Max loss ($)",
    label_entry: "Entry price ($) (optional)",
    label_direction: "Trade direction",
    label_stop: "Stop loss (%)",
    label_leverage: "Leverage (X)",
    label_target: "Target (risk:reward)",
    btn_calc: "Calculate",
    res_loss: "Max loss:",
    res_entry: "Entry:",
    res_sl: "Stop-Loss:",
    res_tp: "Take-Profit:",
    res_pos: "Position size:",
    res_margin: "Margin used:",
    res_target: "Target value:",
    disclaimer_title: "Disclaimer:",
    disclaimer_body:
      "The calculations shown are <strong>estimates only</strong> and do not constitute investment advice. Always consider the <strong>liquidation price</strong> and <strong>exchange fees</strong>.",
    btn_clear: "Clear history",
    btn_export: "Export",
    doc_download: "Download spreadsheet",
    doc_read: "Read documentation",
    alert_invalid: "Invalid values",
    alert_no_export: "No data to export",
    alert_no_clear: "No data to clear.",
    confirm_clear: "Are you sure you want to clear the history?",
    hist_empty:
      "No data in history yet.<br>Your calculations will appear here.",
    hist_direction: "Direction",
    hist_entry: "Entry",
    hist_stop: "Stop loss",
    hist_leverage: "Leverage",
    hist_pos: "Position size",
    hist_margin: "Margin",
    hist_target: "Target",
    hist_max_loss: "Max loss",
  },
};

let currentLang = localStorage.getItem("lang") || "pt";

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang === "pt" ? "pt-br" : "en";

  const t = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!t[key]) return;
    el.innerHTML = t[key];
  });

  const linkXlsx = document.getElementById("link-xlsx");
  const linkDoc = document.getElementById("link-doc");
  if (linkXlsx) {
    linkXlsx.href =
      lang === "en"
        ? "./assets/trade_calculator_en.xlsx"
        : "./assets/calculadora_de_trade_viver_de_cripto.xlsx";
    linkXlsx.setAttribute("download", "");
  }
  if (linkDoc) {
    linkDoc.href = lang === "en" ? "./assets/doc.en.html" : "./assets/doc.html";
  }

  atualizarLista(JSON.parse(localStorage.getItem("historico") || "[]"));

  document.getElementById("lang-pt").classList.toggle("active", lang === "pt");
  document.getElementById("lang-en").classList.toggle("active", lang === "en");
}

document
  .getElementById("lang-pt")
  .addEventListener("click", () => applyLanguage("pt"));
document
  .getElementById("lang-en")
  .addEventListener("click", () => applyLanguage("en"));

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const themeToggle = document.getElementById("toggle-theme");

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeToggle.checked = dark;
  localStorage.setItem("theme", dark ? "dark" : "light");
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

themeToggle.addEventListener("change", () => {
  applyTheme(themeToggle.checked);
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

document.querySelectorAll(".numeric-only").forEach((input) => {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9.]/g, "");
    if ((this.value.match(/\./g) || []).length > 1) {
      this.value = this.value.substring(0, this.value.length - 1);
    }
  });
});

document.getElementById("calc-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const t = translations[currentLang];
  const stop = parseFloat(document.getElementById("stop").value);
  const lev = parseFloat(document.getElementById("leverage").value);
  const loss = parseFloat(document.getElementById("loss").value);
  const entry = parseFloat(document.getElementById("entry").value);
  const targetRatio = parseFloat(document.getElementById("target").value);
  const direction = document.getElementById("direction").value;

  if (stop <= 0 || lev <= 0 || loss <= 0 || targetRatio <= 0) {
    return alert(t.alert_invalid);
  }

  const pos = loss / (stop / 100);
  const marg = pos / lev;
  const target = loss * targetRatio;

  let sl = null;
  let tp = null;

  if (!isNaN(entry) && entry > 0) {
    const stopValue = entry * (stop / 100);
    if (direction === "long") {
      sl = entry - stopValue;
      tp = entry + (entry - sl) * targetRatio;
    } else {
      sl = entry + stopValue;
      tp = entry - (sl - entry) * targetRatio;
    }
  }

  function formatNumber(num) {
    if (num == null || isNaN(num)) return "-";
    if (Number.isInteger(num)) return num.toString();
    let str = num.toFixed(8);
    str = str.replace(/(\.\d*?[1-9])0+$/, "$1");
    if (/\.\d$/.test(str)) return str;
    return str.replace(/\.$/, "");
  }

  document.getElementById("loss-display").textContent = loss.toFixed(2);
  document.getElementById("entry-display").textContent = entry
    ? formatNumber(entry)
    : "-";
  document.getElementById("sl-display").textContent = sl
    ? formatNumber(sl)
    : "-";
  document.getElementById("tp-display").textContent = tp
    ? formatNumber(tp)
    : "-";
  document.getElementById("position-size").textContent = `$${pos.toFixed(2)}`;
  document.getElementById("margin-required").textContent =
    `$${marg.toFixed(2)}`;
  document.getElementById("target-value").textContent = `$${target.toFixed(2)}`;
  document.getElementById("results").style.display = "block";

  const entrada = {
    perdaMaxima: loss,
    stop,
    alavancagem: lev,
    direcao: direction,
    entrada: entry || null,
    stopLoss: sl,
    takeProfit: tp,
    tamanhoPosicao: pos,
    margem: marg,
    alvo: target,
  };

  salvarHistorico(entrada);
});

function salvarHistorico(entry) {
  const hist = JSON.parse(localStorage.getItem("historico") || "[]");
  hist.push(entry);
  localStorage.setItem("historico", JSON.stringify(hist));
  atualizarLista(hist);
}

function atualizarLista(hist) {
  const t = translations[currentLang];
  const ul = document.getElementById("history-list");
  ul.innerHTML = "";

  if (!hist.length) {
    const placeholder = document.createElement("li");
    placeholder.className = "placeholder";
    placeholder.innerHTML = `<em>${t.hist_empty}</em>`;
    ul.appendChild(placeholder);
    return;
  }

  hist.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>#${i + 1}</strong> - ${t.hist_max_loss}: <strong>$${item.perdaMaxima.toFixed(2)}</strong><br>
      ${t.hist_direction}: <strong>${item.direcao}</strong><br>
      ${t.hist_entry}: <strong>$${item.entrada ? item.entrada.toFixed(2) : "-"}</strong> |
      SL: <strong>${item.stopLoss ? item.stopLoss.toFixed(2) : "-"}</strong> |
      TP: <strong>${item.takeProfit ? item.takeProfit.toFixed(2) : "-"}</strong><br>
      ${t.hist_stop}: <strong>${item.stop}%</strong>, 
      ${t.hist_leverage}: <strong>${item.alavancagem}x</strong><br>
      📊 ${t.hist_pos}: <strong>$${item.tamanhoPosicao.toFixed(2)}</strong> |
      ${t.hist_margin}: <strong>$${item.margem.toFixed(2)}</strong> |
      ${t.hist_target}: <strong>$${item.alvo?.toFixed(2) || "0.00"}</strong>
    `;
    ul.appendChild(li);
  });
}

document.getElementById("export-xlsx").addEventListener("click", () => {
  const t = translations[currentLang];
  const hist = JSON.parse(localStorage.getItem("historico") || "[]");
  if (!hist.length) return alert(t.alert_no_export);
  const isEn = currentLang === "en";
  const data = hist.map((item) =>
    isEn
      ? {
          "Max Loss ($)": item.perdaMaxima,
          "Stop Loss (%)": item.stop,
          "Leverage (x)": item.alavancagem,
          Direction: item.direcao,
          "Entry Price ($)": item.entrada,
          "Stop-Loss ($)": item.stopLoss,
          "Take-Profit ($)": item.takeProfit,
          "Position Size ($)": item.tamanhoPosicao,
          "Margin ($)": item.margem,
          "Target ($)": item.alvo,
        }
      : {
          "Perda Máxima ($)": item.perdaMaxima,
          "Stop Loss (%)": item.stop,
          "Alavancagem (x)": item.alavancagem,
          Direção: item.direcao,
          "Entrada ($)": item.entrada,
          "Stop-Loss ($)": item.stopLoss,
          "Take-Profit ($)": item.takeProfit,
          "Tamanho da Posição ($)": item.tamanhoPosicao,
          "Margem ($)": item.margem,
          "Alvo ($)": item.alvo,
        },
  );
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, isEn ? "History" : "Histórico");
  XLSX.writeFile(wb, isEn ? "trade_history.xlsx" : "histórico_calculos.xlsx");
});

document.getElementById("clear-history").addEventListener("click", () => {
  const t = translations[currentLang];
  const hist = JSON.parse(localStorage.getItem("historico") || "[]");
  if (!hist.length) {
    alert(t.alert_no_clear);
    return;
  }
  if (confirm(t.confirm_clear)) {
    localStorage.removeItem("historico");
    atualizarLista([]);
  }
});

applyLanguage(currentLang);
atualizarLista(JSON.parse(localStorage.getItem("historico") || "[]"));
