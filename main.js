const { createHash } = require("crypto");
//const blockStructure = require("./blockStructure");
const fs = require("fs");
const fsPath = "./backup.json";
class block {
  constructor(
    index,
    hash,
    previous_hash,
    eq,
    timestamp,
    owner,
    eqa,
    valid,
    type,
    metadata
  ) {
    //Types: NFT, Balance, Transaction ** Metadata: file, amount, {sender,reciever,amount}
    this.index = index;
    this.hash = hash;
    this.previous_hash = previous_hash.toString();
    this.eq = eq;
    this.timestamp = timestamp.toString();
    this.owner = owner;
    this.EquationFinished = eqa;
    this.valid = valid;
    this.type = type;
    this.metadata = metadata;
  }
}

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

var getGenesisBlock = () => {
  return new block(
    0,
    hash("Genesis"),
    "0",
    "1+1",
    69,
    "Chain",
    2,
    true,
    "genesis",
    "Genesis block"
  );
};
function random_eq() {
  var tokens_alg = ["*", "+", "-", "/", "^", "+Math.sqrt(", ")"];

  var n = Math.floor(Math.random() * 25);
  n += Math.floor(Math.random() * 25);

  var equationString = Math.random().toString();
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
async function sendBlock(walletLocation, count, data, type, metadata) {
  for (let index = 0; index < count; index++) {
    var e = random_eq();
    blockchain.push(
      new block(
        blockchain.length,
        hash(
          blockchain.length.toString() + blockchain[blockchain.length - 1].hash,
          0,
          data
        ).toString(),
        blockchain[blockchain.length - 1].hash,
        e,
        0,
        walletLocation,
        eval(e),
        false,
        type,
        metadata
      )
    );
  }
  try {
    fs.writeFileSync(fsPath, JSON.stringify(blockchain));
  } catch (err) {
    console.error(err);
  }
}

var blockchain = [getGenesisBlock()];
try {
  blockchain = fs.readFileSync(fsPath, 'utf8');
} catch (err) {
  console.error(err);
}

async function validateBlock(blockIndex, answer, eqa, walletLocation) {
  if (blockchain[blockIndex].valid == false) {
    if (blockchain.length < blockIndex) {
      return "Non-valid block";
    } else {
      if (eqa == answer) {
        if (
          blockchain[blockIndex].previous_hash ==
          blockchain[blockIndex - 1].hash
        ) {
          if (blockchain.length - 1 !== blockIndex) {
            if (
              blockchain[blockIndex + 1].previous_hash ==
              blockchain[blockIndex].hash
            ) {
              sendBlock(walletLocation, 1, "Block reward", "Transaction", JSON.stringify({sender:"Chain",reciever: walletLocation, amount: 500}));
              return "validated block";
            }
            sendBlock(walletLocation, 1, "Block reward", "Transaction", JSON.stringify({sender:"Chain",reciever: walletLocation, amount: 500}));
            return "validated block";
          } else {
            sendBlock(walletLocation, 1, "Block reward", "Transaction", JSON.stringify({sender:"Chain",reciever: walletLocation, amount: 500}));
            return "validated block";
          }
        } else {
          return "Non-valid equation";
        }
      }
    }
  }
  try {
    fs.writeFileSync(fsPath, JSON.stringify(blockchain));
  } catch (err) {
    console.error(err);
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

  res.send(
    validateBlock(index_req, equation_answer_req, equation_req, address_req)
  );
});
app.get("/", (req, res) => {
  res.send("Running chain, size: " + JSON.stringify(blockchain));
});
app.get("/addBlock", (req, res) => {
  sendBlock("Chain", 1, "test block deployed on the chain", "test block", "TEST");
  res.send("Block deployed");
});
app.get("/getValidation", async (req, res) => {
  var alreadySent = false;
  blockchain.forEach((element) => {
    if (alreadySent == false) {
      if (element.valid == true) {
        return;
      } else {
        res.send(JSON.stringify({ i: element.index, eq: element.eq }));
        alreadySent = true;
      }
    }
    if (alreadySent == false) {
      res.send("No new blocks currently");
    }
  });
});
