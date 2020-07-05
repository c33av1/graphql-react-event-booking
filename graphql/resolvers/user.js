const bcrypt = require("bcryptjs");

const User = require("../../models/user");

module.exports = {
    createUser: (args) => {
        const {
            userInput: { email, password },
        } = args;

        return User.findOne({ email })
            .then((user) => {
                if (user) {
                    throw new Error("User exists already.");
                }

                return bcrypt.hash(password, 12);
            })
            .then((hashedPassword) => {
                const user = new User({
                    email,
                    password: hashedPassword,
                });

                return user.save();
            })
            .then((result) => {
                console.log(result);
                return {...result._doc, password: null };
            })
            .catch((err) => {
                throw err;
            });
    },
};