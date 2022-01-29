class block {
  constructor(index, hash, previous_hash, eq, timestamp, owner, eqa, valid, type, metadata) {
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