/***
Client library: GeoMocker
Implementation specs: http://www.w3.org/TR/geolocation-API/
Dependency: socket.io
Usage:
    1. Include the following before any map related operations
        <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
        <script src="https://raw.githubusercontent.com/ghelobytes/geomocker/master/lib/geomocker.js"></script>

    2. Initialize by calling:
        GeoMocker.init({
            socket: { secured: true },
            server: 'https://localhost:3000'
        });
**/

GeoMocker = window.GeoMocker || {};

GeoMocker = function () {

    var socket;

    function initSocket(opts) {
        var server = opts.server || prompt('Geolocation Server','https://localhost:3000');
        socket = io.connect(server, opts.socket || {});
    }

    function initGeoApi() {
        var WATCH_ID = 1;

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
                if(!WATCH_ID) return;
                console.log('GeoMocker: watchPosition: ', data);
                success(data);
            };
            var error_handler = function(data) {
                if(!WATCH_ID) return;
                console.log('GeoMocker: watchPositionError: ', data);
                error(data);
            };
            getInitialPosition(success_handler, error_handler);
            socket.on('position_changed', success_handler);
            socket.on('accuracy_changed', success_handler);
            socket.on('error_raised', error_handler);

            WATCH_ID = 1;
            return WATCH_ID;
        };
        navigator.geolocation.clearWatch = function(id) {
            WATCH_ID = 0;
            return WATCH_ID;
            // return clearInterval(id);
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
