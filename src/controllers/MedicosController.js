import { pool } from "../config/database.js";
import { v2 as cloudinary } from "cloudinary";

export class MedicosController {
  //GET /medicos
  async index(req, res) {
    const [rows] = await pool.query(`
            SELECT
            id,
            nome,
            especialidade,
            crm,
            dias_atendimento,
            valor_consulta,
            foto_url,
            criado_em
            FROM medicos
            `);

    return res.json(rows);
  }

  //POST /medicos
  async store(req, res) {
    const {
      nome,
      especialidade,
      crm,
      dias_atendimento,
      valor_consulta,
      foto_url,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO medicos
            (nome,
            especialidade,
            crm,
            dias_atendimento,
            valor_consulta,
            foto_url) VALUES (?,?,?,?,?,?), NOW())`,
      [nome, especialidade, crm, dias_atendimento, valor_consulta, foto_url],
    );

    const [novo] = await pool.query(
      `
        SELECT * FROM medicos WHERE id = ?`,
      [result.insertId],
    );
    return res.status(201).json(novo[0]);
  }

  //DELETE /medicos
  async delete(req, res) {
    try {
      const { id } = req.params;

      //1. Buscar o medico para pegar a URL da imagem
      const [rows] = await pool.query(
        "SELECT foto_url FROM medicos WHERE id = ?",
        [id],
      );
      const medico = rows[0];

      if (!medico) {
        return res.status(404).json({ erro: "Médico não encontrado." });
      }

      // 2. Extrair o public_id da URL do Cloudinary para deletar lá
      // A URL costuma ser: .../v123456/nome_da_imagem.jpg
      if (medico.foto_url) {
        const partesUrl = medico.foto_url.split("/");
        const arquivoComExtensao = partesUrl[partesUrl.length - 1]; // "nome_da_imagem.jpg"
        const [publicId] = arquivoComExtensao.split("."); // "nome_da_imagem"

        // Remove a imagem do Cloudinary
        await cloudinary.uploader.destroy(publicId);
      }

      // 3. Deletar o registro no banco de dados
      await pool.query("DELETE FROM medicos WHERE id = ?", [id]);

      return res.json({ mensagem: "Médico e foto_url removidos com sucesso!" });

    } catch (error) {
      console.error("🔥 Erro ao deletar Médico:", error);
      return res.status(500).json({ erro: "Erro interno ao remover médico." });
    }
  }
}
