const {request} = require("./api");

const adminUpdateUser = function (id, data) { return request(`/admin/users/${id}`, { method: 'POST', data }) }

const adminApi = {
    adminUpdateUser
}

// export default api
module.exports = adminApi
