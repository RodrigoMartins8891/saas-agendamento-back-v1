import { pool } from "../config/database.js";

export class MedicosRepository {
  async listarDisponiveis() {
    const [rows] = await pool.query(
      "SELECT id_medico, nome, especialidade, valor_consulta, dias_atendimento, foto_url FROM medicos",
    );
    return rows;
  }

  async buscarPorId(id) {
    const [rows] = await pool.query(
      "SELECT id_medico, nome, especialidade, crm, valor_consulta, dias_atendimento, foto_url FROM medicos WHERE id_medico = ?",
      [id]
    );
    return rows.length ? rows[0] : null;
  }

  async criar(dados) {
    const sql = `
      INSERT INTO medicos (nome, especialidade, crm, dias_atendimento, valor_consulta, foto_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      dados.nome,
      dados.especialidade,
      dados.crm,
      dados.dias_atendimento,
      dados.valor_consulta,
      dados.foto_url
    ];
    return await pool.query(sql, params);
  }

  async atualizar(id, { nome, especialidade, crm, dias_atendimento, valor_consulta }) {
    const [result] = await pool.query(
      `UPDATE medicos 
       SET nome = ?, especialidade = ?, crm = ?, dias_atendimento = ?, valor_consulta = ?
       WHERE id_medico = ?`,
      [nome, especialidade, crm, dias_atendimento, valor_consulta, id],
    );
    return result.affectedRows > 0;
  }

  async atualizarfoto_url(id, foto_url) {
    const [result] = await pool.query(
      `UPDATE medicos SET foto_url = ? WHERE id_medico = ?`,
      [foto_url, id]
    );
    return result.affectedRows > 0;
  }

  async excluir(id) {
    const [result] = await pool.query("DELETE FROM medicos WHERE id_medico = ?", [id]);
    return result.affectedRows > 0;
  }
}

// Exporta a instância para ser usada nas rotas
export const repo = new MedicosRepository();