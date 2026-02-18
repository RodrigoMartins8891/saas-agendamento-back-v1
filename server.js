import 'dotenv/config'; // Carrega o .env automaticamente
import app from './src/app.js'; // A EXTENSÃO .js É OBRIGATÓRIA AQUI

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});