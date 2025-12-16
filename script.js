// ========================
// CONVERSÕES
// ========================
const ALTURA = { baixo: 1, medio: 2, alto: 3 };
const PORTE = { magro: 1, grande: 2, medio: 3 };
const IDADE = { velho: 1, novo: 2, medio: 3 };

// ========================
// BASE DE JOGADORES
// ========================
const baseJogadores = [
    { nome: "João", altura: "medio", porte: "magro", idade: "novo", habilidade: 3 },
    { nome: "Martin", altura: "medio", porte: "magro", idade: "novo", habilidade: 4 },
    { nome: "Arthur", altura: "medio", porte: "magro", idade: "novo", habilidade: 4 },
    { nome: "Júlio", altura: "alto", porte: "magro", idade: "medio", habilidade: 5 },
    { nome: "Alex", altura: "alto", porte: "magro", idade: "novo", habilidade: 4 },
    { nome: "Fabinho", altura: "medio", porte: "medio", idade: "medio", habilidade: 5 },
    { nome: "Thales", altura: "alto", porte: "grande", idade: "novo", habilidade: 5 },
    { nome: "Dêniz", altura: "baixo", porte: "medio", idade: "medio", habilidade: 5 },
    { nome: "Felipe", altura: "alto", porte: "grande", idade: "medio", habilidade: 2 },
    { nome: "Mateus", altura: "medio", porte: "grande", idade: "medio", habilidade: 1 },
    { nome: "Iury", altura: "medio", porte: "medio", idade: "medio", habilidade: 5 },
    { nome: "Jonatas", altura: "alto", porte: "grande", idade: "medio", habilidade: 4 },
    { nome: "Luiz Holanda", altura: "alto", porte: "grande", idade: "velho", habilidade: 4 },
    { nome: "Iranildo", altura: "medio", porte: "medio", idade: "medio", habilidade: 3 },
    { nome: "Biu", altura: "medio", porte: "medio", idade: "velho", habilidade: 5 },
    { nome: "Hermes", altura: "medio", porte: "medio", idade: "velho", habilidade: 4 },
    { nome: "Eduardo", altura: "alto", porte: "medio", idade: "novo", habilidade: 4 },
    { nome: "Miguel", altura: "alto", porte: "magro", idade: "novo", habilidade: 4 },
    { nome: "Renato", altura: "alto", porte: "medio", idade: "velho", habilidade: 5 },
    { nome: "Sales", altura: "medio", porte: "grande", idade: "novo", habilidade: 4 },
    { nome: "Severino", altura: "baixo", porte: "medio", idade: "velho", habilidade: 5 },
    { nome: "Anderson", altura: "alto", porte: "medio", idade: "velho", habilidade: 4 },
    { nome: "Neto Lins", altura: "alto", porte: "grande", idade: "medio", habilidade: 4 },
    { nome: "Madson", altura: "medio", porte: "grande", idade: "velho", habilidade: 2 }
];

// ========================
// FUNÇÕES
// ========================
function calcularOverall(j) {
    return ALTURA[j.altura] + PORTE[j.porte] + IDADE[j.idade] + j.habilidade;
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function sortear() {
    const entrada = document.getElementById("jogadores").value;
    const numTimes = Number(document.getElementById("numTimes").value);
    const nomes = entrada.split(",").map(n => n.trim().toLowerCase());

    let jogadores = baseJogadores
        .filter(j => nomes.includes(j.nome.toLowerCase()))
        .map(j => ({ ...j, score: calcularOverall(j) }));

    if (jogadores.length === 0) return;

    const goleiros = jogadores.filter(j => j.nome === "Thales" || j.nome === "Dêniz");
    if (goleiros.length < 2) {
        alert("Thales e Dêniz precisam estar presentes");
        return;
    }

    const outros = jogadores.filter(j => j.nome !== "Thales" && j.nome !== "Dêniz");

    const basePorTime = Math.floor(outros.length / numTimes);
    const maxPorTime = basePorTime + 1;

    let melhor = null;
    let melhorDiff = Infinity;

    for (let t = 0; t < 800; t++) {
        let times = Array.from({ length: numTimes }, (_, i) => ({
            jogadores: [goleiros[i % 2].nome],
            soma: goleiros[i % 2].score
        }));

        shuffle(outros).sort((a, b) => b.score - a.score).forEach(j => {
            const validos = times.filter(t => t.jogadores.length < maxPorTime);
            if (!validos.length) return;
            const alvo = validos.reduce((a, b) => a.soma < b.soma ? a : b);
            alvo.jogadores.push(j.nome);
            alvo.soma += j.score;
        });

        const somas = times.map(t => t.soma);
        const diff = Math.max(...somas) - Math.min(...somas);

        if (diff < melhorDiff) {
            melhorDiff = diff;
            melhor = times;
        }
    }

    const usados = new Set(melhor.flatMap(t => t.jogadores));
    const sobrantes = jogadores.filter(j => !usados.has(j.nome));

    render(melhor, sobrantes);
}

function render(times, sobrantes) {
    const div = document.getElementById("resultado");
    div.innerHTML = "";

    times.forEach((t, i) => {
        div.innerHTML += `
        <div class="time">
            <strong>Time ${i + 1} (Total ${t.soma})</strong>
            <ul>${t.jogadores.map(j => `<li>${j}</li>`).join("")}</ul>
        </div>`;
    });

    if (sobrantes.length) {
        div.innerHTML += `
        <div class="time">
            <strong>Time Extra (${sobrantes.length})</strong>
            <ul>${sobrantes.map(j => `<li>${j.nome}</li>`).join("")}</ul>
        </div>`;
    }
}
