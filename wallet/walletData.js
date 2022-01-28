var data = require("./wallet.json");

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

function setup(name, age, birth_month, email) {
  data.address = hash(name + age + birth_month + email);
  return "Start complete";
}
