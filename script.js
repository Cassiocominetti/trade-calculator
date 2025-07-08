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

document.getElementById("calc-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const stop = parseFloat(document.getElementById("stop").value);
  const lev = parseFloat(document.getElementById("leverage").value);
  const loss = parseFloat(document.getElementById("loss").value);
  const targetRatio = parseFloat(document.getElementById("target").value);

  if (stop <= 0 || lev <= 0 || loss <= 0 || targetRatio <= 0) {
    return alert("Valores inválidos");
  }

  const pos = loss / (stop / 100);
  const marg = pos / lev;
  const target = loss * targetRatio;

  document.getElementById("loss-display").textContent = loss.toFixed(2);
  document.getElementById("position-size").textContent = `$${pos.toFixed(2)}`;
  document.getElementById("margin-required").textContent = `$${marg.toFixed(
    2
  )}`;
  document.getElementById("target-value").textContent = `$${target.toFixed(2)}`;
  document.getElementById("results").style.display = "block";

  const entrada = {
    perdaMaxima: loss,
    stop,
    alavancagem: lev,
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
  const ul = document.getElementById("history-list");
  ul.innerHTML = "";

  if (!hist.length) {
    const placeholder = document.createElement("li");
    placeholder.className = "placeholder";
    placeholder.innerHTML = `
      <em>Nenhum dado no histórico ainda.</em><br>
      Seus cálculos aparecerão aqui.
    `;
    ul.appendChild(placeholder);
    return;
  }

  hist.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>#${
        i + 1
      }</strong> - Perda máxima: <strong>$${item.perdaMaxima.toFixed(
      2
    )}</strong><br>
      Stop loss: <strong>${item.stop}%</strong>, 
      Alavancagem: <strong>${item.alavancagem}x</strong><br>
      📊 Tamanho da posição: <strong>$${item.tamanhoPosicao.toFixed(
        2
      )}</strong> |
      Margem: <strong>$${item.margem.toFixed(2)}</strong> |
      Alvo: <strong>$${item.alvo?.toFixed(2) || "0.00"}</strong>
    `;
    ul.appendChild(li);
  });
}

document.getElementById("export-xlsx").addEventListener("click", () => {
  const hist = JSON.parse(localStorage.getItem("historico") || "[]");
  if (!hist.length) return alert("Não há dados para exportar");
  const ws = XLSX.utils.json_to_sheet(hist);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Histórico");
  XLSX.writeFile(wb, "historico_calculos.xlsx");
});

document.getElementById("clear-history").addEventListener("click", () => {
  const hist = JSON.parse(localStorage.getItem("historico") || "[]");

  if (!hist.length) {
    alert("Não há dados para apagar.");
    return;
  }

  if (confirm("Deseja realmente apagar o histórico?")) {
    localStorage.removeItem("historico");
    atualizarLista([]);
  }
});

atualizarLista(JSON.parse(localStorage.getItem("historico") || "[]"));
