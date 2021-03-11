const api = require("./api");

const adminUpdateUser = function (id, data) { return api.request(`/admin/users/${id}`, { method: 'POST', data }) }

const adminApi = {
    adminUpdateUser
}

// export default api
module.exports = adminApi
