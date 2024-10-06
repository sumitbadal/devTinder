const validator = require("validator");

const validateEditProfile = (req) => {
    const allowedEditfields = [
        "firstName",
        "lastName",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every(fields => allowedEditfields.includes(fields));
    
    return isEditAllowed;
}

module.exports = {
    validateEditProfile,
}