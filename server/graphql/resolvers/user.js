const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    login: async({ email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User does not exists!");
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error("Password is incorrect!");
        }

        const token = jwt.sign({ userId: user.id, email },
            process.env.JWT_TOKEN_KEY, { expiresIn: "1h" }
        );

        return { userId: user.id, token, tokenExpiration: 1 };
    },
};