var cluster = require("cluster");
if (cluster.isMaster) {
    cluster.fork();
    require("./student-server.js");
} else {
    require("./corp-server.js");
}
