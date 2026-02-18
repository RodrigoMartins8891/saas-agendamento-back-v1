import express from "express";
import { repo } from "../repositories/MedicosRepository.js";
import uploadCloud from "../config/uploadCloud.js";

const router = express.Router();

// ───────── LISTAR MEDICOS ─────────
router.get("/", async (req, res) => {
  try {
    const medicos = await repo.listarDisponiveis();
    return res.json(medicos);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "erro ao listar médicos" });
  }
});

// ───────── BUSCAR POR ID ─────────
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const medico = await repo.buscarPorId(id);
    if (!medico) return res.status(404).json({ erro: "médico não encontrado" });
    return res.json(medico);
  } catch (e) {
    return res.status(500).json({ erro: "erro ao buscar médico" });
  }
});

// ───────── CADASTRAR (POST) ─────────
router.post("/", uploadCloud.single("foto_url"), async (req, res) => {
  try {
    const { nome, especialidade, crm, dias_atendimento, valor_consulta } = req.body;
    if (!nome || !especialidade || !valor_consulta || !req.file) {
      return res.status(400).json({ erro: "Campos obrigatórios e foto são necessários" });
    }

    const foto_url = req.file.path;
    const [result] = await repo.criar({
      nome, especialidade, crm, dias_atendimento, 
      valor_consulta: Number(valor_consulta), foto_url
    });

    return res.status(201).json({ 
      id_medico: result.insertId, 
      mensagem: "Médico cadastrado com sucesso!",
      foto_url 
    });
  } catch (e) {
    return res.status(500).json({ erro: "erro ao cadastrar", detalhe: e.message });
  }
});

// ───────── ATUALIZAR DADOS (PUT) ─────────
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const atualizado = await repo.atualizar(id, req.body);
    if (!atualizado) return res.status(404).json({ erro: "médico não encontrado" });
    return res.json({ mensagem: "médico atualizado com sucesso" });
  } catch (e) {
    return res.status(500).json({ erro: "erro ao atualizar", detalhe: e.message });
  }
});

// ───────── ATUALIZAR FOTO (PUT) ─────────
router.put("/:id/foto_url", uploadCloud.single("foto_url"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ erro: "foto obrigatória" });
    
    const foto_url = req.file.path;
    const atualizado = await repo.atualizarfoto_url(id, foto_url);
    
    if (!atualizado) return res.status(404).json({ erro: "médico não encontrado" });
    return res.json({ mensagem: "foto atualizada", foto_url });
  } catch (e) {
    return res.status(500).json({ erro: "erro ao atualizar foto" });
  }
});

// ───────── EXCLUIR MEDICO (DELETE) ─────────
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const excluido = await repo.excluir(id);
    if (!excluido) return res.status(404).json({ erro: "médico não encontrado" });
    return res.json({ mensagem: "médico excluído com sucesso" });
  } catch (e) {
    return res.status(500).json({ erro: "erro ao excluir médico" });
  }
});

export default router;