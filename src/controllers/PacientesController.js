import { pool } from "../config/database.js";
import { v2 as cloudinary } from "cloudinary";

export class PacientesController {
  //GET /Pacientes
  async index(req, res) {
    const [rows] = await pool.query(`
            SELECT
            id_paciente,
            nome,
            data_nascimento,
            telefone,
            foto_url,
            criado_em, 
            plano_saude
            FROM pacientes
            `);

    return res.json(rows);
  }

  //POST /Pacientes
  async store(req, res) {
    const { nome, data_nascimento, telefone, foto_url, plano_saude } = req.body;

    const [result] = await pool.query(
      `INSERT INTO pacientes
            (nome,
            data_nascimento,
            telefone,
            foto_url,
            plano_saude) VALUES (?,?,?,?,?), NOW())`,
      [nome, data_nascimento, telefone, foto_url, plano_saude],
    );

    const [novo] = await pool.query(
      `
        SELECT * FROM pacientes WHERE id = ?`,
      [result.insertId],
    );
    return res.status(201).json(novo[0]);
  }

  //DELETE /PACIENTES
    async delete(req, res) {
      try {
        const { id } = req.params;
  
        //1. Buscar o pacientes para pegar a URL da imagem
        const [rows] = await pool.query(
          "SELECT foto_url FROM pacientes WHERE id = ?",
          [id],
        );
        const paciente = rows[0];
  
        if (!paciente) {
          return res.status(404).json({ erro: "Paciente não encontrado." });
        }
  
        // 2. Extrair o public_id da URL do Cloudinary para deletar lá
        // A URL costuma ser: .../v123456/nome_da_imagem.jpg
        if (paciente.foto_url) {
          const partesUrl = paciente.foto_url.split("/");
          const arquivoComExtensao = partesUrl[partesUrl.length - 1]; // "nome_da_imagem.jpg"
          const [publicId] = arquivoComExtensao.split("."); // "nome_da_imagem"
  
          // Remove a imagem do Cloudinary
          await cloudinary.uploader.destroy(publicId);
        }
  
        // 3. Deletar o registro no banco de dados
        await pool.query("DELETE FROM pacientes WHERE id = ?", [id]);
  
        return res.json({ mensagem: "Paciente e foto_url removidos com sucesso!" });
  
      } catch (error) {
        console.error("🔥 Erro ao deletar Paciente:", error);
        return res.status(500).json({ erro: "Erro interno ao remover paciente." });
      }
    }
}
