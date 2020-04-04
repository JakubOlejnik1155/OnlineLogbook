//@TODO change before production
const connection = {
    server: 'http://localhost:3000', //main API server running on this port
    mainSite: 'http://localhost:3001', //main frontend Site {do not remember why i passed it here XD}
    authServer: 'http://localhost:4000' //authorisation server running on this port
};
module.exports = connection;