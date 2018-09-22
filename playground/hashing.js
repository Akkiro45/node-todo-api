const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'rohit@45'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

const hashedPassword = '$2a$10$WCCj61j8w4wg2LD1fJ6xYeLa6PcqgY5C84I/9v2fSsK/3Q30xNYue';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

// let data = {
//   id: 1
// };
// const token = jwt.sign(data, 'extrakey');
// console.log(token);
// console.log('----------');
// const decoded = jwt.verify(token, 'extrakey');
// console.log(decoded);

// const msg = 'Hey i am user';
// const hash = SHA256(msg).toString();
//
// console.log(`msg: ${msg}`);
// console.log(`hash: ${hash}`);
//
// let data = {
//   id: 1
// }
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secreat').toString()
// }
//
// token.data.id = 2;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// const resultHash = SHA256(JSON.stringify(data) + 'secreat').toString();
//
// if(resultHash === token.hash) {
//   console.log('Data wasnt changed.');
// } else {
//   console.log('Data changed.');
// }
