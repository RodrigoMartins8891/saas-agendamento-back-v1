import express from "express";
import { repo } from "../repositories/PacientesRepository.js";
import uploadCloud from "../config/uploadCloud.js";

const router = express.Router();

// ───────── LISTAR TODOS OS PACIENTES ─────────
// URL: GET http://localhost:3001/pacientes/
router.get("/", async (req, res) => {
  try {
    const pacientes = await repo.listarDisponiveis();
    return res.json(pacientes);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Erro ao listar pacientes" });
  }
});

// ───────── BUSCAR UM PACIENTE POR ID ─────────

// URL: GET http://localhost:3001/pacientes/1
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await repo.buscarPacientePorId(id); 

    if (!paciente) {
      return res.status(404).json({ erro: "Paciente não encontrado" });
    }

    return res.json(paciente);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Erro no servidor ao buscar paciente" });
  }
});

// ───────── CADASTRAR PACIENTE ─────────
router.post("/", uploadCloud.single("foto_url"), async (req, res) => {
  try {
    const { nome, data_nascimento, telefone, plano_saude } = req.body;

    if (!nome || !data_nascimento || !req.file) {
      return res.status(400).json({
        erro: "Nome, data de nascimento e foto são obrigatórios",
      });
    }

    const foto_url = req.file.path;

    const [result] = await repo.criar({
      nome,
      data_nascimento,
      telefone,
      foto_url,
      plano_saude,
    });

    return res.status(201).json({
      id_paciente: result.insertId,
      mensagem: "Paciente cadastrado com sucesso!",
      foto_url,
    });
  } catch (e) {
    console.error("🔥 ERRO NO CADASTRO:", e);
    return res.status(500).json({
      erro: "Erro ao cadastrar paciente",
      detalhe: e.message,
    });
  }
});

// ───────── ALTERAR PLANO ─────────
router.patch("/:id/plano", async (req, res) => {
  try {
    const { id } = req.params;
    const { plano_saude } = req.body;

    const atualizado = await repo.atualizarPlano(id, plano_saude);

    if (!atualizado) {
      return res.status(404).json({ erro: "Paciente não encontrado" });
    }

    return res.json({ mensagem: "Plano de saúde atualizado com sucesso!" });
  } catch (e) {
    return res.status(500).json({ erro: "Erro ao atualizar plano" });
  }
});

// ───────── EXCLUIR ─────────
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const excluido = await repo.excluir(id);
    if (!excluido)
      return res.status(404).json({ erro: "Paciente não encontrado" });
    return res.json({ mensagem: "Paciente excluído com sucesso" });
  } catch (e) {
    return res.status(500).json({ erro: "Erro ao excluir paciente" });
  }
});

export default router;