const httpResponse = require("../helper/httpResponse");

const checkRoleAdmin = (req, res, next) => {
    const { role } = req.userInfo
    if (role !== 'admin') return httpResponse(res, { status: 401, message: "Can't Access" });
    next();
};

module.exports = { checkRoleAdmin };