const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            require: true,
            lowercase: true,
            unique: true,
            trim: true,
            validate(value) {
                if(!validator.isEmail(value)) throw new Error(`Invalid Email Id: ${value}`);
            }
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if(!validator.isStrongPassword(value)) throw new Error(`Enter a Strong Password`);
            }
        },
        age: {
            type: Number,
            min: 18
        },
        gender: {
            type: String,
            validate(value) {
                if(!["male", "female", "others"].includes(value)){
                    throw new Error("Gender data is not valid");
                }
            }
        },
        about: {
            type: String,
            default: "This is default about user"
        },
        skills: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
);

userSchema.methods.getToken = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@sumit", {
        expiresIn: "1d",
    });
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const hassPassword = user.password;
    const isValidPassword = await bcrypt.compare(passwordInputByUser, hassPassword);
    return isValidPassword;
};

module.exports = mongoose.model("User", userSchema);
