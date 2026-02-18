import { pool } from "../config/database.js";

export class PacientesRepository {
  async listarDisponiveis() {
    const [rows] = await pool.query(
      "SELECT id_paciente, nome, data_nascimento, telefone, foto_url, plano_saude FROM pacientes",
    );
    return rows;
  }

  async criar(dados) {
    const sql = `
    INSERT INTO pacientes (nome, data_nascimento, telefone, foto_url, plano_saude)
    VALUES (?, ?, ?, ?, ?)
  `;
    const params = [
      dados.nome,
      dados.data_nascimento,
      dados.telefone,
      dados.foto_url,
      dados.plano_saude,
    ];
    return await pool.query(sql, params);
  }

  async buscarPacientePorId(id) {
    const sql = "SELECT * FROM pacientes WHERE id_paciente = ?";
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
}
  
  async atualizarPlano(id, plano_saude) {
    const [result] = await pool.query(
      "UPDATE pacientes SET plano_saude = ? WHERE id_paciente = ?",
      [plano_saude, id],
    );
    return result.affectedRows > 0;
  }

  async excluir(id) {
    const [result] = await pool.query(
      "DELETE FROM pacientes WHERE id_paciente = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}
export const repo = new PacientesRepository();
