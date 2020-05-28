//@TODO change before production
const connection = {
    server: 'https://onlinelogbookapi.pl', //main API server running on this port
    // server: 'http://localhost:3000', //main frontend Site {do not remember why i passed it here XD}
    mainSite: 'https://localhost:3001', //main frontend Site {do not remember why i passed it here XD}
    authServer: 'https://onlinelogbookapi.pl' //authorisation server running on this port
    // authServer: 'http://localhost:3000' //authorisation server running on this port
};
module.exports = connection;