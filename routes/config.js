var config = {};
var userRoles = config.userRoles = {
    user: 1,     // ...001
    admin: 2     // ...010
};

config.accessLevels = {
    user: userRoles.user | userRoles.admin,                       // ...110
    admin: userRoles.admin                                        // ...100
};

module.exports = config;