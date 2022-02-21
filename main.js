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
    this.previous_hash = previous_hash;
    this.eq = eq;
    this.timestamp = timestamp;
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
  console.log("Creating block " + walletLocation);
  for (let index = 0; index < count; index++) {
    var e = random_eq();
    console.log(blockchain);
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
    var to = { chain_: blockchain };
    fs.writeFileSync(fsPath, JSON.stringify(to));
  } catch (err) {
    console.error(err);
  }
}

var blockchain = [getGenesisBlock()];
try {
  var tbc = fs.readFileSync(fsPath);
  var ttbc = JSON.parse(tbc);
  if (ttbc.chain_ != null) {
    blockchain = ttbc.chain_;
  }
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
              sendBlock(
                walletLocation,
                1,
                "Block reward",
                "Transaction",
                JSON.stringify({
                  sender: "Chain",
                  reciever: walletLocation,
                  amount: 500,
                })
              );
              return "validated block";
            }
            sendBlock(
              walletLocation,
              1,
              "Block reward",
              "Transaction",
              JSON.stringify({
                sender: "Chain",
                reciever: walletLocation,
                amount: 500,
              })
            );
            return "validated block";
          } else {
            sendBlock(
              walletLocation,
              1,
              "Block reward",
              "Transaction",
              JSON.stringify({
                sender: "Chain",
                reciever: walletLocation,
                amount: 500,
              })
            );
            return "validated block";
          }
        } else {
          return "Non-valid equation";
        }
      }
    }
  }
  try {
    var to = { chain_: blockchain };
    fs.writeFileSync(fsPath, JSON.stringify(to));
  } catch (err) {
    console.error(err);
  }
}

const express = require("express");
const app = express();
var cors = require("cors");
app.use(express.json());

app.use(cors());

app.listen(3002, () => console.log("Listening on port 3002"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Acces-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});
app.post("/addAC", async (req, res) => {
  console.log(req.body);
  var ah = req.body.adress;
  await sendBlock(ah, 1, "Account", "Account creation", 0);
  res.json({ status: "AC created" });
});
app.post("/transfer", (req, res) => {
  var amount = req.body.a;
  var senderPW = req.body.sPW;
  var recieverPW = req.body.rPW;
  var senderEmail = req.body.sEmail;
  var recieverEmail = req.body.rEmail;
  var sAdress = hash(senderEmail + senderPW);
  var rAdress = hash(recieverEmail + recieverPW);
  var semiChain = [];
  blockchain.forEach((e) => {
    if (e.type == "Account creation") {
      semiChain.push(e);
    }
  });
  var sender = semiChain.find(({ owner }) => owner == sAdress);
  var semiChain2 = [];
  blockchain.forEach((e) => {
    if (e.type == "Account creation") {
      semiChain2.push(e);
    }
  });
  var reciever = semiChain.find(({ owner }) => owner == rAdress);
  if (sender.metadata >= amount) {
    sender.metadata -= amount;
    reciever.metadata += amount;
    res.json({ status: "Succes" });
  } else {
    res.json({
      status: "Failed",
      msg: "The sender does not have to the requested amount of coins.",
    });
  }
});
app.post("/getB", (req, res) => {
  console.log(blockchain);
  var semiChain = [];
  blockchain.forEach((e) => {
    if (e.type == "Account creation") {
      semiChain.push(e);
    }
  });
  console.log(req.body.adress);
  var bal = semiChain.find(({ owner }) => owner == req.body.adress);
  var NFTChain = [];
  blockchain.forEach((e) => {
    if (e.type == "NFT") {
      if (e.owner === req.body.address) {
        NFTChain.push(e);
      }
    }
  });
  if (bal == null) {
    res.json({ num: null, NFTS: null });
  } else {
    res.json({ num: bal.metadata, NFTS: NFTChain });
  }
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
  sendBlock(
    "Chain",
    1,
    "test block deployed on the chain",
    "test block",
    "TEST"
  );
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
