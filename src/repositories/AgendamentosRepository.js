import { pool } from "../config/database.js";

class AgendamentosRepository {
  // 1. Busca todos os agendamentos para o Dashboard Admin
  async listarTodos() {
    const sql = `
      SELECT 
        a.id_agendamento,
        a.data_hora,
        a.status,
        a.valor_final,
        m.nome as medico_nome,
        m.especialidade,
        p.nome as paciente_nome,
        p.telefone as paciente_telefone,
        p.plano_saude
      FROM agendamentos a
      JOIN medicos m ON a.id_medico = m.id_medico
      JOIN pacientes p ON a.id_paciente = p.id_paciente
      ORDER BY a.data_hora DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  }

  // 2. Busca todos os detalhes dos pacientes
async listarPacientes() {
  const sql = `
    SELECT 
      id_paciente, 
      nome, 
      data_nascimento, 
      telefone, 
      foto_url, 
      plano_saude 
    FROM pacientes 
    ORDER BY nome ASC
  `;
  const [rows] = await pool.query(sql);
  return rows;
}
  
  // 3. Busca horários ocupados de um médico específico
  async buscarAgendaDoMedico(id_medico) {
    const sql = `
      SELECT data_hora 
      FROM agendamentos 
      WHERE id_medico = ? AND status != 'Cancelado'
    `;
    const [rows] = await pool.query(sql, [id_medico]);
    return rows;
  }
  
  // 4. Busca a agenda completa filtrando pelo NOME do médico
  async buscarAgendaPorNomeMedico(nomeMedico) {
    const sql = `
      SELECT 
        a.id_agendamento,
        a.data_hora,
        a.status,
        p.nome as paciente_nome,
        p.id_paciente
      FROM agendamentos a
      JOIN medicos m ON a.id_medico = m.id_medico
      JOIN pacientes p ON a.id_paciente = p.id_paciente
      WHERE m.nome = ? AND a.status != 'Cancelado'
      ORDER BY a.data_hora ASC
    `;
    const [rows] = await pool.query(sql, [nomeMedico]);
    return rows;
  }
}

export default new AgendamentosRepository();