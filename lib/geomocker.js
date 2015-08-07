/***
Client library: GeoMocker
Implementation specs: http://www.w3.org/TR/geolocation-API/
Dependency: socket.io
Usage:
    1. Include the following before any map related operations
        <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
        <script src="https://raw.githubusercontent.com/ghelobytes/geomocker/master/lib/geomocker.js"></script>

    2. Initialize by calling:
        navigator.geolocation.mock();
**/

GeoMocker = window.GeoMocker || {};

GeoMocker = function () {

    var socket;

    function initSocket(opts) {
        var server = prompt('Geolocation Server','http://localhost:3000');
        socket = io.connect(server, opts.socket || {});
    }

    function initGeoApi() {
        if (typeof navigator === "undefined" || navigator === null) {
            window.navigator = {};
        }
        if (navigator.geolocation === null) {
            window.navigator.geolocation = {};
        }

        navigator.geolocation.getCurrentPosition = function(success, error) {
            var success_handler = function(data) {
                console.log('GeoMocker: getCurrentPosition: ', data);
                success(data);
            };
            getInitialPosition(success_handler, error);
        };
        navigator.geolocation.watchPosition = function(success, error) {
            var success_handler = function(data) {
                console.log('GeoMocker: watchPosition: ', data);
                success(data);
            };
            getInitialPosition(success, error);
            socket.on('position_changed', success_handler);
            socket.on('accuracy_changed', success_handler);
            socket.on('error_raised', error);
        };
        navigator.geolocation.clearWatch = function(id) {
            return clearInterval(id);
        };

        function getInitialPosition(success, error) {
            socket.emit('request_initial_position', {});
            socket.on('set_initial_position', function(data) {
                success(data);
            });
        }
        console.log('GeoMocker: Geolocation API overidden');
    }

    return {
        init: function(opts, callback) {
            var opts = opts || {};
            initSocket(opts);
            initGeoApi(opts);
            if(callback)
                callback();
        }
    };

}();
