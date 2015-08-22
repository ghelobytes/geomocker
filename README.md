### What is GeoMocker?

Want to test that awesome web app that uses Geolocation API but you are too lazy to go out and about?

You're welcome =)

### How to use it?

1. Run the server: ``` $ node server.js ```
2. Take note of the server address (e.g. ```https://localhost:3000```)
3. Include ```socket.io-x.x.x.js``` and ```geomocker.js``` in your app:

    ```html
    <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
    <script src="https://raw.githubusercontent.com/ghelobytes/geomocker/master/lib/geomocker.js"></script>
    ```
4. Initialise inside your app:

    ```javascript
    GeoMocker.init({
        socket: { secured: true },
        server: 'https://localhost:3000' // server address
    });
```
5. Visit the server's map page (e.g. https://localhost:3000)
6. Open you web mapping app
7. Moving the marker @ server's map should also move the current position of the web mapping app

### How does it works?
GeoMocker overrides the browsers native ```navigation.geolocation```. Using ```socket.io```, ```getCurrentPosition``` and ```watchPosition``` is fed with location data coming from the server's map marker position.

### Parameters
- ```socket``` - define options for ```socket.io```
    - notable option is ```secured:true``` to allow ```https``` requests
- ```server``` - the URL of the geolocation server where to listen for position

### ToDo
1. Implement a "watch list" for ```watchPosition```
2. Implement ```clearWatch```


### Reference

- [Geolocation API implementation specs](http://www.w3.org/TR/geolocation-API/)
- [Socket.io](http://www.socket.io)
