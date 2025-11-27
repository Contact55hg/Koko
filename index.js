const express = require("express");
const app = express();
const stealth = require('puppeteer-extra-plugin-stealth');


const fs = require("fs");

const banJsonFile = require("./Banned.json");

const key = "@Bearer/KeyPass*AuthorizationConfidencionale;;;;Protected@KeystoreType=ProtectionASS@233988NSM"

const mongoAnticheat = require("./anticheat.json");










const banTimesDays = [
    4, 8, 23, 1, 80, 9, 10, 33, 59, 300, 23, 23, 23, 23, 10, 2, 4, 5, 6, 7, 99, 100
];

const bannedUsers = {
    
}

app.use(express.json());

let salas = {
    "sala_7768485": {
        players: 0,
        modifiers: [],
        data: {}
    }
};

app.listen(process.env.PORT | 3000, () => {
    console.log("Servidor rodando na porta " + process.env.PORT | 3000);
});

// ban user



// Criar sala
app.get("/create/:id", (req, res) => {
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
        data: {}
    };

    res.send({ ok: true, salaCriada: id, erro: null });

}
});

app.get("/BanCheck", (req, res) => {
    res.send(banJsonFile);
})

process.stdin.resume();

process.on("SIGINT", (code) => {
    fs.writeFileSync("Banned.json", JSON.stringify(bannedUsers, null, 2));
    fs.writeFileSync("salas.json", JSON.stringify(salas, null, 2));
    process.exit();
})

app.get("/Punish/", (req, res) => {
    var Authorization = req.get("Authorization");

    var json = req.query.data;

       var format = JSON.parse(decodeURIComponent(json));

       Authorization = key;

    if (Authorization == key){
       

       bannedUsers[format.uid] = {
        "UID": format.uid,
        "TIME": banTimesDays[Math.floor(Math.random() * banTimesDays.length)],
        "REASON": format.reason,
        "MODERATOR": format.moderator
       };

       fs.writeFileSync("Banned.json", JSON.stringify(bannedUsers, null, 4))

       res.send("Success");
    }else {
        res.send("Acesso negado");
    }
})

app.get("/sala", (req, res) => {
    let keys = Object.keys(salas)
    var choosedRoom = keys[Math.floor(Math.random() * Object.keys(salas).length)]
    if (choosedRoom != undefined)
    res.send(choosedRoom)
       else {
        res.send("Nenhuma sala encontrada");
       }
})

app.get("/Join/:id", (req, res) => {
    var rromID = req.params.id;
    if (Object.keys(salas).includes(rromID)){
        res.send({
            status: "OK"
        });
    }else {
        res.send({
            status: "FAIL"
        });
    }
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