const { createHash } = require("crypto");
const blockStructure = require("./blockStructure");

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

var getGenesisBlock = () => {
  return new blockStructure.block(
    0,
    hash("Genesis"),
    "0",
    "1+1",
    69,
    "Chain",
    2
  );
};
function random_eq() {
  var tokens_alg = ["*", "+", "-", "/", "^", "Math.sqrt(", ")"];

  var n = Math.floor(Math.random() * 25);

  var equationString = "";
  for (let index = 0; index < n; index++) {
    var nn = Math.floor(Math.random() * 6);
    if (nn == 5 || nn == 6) {
      equationString += tokens_alg[5];
      equationString += Math.floor(Math.random() * 10000);
      equationString += tokens_alg[6];
    } else {
      equationString += tokens_alg[nn];
      equationString += Math.floor(Math.random() * 10000);
    }
  }
  return equationString;
}
async function sendBlock(walletLocation, count, data) {
  for (let index = 0; index < count; index++) {
    var e = random_eq();
    blockchain.push(
      blockStructure.block(
        blockchain.length,
        hash(
          blockchain.length.toString() + blockchain[blockchain.length - 1].hash,
          new Date.UTC() / 1000,
          data
        ).toString(),
        blockchain[blockchain.length - 1].hash,
        e,
        new Date.UTC() / 1000,
        walletLocation,
        eval(e)
      )
    );
  }
}

var blockchain = [getGenesisBlock()];

async function validateBlock(blockIndex, answer, eqa, walletLocation) {
  if (blockchain.length < blockIndex) {
    return "Non-valid block";
  } else {
    if (eqa == answer) {
      if (
        blockchain[blockIndex].previous_hash == blockchain[blockIndex - 1].hash
      ) {
        if (blockchain.length - 1 !== blockIndex) {
          if (
            blockchain[blockIndex + 1].previous_hash ==
            blockchain[blockIndex].hash
          ) {
            sendBlock(walletLocation, 500);
            return "validated block";
          }
          sendBlock(walletLocation, 500);
          return "validated block";
        }
      } else {
        return "Non-valid equation";
      }
    }
  }
}

const express = require("express");
const app = express();
var cors = require("cors");
app.use(express.json());

app.use(cors());

app.listen(3000, () => console.log("Listening on port 3000"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Acces-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.post("/sendValidation", (req, res) => {
  var address_req = req.body.address;
  var equation_req = req.body.eq;
  var equation_answer_req = req.body.answer;
  var index_req = req.body.i;

  validateBlock(index_req, equation_answer_req, equation_req, address_req);
});

app.get("/getValidation", (req, res) => {
  var nnn = Math.floor(Math.random() * blockchain.length - 1);
  res.send({ i: nnn, eq: blockchain[nnn].eq });
});
