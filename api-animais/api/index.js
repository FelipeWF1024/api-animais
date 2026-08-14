const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const ARQUIVO = path.join(__dirname, "..", "animais.json");

app.use(cors());
app.use(express.json());

let animais = JSON.parse(
    fs.readFileSync(ARQUIVO, "utf8")
);

function lerAnimais() {
    return animais;
}

function salvarAnimais(novosAnimais) {
    animais = novosAnimais;
}

app.get("/animais", (req, res) => {
    const animais = lerAnimais();

    res.json(animais);
});

app.get("/animais/:id", (req, res) => {
    const animais = lerAnimais();

    const animal = animais.find(
        (a) => a.id === req.params.id
    );

    if (!animal) {
        return res.status(404).json({
            mensagem: "Animal não encontrado"
        });
    }

    res.json(animal);
});

app.post("/animais", (req, res) => {
    const { id, tipo, raca, caracteristicas } = req.body;
    if (!id || !tipo || !raca || !caracteristicas) {
        return res.status(400).json({
            mensagem: "Todos os campos são obrigatórios"
        });
    }

    if (tipo !== "cachorro" && tipo !== "gato") {
        return res.status(400).json({
            mensagem: "O tipo deve ser 'cachorro' ou 'gato'"
        });
    }

    if (typeof raca !== "string" || raca.trim() === "") {
        return res.status(400).json({
            mensagem: "A raça deve ser um texto válido"
        });
    }

    if (
        typeof caracteristicas !== "string" ||
        caracteristicas.trim() === ""
    ) {
        return res.status(400).json({
            mensagem: "As características devem ser um texto válido"
        });
    }

    const animais = lerAnimais();

    const existe = animais.some((animal) => animal.id === String(id));

    if (existe) {
        return res.status(400).json({
            mensagem: "Já existe um animal com esse ID"
        });
    }

    const novoAnimal = {
        id: String(id),
        tipo: String(tipo),
        raca: raca.trim(),
        caracteristicas: caracteristicas.trim()
    };

    animais.push(novoAnimal);

    salvarAnimais(animais);

    res.status(201).json({
        mensagem: "Animal adicionado com sucesso",
        animal: novoAnimal
    });
});

app.put("/animais/:id", (req, res) => {
    const animais = lerAnimais();

    const indice = animais.findIndex(
        (animal) => animal.id === req.params.id
    );

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Animal não encontrado"
        });
    }

    const { tipo, raca, caracteristicas } = req.body;

    if (!tipo || !raca || !caracteristicas) {
        return res.status(400).json({
            mensagem: "Tipo, raça e características são obrigatórios"
        });
    }

    if (tipo !== "cachorro" && tipo !== "gato") {
        return res.status(400).json({
            mensagem: "O tipo deve ser 'cachorro' ou 'gato'"
        });
    }

    if (typeof raca !== "string" || raca.trim() === "") {
        return res.status(400).json({
            mensagem: "A raça deve ser um texto válido"
        });
    }

    if (
        typeof caracteristicas !== "string" ||
        caracteristicas.trim() === ""
    ) {
        return res.status(400).json({
            mensagem: "As características devem ser um texto válido"
        });
    }

    animais[indice] = {
        id: animais[indice].id,
        tipo: String(tipo),
        raca: raca.trim(),
        caracteristicas: caracteristicas.trim()
    };

    salvarAnimais(animais);

    res.json({
        mensagem: "Animal alterado com sucesso",
        animal: animais[indice]
    });
});


app.delete("/animais/:id", (req, res) => {
    const animais = lerAnimais();
    const indice = animais.findIndex(
        (animal) => animal.id === req.params.id
    );

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Animal não encontrado"
        });
    }

    const animalRemovido = animais.splice(indice, 1)[0];
    salvarAnimais(animais);
    res.json({
        mensagem: "Animal excluído com sucesso",
        animal: animalRemovido
    });
});

module.exports = app;