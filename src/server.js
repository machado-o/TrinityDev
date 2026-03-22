import express from "express";

const app = express();

// 1. Criamos uma rota básica para testar no navegador
app.get("/", (req, res) => {
  res.send("Fala chefe! O servidor Node está rodando liso no Docker!");
});

app.listen(3000, () => {
  console.log("🚀 Servidor voando na porta 3000!");
});