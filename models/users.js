const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

/*
    :: Passport Plugin ::
    This automatically implements hasing,
    salting, and generating username and
    password, when we use it as a plugin
    with our schema (e.g., userSchema).

    :: Passport Local Mongoose ::
    When we define the schema for User model,
    we only define the 'email', 'name' and other
    fields that we want, But we don't define the
    'password' and 'username' fields in Schema
    because this package automatically generate
    these field in database itself. We don't need
    to define these two fields.

    :: Passport Packages ::
    -> npm i passport
    -> npm i passport-local
    -> npm i passport-local-mongoose
*/
