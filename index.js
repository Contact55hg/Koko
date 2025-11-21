const express = require("express");
const app = express();

const key = "@Bearer/KeyPass*AuthorizationConfidencionale;;;;Protected@KeystoreType=ProtectionASS@233988NSM"

const mongoAnticheat = require("./anticheat.json");

app.use(express.json());

let salas = {
    "administrator": { players: 1, modifiers: [], data: [] }
};

app.listen(process.env.PORT | 3000, () => {
    console.log("Servidor rodando na porta 8080");
});

// Criar sala
app.get("/world/create/:id", (req, res) => {
    var id = req.params.id;

    var keyaccess = req.get("Authorization");

    if (keyaccess != key){
         res.send("Acesso negado, apenas o frontend, pode acessar essa pagina");
    }else {

    id = "sala_" + Math.floor(Math.random() * 9999999);

    if (!id) return res.status(400).send({ ok: false, salaCriada: null, erro: "INVALID" });

    if (salas[id]) {
        return res.status(400).send({ ok: false, salaCriada: null, erro: "EXISTS" });
    }

    salas[id] = {
        players: 0,
        modifiers: [],
        data: []
    };

    res.send({ ok: true, salaCriada: id, erro: null });

}
});

app.get("/sala", (req, res) => {
    let keys = Object.keys(salas)
    res.send(keys[Math.floor(Math.random() * Object.keys(salas).length)])
})

// Listar salas


app.get("/anticheat", (req, res) => {
    var chave = req.get("Authorization");

    if (chave == key){
       res.send(mongoAnticheat);
    }else {
        res.send("Acesso negado");
    }
    
})