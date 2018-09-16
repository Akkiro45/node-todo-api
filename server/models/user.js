const mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: {
    type: String,
    trim: true,
    required: true,
    minlength: 3
  }
});

module.exports = {
  User
}
