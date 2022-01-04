const bcrypt = require('bcrypt');

const hash = (plaintextPassword) => {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(plaintextPassword, salt, (errX, hashX) => {
      if (!errX) {
        return hashX;
      }
      return errX;
    });
  });
};

const compare = (plaintextPassword, hashed) => {
  bcrypt.compare(plaintextPassword, hashed, (err, result) => {
    // result == true
    if (!err) {
      return result;
    }
    return err;
  });
};

module.export = {
  hash,
  compare,
};
