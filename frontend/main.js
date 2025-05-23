const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const valoresOriginais = {};

document.querySelectorAll(".editar-btn").forEach(botao => {
  botao.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const linha = e.target.closest("tr");

    const spanNome = linha.querySelector(`span.nome[data-id="${id}"]`);
    const spanDesc = linha.querySelector(`span.descricao[data-id="${id}"]`);

    if (!spanNome || !spanDesc) return;

    const valorNome = spanNome.textContent;
    const valorDesc = spanDesc.textContent;
    valoresOriginais[id] = { nome: valorNome, descricao: valorDesc };

    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.value = valorNome;
    inputNome.className = "nome form-control";
    inputNome.dataset.id = id;

    const inputDesc = document.createElement("input");
    inputDesc.type = "text";
    inputDesc.value = valorDesc;
    inputDesc.className = "descricao form-control";
    inputDesc.dataset.id = id;

    const salvarBtn = linha.querySelector(`.salvar-btn[data-id="${id}"]`);

    const toggleSalvar = () => {
      const nomeAlterado = inputNome.value !== valorNome;
      const descAlterado = inputDesc.value !== valorDesc;
      salvarBtn.style.display = (nomeAlterado || descAlterado) ? "inline-block" : "none";
    };

    inputNome.addEventListener("input", toggleSalvar);
    inputDesc.addEventListener("input", toggleSalvar);

    const focusoutHandler = function(e) {
      if (!linha.contains(e.relatedTarget)) {
        if (salvarBtn.style.display === "none") {
          const novoSpanNome = document.createElement("span");
          novoSpanNome.className = "nome";
          novoSpanNome.dataset.id = id;
          novoSpanNome.textContent = inputNome.value;

          const novoSpanDesc = document.createElement("span");
          novoSpanDesc.className = "descricao";
          novoSpanDesc.dataset.id = id;
          novoSpanDesc.textContent = inputDesc.value;

          inputNome.replaceWith(novoSpanNome);
          inputDesc.replaceWith(novoSpanDesc);

          linha.removeEventListener("focusout", focusoutHandler);
        }
      }
    };
    linha.addEventListener("focusout", focusoutHandler);

    spanNome.replaceWith(inputNome);
    spanDesc.replaceWith(inputDesc);

    inputNome.focus();
  });
});

document.querySelectorAll(".salvar-btn").forEach(botao => {
  botao.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    const linha = e.target.closest("tr");
    const inputNome = linha.querySelector(`input.nome[data-id="${id}"]`);
    const inputDesc = linha.querySelector(`input.descricao[data-id="${id}"]`);
    const novoNome = inputNome.value;
    const novaDescricao = inputDesc.value;
    const original = valoresOriginais[id];

    if (novoNome === original.nome && novaDescricao === original.descricao) return;

    try {
      const res = await fetch(`/tarefas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken
        },
        body: JSON.stringify({ nome: novoNome, descricao: novaDescricao })
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      const spanNome = document.createElement("span");
      spanNome.classList.add("nome");
      spanNome.dataset.id = id;
      spanNome.textContent = novoNome;

      const spanDesc = document.createElement("span");
      spanDesc.classList.add("descricao");
      spanDesc.dataset.id = id;
      spanDesc.textContent = novaDescricao;

      inputNome.replaceWith(spanNome);
      inputDesc.replaceWith(spanDesc);
      e.target.style.display = "none";
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  });
});

document.querySelectorAll(".delete-btn").forEach(botao => {
  botao.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    const linha = e.target.closest("tr");

    try {
      const res = await fetch(`/tarefas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken
        }
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      linha.remove()
    } catch (err) {
      alert("Erro ao deletar: " + err.message);
    }
  });
});
