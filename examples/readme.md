# Anger Samples

Checkout [benchmark.js](./benchmark.js) to see an example of this in use with an [example nes server](./server.js).

Note how the server is setup to handle response messages by assigning responses the id in the request.

The benchmark.js file is a simple benchmark against an example pub/sub server.

### Running

To run the server, run

```
node server.js
```

To run the benchmark while the server is running, run (in another terminal session)

```
node benchmark.js
```
