// busca na tabela
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const tableRows = document.querySelectorAll('tbody tr');
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("tbody tr").forEach(tr => {

    tr.addEventListener("mouseenter", () => {
      tr.style.transition = "0.2s";
      tr.style.backgroundColor = "#eef7ff";
    });

    tr.addEventListener("mouseleave", () => {
      tr.style.backgroundColor = "";
    });

  });
});


// ordenar tabela (data, status e restaurar)
document.addEventListener("DOMContentLoaded", () => {
  const btnOrdenar = document.getElementById("btnOrdenar");
  const tbody = document.querySelector("table tbody");

  if (!btnOrdenar || !tbody) return;

  const linhasOriginais = Array.from(tbody.querySelectorAll("tr"))
    .map(tr => tr.cloneNode(true));

  let modoOrdenacao = 0;

  function animarTabela() {
    tbody.style.transition = "opacity 0.25s";
    tbody.style.opacity = "0.25";
    setTimeout(() => tbody.style.opacity = "1", 150);
  }

  function parseDataBR(dataStr) {
    const parts = dataStr.trim().split("/");
    if (parts.length !== 3) return new Date(0);
    const [dia, mes, ano] = parts;
    return new Date(`${ano}-${mes}-${dia}`);
  }

  function ordenarPorData(asc = true) {
    const linhas = Array.from(tbody.querySelectorAll("tr"));

    linhas.sort((a, b) => {
      const da = parseDataBR(a.children[4]?.innerText || "");
      const db = parseDataBR(b.children[4]?.innerText || "");
      return asc ? da - db : db - da;
    });

    tbody.innerHTML = "";
    linhas.forEach(l => tbody.appendChild(l));
    animarTabela();
  }

  function ordenarPorStatus() {
    const ordem = { "Concluída": 1, "Em andamento": 2, "Cancelada": 3 };
    const linhas = Array.from(tbody.querySelectorAll("tr"));

    linhas.sort((a, b) => {
      const aText = a.children[7]?.innerText.trim();
      const bText = b.children[7]?.innerText.trim();
      return (ordem[aText] || 99) - (ordem[bText] || 99);
    });

    tbody.innerHTML = "";
    linhas.forEach(l => tbody.appendChild(l));
    animarTabela();
  }

  function restaurarOriginal() {
    tbody.innerHTML = "";
    linhasOriginais.forEach(clone => tbody.appendChild(clone.cloneNode(true)));
    animarTabela();
  }

  btnOrdenar.innerHTML = '<i class="fas fa-sort mr-1"></i> Ordenar';

  btnOrdenar.addEventListener("click", () => {
    try {
      if (modoOrdenacao === 0) {
        ordenarPorData(true);
        btnOrdenar.innerHTML = '<i class="fas fa-sort"></i> Data ↑';
      } else if (modoOrdenacao === 1) {
        ordenarPorData(false);
        btnOrdenar.innerHTML = '<i class="fas fa-sort"></i> Data ↓';
      } else if (modoOrdenacao === 2) {
        ordenarPorStatus();
        btnOrdenar.innerHTML = '<i class="fas fa-sort"></i> Status';
      } else {
        restaurarOriginal();
        btnOrdenar.innerHTML = '<i class="fas fa-sort mr-1"></i> Ordenar';
      }

      modoOrdenacao = (modoOrdenacao + 1) % 4;

    } catch (err) {
      console.error("Erro ao ordenar tabela:", err);
    }
  });
});
