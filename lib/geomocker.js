/***
Client library: GeoMocker
Implementation specs: http://www.w3.org/TR/geolocation-API/
Dependency: socket.io
Usage:
    1. Include the following before any map related operations
        <script src="lib/socket.io-1.2.0.js"></script>
        <script src="lib/geomocker.js"></script>

    2. Initialize by calling:
        navigator.geolocation.mock();
**/

(function() {

    var socket;
    var mock = {
        initialData: {
            coords: {}
        }
    };

    initSocket();
    initGeoApi();

    function initSocket(callback) {
        var server = prompt('Socket address','http://localhost:3000');
        socket = io.connect(server);

        socket.on('set_initial_position', function(data) {

            mock.initialData = data;
            if(callback) {
                callback();
            }
        });
    }

    function initGeoApi() {
        if (typeof navigator === "undefined" || navigator === null) {
            window.navigator = {};
        }
        if (navigator.geolocation === null) {
            window.navigator.geolocation = {};
        }

        navigator.geolocation.mock = function() {

            navigator.geolocation.getCurrentPosition = function(success, error) {
                getInitialPosition(success, error);
            };
            navigator.geolocation.watchPosition = function(success, error) {
                getInitialPosition(success, error);
                socket.on('position_changed', success);
                socket.on('accuracy_changed', success);
                socket.on('error_raised', error);
            };
            navigator.geolocation.clearWatch = function(id) {
                return clearInterval(id);
            };

            function getInitialPosition(success, error) {
                socket.emit('request_initial_position', {});
                socket.on('set_initial_position', function(data) {
                    if(data.error) {
                        if(error) error(data.error);
                    } else {
                        success(data);
                    }
                });
            }
            console.log('Geolocation API overidden');
        };

    }


})();
