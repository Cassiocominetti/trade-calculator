let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") && prefersDark)
) {
  document.body.classList.add("dark");
  document.getElementById("toggle-theme").textContent = "🔆";
} else {
  document.getElementById("toggle-theme").textContent = "🌙";
}

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  document.getElementById("toggle-theme").textContent = isDark ? "🔆" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
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
  if (stop <= 0 || lev <= 0 || loss <= 0) return alert("Valores inválidos");

  const pos = loss / (stop / 100);
  const marg = pos / lev;

  document.getElementById("loss-display").textContent = loss.toFixed(2);
  document.getElementById("position-size").textContent = `$${pos.toFixed(2)}`;
  document.getElementById("margin-required").textContent = `$${marg.toFixed(
    2
  )}`;
  document.getElementById("results").style.display = "block";

  const entrada = {
    perdaMaxima: loss,
    stop,
    alavancagem: lev,
    tamanhoPosicao: pos,
    margem: marg,
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
  hist.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <strong>#${
      i + 1
    }</strong> - Perda Máxima: <strong>$${item.perdaMaxima.toFixed(
      2
    )}</strong><br>
    Stop: <strong>${item.stop}%</strong>, 
    Alavancagem: <strong>${item.alavancagem}x</strong><br>
    📊 Tamanho: <strong>$${item.tamanhoPosicao.toFixed(2)}</strong> |
    Margem: <strong>$${item.margem.toFixed(2)}</strong>
  `;
    ul.appendChild(li);
  });
}

document.getElementById("export-xlsx").addEventListener("click", () => {
  const hist = JSON.parse(localStorage.getItem("historico") || "[]");
  if (!hist.length) return alert("Nada para exportar");
  const ws = XLSX.utils.json_to_sheet(hist);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Histórico");
  XLSX.writeFile(wb, "historico-trade.xlsx");
});

document.getElementById("clear-history").addEventListener("click", () => {
  if (confirm("Deseja realmente apagar o histórico?")) {
    localStorage.removeItem("historico");
    atualizarLista([]);
  }
});

atualizarLista(JSON.parse(localStorage.getItem("historico") || "[]"));
