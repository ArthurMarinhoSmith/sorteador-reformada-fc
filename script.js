import random

# ========================
# CONVERSÕES INTERNAS
# ========================
ALTURA = {"baixo": 1, "alto": 2, "medio": 3}
PORTE = {"magro": 1, "grande": 2, "medio": 3}
IDADE = {"velho": 1, "novo": 2, "medio": 3}
HABILIDADE ={ "1": 1, "2": 2, "3": 3, "4": 4, "5": 5}
# 1 passe / chute / desarme
# 2 marcação / posicionamento / finalização
# 3 visao de jogo / drible
# 4 velocidade / reflexo
# 5 Nunca vai ter 3 deles no mesmo time!


# ========================
# BASE DE JOGADORES
# ========================
base_jogadores = [
    { "nome": "João", "nota": 3 },
    { "nome": "Martin", "nota": 4 },
    { "nome": "Arthur", "nota": 5 },
    { "nome": "Júlio", "nota": 5 },
    { "nome": "Alex", "nota": 3 },
    { "nome": "Fabinho", "nota": 5 },
    { "nome": "Thales", "nota": 4 },
    { "nome": "Dêniz", "nota": 5 },
    { "nome": "Felipe", "nota": 2 },
    { "nome": "Mateus", "nota": 2 },
    { "nome": "Iury", "nota": 5 },
    { "nome": "Jonatas", "nota": 4 },
    { "nome": "Luiz Holanda", "nota": 4 },
    { "nome": "Iranildo", "nota": 2 },
    { "nome": "Biu", "nota": 5 },
    { "nome": "Hermes", "nota": 4 },
    { "nome": "Eduardo", "nota": 4 },
    { "nome": "Miguel", "nota": 2 },
    { "nome": "Renato", "nota": 5 },
    { "nome": "Sales", "nota": 3 },
    { "nome": "Severino", "nota": 4 },
    { "nome": "Anderson", "nota": 3 },
    { "nome": "Neto Lins", "nota": 2 },
    { "nome": "Madson", "nota": 3 },
    { "nome": "Thyago", "nota": 3 },
    { "nome": "Chris", "nota": 2 },
    { "nome": "Elias", "nota": 4 }
];

# ========================
# FUNÇÕES
# ========================

def calcular_overall(j):
    return j["nota"]

def montar_times_balanceados(jogadores, num_times, pessoas_por_time, goleiros_fixos):
    # Inicializa os times
    times = [{"jogadores": [], "soma": 0} for _ in range(num_times)]

    # Distribui goleiros fixos alternadamente (um por time, repetindo se necessário)
    for i in range(num_times):
        goleiro = goleiros_fixos[i % len(goleiros_fixos)]
        times[i]["jogadores"].append(goleiro["nome"])
        times[i]["soma"] += goleiro["_score"]

    nomes_goleiros = [g["nome"] for g in goleiros_fixos]
    outros_jogadores = [j for j in jogadores if j["nome"] not in nomes_goleiros]

    # Ordena jogadores do maior para o menor score
    outros_jogadores_sorted = sorted(outros_jogadores, key=lambda x: x["_score"], reverse=True)

    # Distribui jogadores tentando equilibrar
    for j in outros_jogadores_sorted:
        times_validos = [t for t in times if len(t["jogadores"]) < pessoas_por_time]
        if not times_validos:
            break
        # Coloca no time com menor soma
        time = min(times_validos, key=lambda t: t["soma"])
        time["jogadores"].append(j["nome"])
        time["soma"] += j["_score"]

    return times

def diferenca_times(times):
    somas = [t["soma"] for t in times]
    return max(somas) - min(somas)

def sortear_times(jogadores, num_times, nomes_goleiros):
    total_presentes = len(jogadores)

   



    # Calcula quantidade ideal de jogadores por time (sem contar goleiros fixos)


    # Define tamanho fixo para os times principais (goleiro + base_por_time)
    pessoas_por_time = base_por_time + 1

    # Monta os times principais
    melhor_times = None
    melhor_diff = float("inf")

    TENTATIVAS = 1000

    for _ in range(TENTATIVAS):
        random.shuffle(jogadores)
        times = montar_times_balanceados(jogadores, num_times, pessoas_por_time, nomes_goleiros)
        diff = diferenca_times(times)
        if diff < melhor_diff:
            melhor_diff = diff
            melhor_times = times

    # Verifica se sobraram jogadores
    jogadores_alocados = set(nome for time in melhor_times for nome in time["jogadores"])
    sobrantes = [j for j in jogadores if j["nome"] not in jogadores_alocados]

    return melhor_times, sobrantes

def mostrar_times(times, sobrantes):
    print("\n=== REFORMADA FC ===")
    for i, time in enumerate(times, start=1):
        print(f"\nTime {i} (Total: {time['soma']}) - Jogadores: {len(time['jogadores'])}")
        for nome in time["jogadores"]:
            print(f" - {nome}")

    if sobrantes:
        print(f"\n=== TIME EXTRA COM {len(sobrantes)} JOGADORES SOBRANDO ===")
        for j in sobrantes:
            print(f" - {j['nome']}")

# ========================
# MAIN LOOP
# ========================

entrada = input("Digite os nomes dos jogadores presentes, separados por vírgula:\n")
nomes_presentes = [nome.strip() for nome in entrada.split(",")]

jogadores = [j for j in base_jogadores if j["nome"].lower() in [n.lower() for n in nomes_presentes]]

if not jogadores:
    raise ValueError("Nenhum jogador válido foi selecionado.")

print(f"\nTotal de jogadores presentes: {len(jogadores)}\n")

num_times = int(input("Quantos times? "))

while True:
    try:
        times, sobrantes = sortear_times(jogadores, num_times, nomes_goleiros=)
        mostrar_times(times, sobrantes)
    except ValueError as e:
        print(f"Erro: {e}")
        break

    opcao = input("\nQuer sortear novamente? (s/n): ").strip().lower()
    if opcao != "s":
        print("=== REFORMADA FC ===")
        break

