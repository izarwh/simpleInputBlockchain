var app = require("express")();

var http = require("http").createServer(app);

var io = require("socket.io")(http);

const SHA256 = require("crypto-js/sha256");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

//ini pola aja, bebas
function createslt(index) {
    var pattern = Math.sqrt(Math.pow(Math.pow(index * index + index, 9), 8));

    var pattern_string = pattern.toString();

    var hash_pattern = SHA256(pattern_string).toString();

    return hash_pattern;
};

var previous_hash = SHA256('aselolee aweuuu').toString();

var index = 0;
io.on("connection", function (socket) {
    console.log("user Connected");
    socket.on("Keterangan", function (data) {
        index = index + 1;

        var date = new Date();

        var timestamp = date.toUTCString();

        var salt = createslt(index);

        //buat nonce
        var nonce = SHA256(data + salt).toString();

        var hash = SHA256(index.toString() + data + timestamp + nonce + previous_hash).toString();

        var block = {
            "index": index,
            "data": data,
            "timestamp": timestamp,
            "nonce": nonce,
            "hash": hash,
            "previous_hash": previous_hash
        };

        console.log("Data inserted : ", block);
        io.emit('clientevent', block);
        previous_hash = hash;
    });
});
http.listen(3000, function () {
    console.log("listening port 3000")
});
