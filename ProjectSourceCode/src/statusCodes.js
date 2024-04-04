// statusCodes
// Used for readability purposes as well as unit testing.
// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// 1xx: informational response
// 2xx: success
// 3xx: redirection
// 4xx: client errors
// 5xx: server errors
// 6xx: Multi-sided errors
const statusCodes = {
    SUCCESSFUL_REGISTARTION: 201,
    SUCCESSFUL_LOGIN: 202,

    USERNAME_TOO_LARGE: 230,
    EMPTY_USERNAME: 231,
    EMPTY_PASSWORD: 232,
    USER_NOT_FOUND: 233,
    PASSWORD_DIDNT_MATCH: 234,
    USER_ALREADY_EXISTS: 235,

    FAILED_TO_ADD_USER: 512,
    BCRYPT_ERROR: 513,
    QUEURY_ERROR: 514,
}

module.exports = statusCodes