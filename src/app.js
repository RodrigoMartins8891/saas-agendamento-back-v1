import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import medicosRoutes from './routes/medicos.js';
import pacientesRoutes from "./routes/pacientes.js";
import agendamentosRoutes from "./routes/agendamentos.js";


dotenv.config();

const app = express();

app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json());

app.use('/medicos', medicosRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/agendamentos', agendamentosRoutes);
export default app;