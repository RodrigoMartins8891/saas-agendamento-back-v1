import express from "express";
import repo from "../repositories/AgendamentosRepository.js";
import { pool } from "../config/database.js";

const router = express.Router();

// 1. Rota para LISTAR Agendamentos (Dashboard OU Agenda por Nome de Médico)
router.get("/", async (req, res) => {
  try {
    const { nomeMedico } = req.query; // Captura o ?nomeMedico= na URL

    let agendamentos;

    if (nomeMedico) {
      // Se vier o nome na URL, usa o novo método do repositório
      agendamentos = await repo.buscarAgendaPorNomeMedico(nomeMedico);
    } else {
      // Se não vier nome, lista todos para o Dashboard Admin
      agendamentos = await repo.listarTodos();
    }

    return res.status(200).json(agendamentos);
  } catch (e) {
    return res
      .status(500)
      .json({ erro: "Erro ao buscar agendamentos", detalhe: e.message });
  }
});
// 2. Rota para listar PACIENTES (Mudei o caminho para /pacientes para não dar conflito)
router.get("/pacientes", async (req, res) => {
  try {
    const pacientes = await repo.listarPacientes(); // Usando o novo nome da função
    return res.json(pacientes);
  } catch (e) {
    return res.status(500).json({ erro: "Erro ao buscar pacientes" });
  }
});

// 3. Rota para CRIAR agendamento buscando o valor do médico
router.post("/", async (req, res) => {
  const { id_medico, id_paciente, data_hora } = req.body;

  try {
    // Busca o valor da consulta
    const [medico] = await pool.query(
      "SELECT valor_consulta FROM medicos WHERE id_medico = ?",
      [id_medico],
    );

    if (medico.length === 0) {
      return res.status(404).json({ erro: "Médico não encontrado" });
    }

    const valorCobrado = medico[0].valor_consulta;

    const sql = `
      INSERT INTO agendamentos (id_medico, id_paciente, data_hora, status, valor_final) 
      VALUES (?, ?, ?, 'Pendente', ?)
    `;

    await pool.query(sql, [id_medico, id_paciente, data_hora, valorCobrado]);
    res.status(201).json({ mensagem: "Agendamento realizado com sucesso!" });
  } catch (e) {
    res
      .status(500)
      .json({ erro: "Erro ao criar agendamento", detalhe: e.message });
  }
});

// 4. Rota para buscar horários ocupados
router.get("/ocupados/:id_medico", async (req, res) => {
  const { id_medico } = req.params;
  try {
    const rows = await repo.buscarAgendaDoMedico(id_medico);
    return res.status(200).json(rows);
  } catch (e) {
    return res.status(500).json({ erro: "Erro ao buscar agenda" });
  }
});

// 5. Rota para ATUALIZAR STATUS
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE agendamentos SET status = ? WHERE id_agendamento = ?",
      [status, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    return res.status(200).json({ mensagem: "Status atualizado com sucesso!" });
  } catch (e) {
    return res.status(500).json({ erro: "Erro ao atualizar status" });
  }
});

export default router;
