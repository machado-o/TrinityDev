# Atualizações Pendentes — Documento de Requisitos SAV

Este arquivo lista as divergências encontradas entre o documento de requisitos atual
e o código implementado. Aplique cada item no `.docx` correspondente.

---

## 1. Agência

**Adicionar dois novos atributos** na seção de modelo/entidade Agência:

| Atributo | Tipo | Obrigatório | Padrão | Regra |
|---|---|---|---|---|
| `limiteDiasDesconto` | Inteiro | Sim | 7 | Mínimo 1. Define a partir de quantos dias de locação o desconto pode ser aplicado. |
| `percentualDesconto` | Decimal (5,2) | Sim | 10.00 | Entre 0 e 100. Percentual de desconto aplicado sobre o valor final da reserva. |

**Regra de negócio relacionada (Reserva — cálculo de desconto):**
O desconto só é aplicado se `quantidadeDias >= agencia.limiteDiasDesconto` **E** a agência de retirada tiver pelo menos 2 reservas com `status = 'Concluída'` no histórico.

---

## 2. Checkin

**Remover** o atributo `horarioCheckin: Time` — ele não existe no banco de dados.
O campo `dataCheckin` é do tipo `DateTime` (data + hora juntos) e já cobre essa informação.

**Corrigir** o tipo do atributo `cnhValidade`: era `String`, deve ser **`Date`** (somente data, sem hora).

| Situação | Atributo | Ação |
|---|---|---|
| Remover | `horarioCheckin: Time` | Campo não existe na implementação |
| Corrigir tipo | `dataCheckin: Date` → `dataCheckin: DateTime` | Inclui data e hora |
| Corrigir tipo | `cnhValidade: String` → `cnhValidade: Date` | Armazenado como DATEONLY |

---

## 3. Checkout

### Remover atributos inexistentes

| Atributo | Motivo |
|---|---|
| `horarioCheckout: Time` | Não existe — horário está embutido em `dataCheckout: DateTime` |
| `possuiAvarias: Boolean` | Não existe como campo — é derivado em tempo de execução via `checkout.avarias.length > 0` |

### Corrigir tipo e typo

| De | Para |
|---|---|
| `dataCheckout: Date` | `dataCheckout: DateTime` |
| `condicaoPaletas: String` | `condicaoPalhetas: String` *(erro de digitação no nome)* |

### Adicionar novos atributos

| Atributo | Tipo | Obrigatório | Padrão | Regra |
|---|---|---|---|---|
| `observacoes` | Text | Não | — | Até 1000 caracteres. Campo livre para observações do atendente. |
| `taxaInspecao` | Decimal (10,2) | Sim | 0.00 | Não pode ser negativo. Cobrada automaticamente (R$ 150,00) se o cliente acumulou mais de 3 avarias no histórico total de checkouts. |

---

## 4. Multa

### Adicionar novos atributos

| Atributo | Tipo | Obrigatório | Padrão | Regra |
|---|---|---|---|---|
| `descricao` | Text | Não | — | Até 1000 caracteres. Descrição da infração ou motivo da multa. |
| `status` | String (Enum) | Sim | `'Pendente'` | Valores possíveis: `'Pendente'` ou `'Paga'`. |

### Adicionar relacionamento com Reserva

Multa possui uma FK opcional para Reserva:

- **Cardinalidade:** `Multa (*)` → `Reserva (0..1)`
- A multa **pode** estar vinculada a uma reserva específica, mas não é obrigatório.
- Se a reserva for excluída, o campo `reservaId` na multa é definido como `NULL` (SET NULL).

**Regra de negócio relacionada (Checkin):**
O check-in é bloqueado se o cliente possuir qualquer multa com `status = 'Pendente'`.

---

## 5. Reserva

### Corrigir nome de atributo

| De | Para |
|---|---|
| `qtdDias: Integer` | `quantidadeDias: Integer` |

### Adicionar novo atributo

| Atributo | Tipo | Obrigatório | Padrão | Regra |
|---|---|---|---|---|
| `status` | String (Enum) | Sim | `'Pendente'` | Valores possíveis: `'Pendente'`, `'Confirmada'`, `'Cancelada'`, `'Concluída'`. |

**Ciclo de vida do status:**
```
Pendente → Confirmada (ao criar o Checkin)
         → Cancelada  (cancelamento manual)
Confirmada → Concluída (ao criar o Checkout)
```

---

## Resumo rápido de contagem de mudanças

| Entidade | Campos removidos | Campos adicionados | Campos corrigidos |
|---|---|---|---|
| Agencia | 0 | 2 | 0 |
| Checkin | 1 | 0 | 2 |
| Checkout | 2 | 2 | 2 |
| Multa | 0 | 2 | 0 |
| Reserva | 0 | 1 | 1 |
| **Total** | **3** | **7** | **5** |
