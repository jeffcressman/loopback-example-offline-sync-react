# loopback-example-offline-sync-react

> This repo reimplements [Loopback Example Offline Sync](https://github.com/strongloop/loopback-example-offline-sync/) using React instead of Angular. The React app is located in `client/reapp`. It uses [react-router](https://github.com/rackt/react-router) for routing and [reflux](https://github.com/spoike/refluxjs) implementation of Flux unidirectional data flow.

---

An example running LoopBack in the browser and server, demonstrating the
following features:

 - offline data access and synchronization

## Prerequisites

* Install StrongLoop cli `npm install -g strongloop`
* Install Node v5.0.0 via nvm
  * `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash`
  * nvm install 5.0.0

## Install and Run

0. You must have `node` and `git` installed. It's recommended to have `mongod`
   installed too, so that the data is preserved across application restarts.

1. Clone the repo.

2. `cd loopback-example-offline-sync-react`

3. `nvm use` - select version of Node specified in `.nvmrc`

4. `npm install` - install the root package dependencies.

5. `npm install grunt-cli -g` - skip if you have Grunt CLI already installed.

6. `npm install bower -g` - skip if you already have Bower installed.

7. `bower install` - install front-end scripts

8. Set a Postgres database as per defined in `server/datasource.json`

9. Run `slc arc` and migrate the Todo and Todo-Change models

10. Run the autoudpate script to migrate the Checkpoint model
    * `node bin/autoudpate.js`

11. `grunt serve` - build and run the entire project in development mode.

12. open `http://localhost:3000` - point a browser at the running application.


## Project layout

The project is composed from multiple components.

 - `common/models/` contains definition of models that are shared by both the server
  and the client.

 - `client/lbclient/` provides an isomorphic loopback client with offline synchronization.
  The client needs some client-only models for data synchronization. These
  models are defined in `client/lbclient/models/`.

 - `client/ngapp/` is a single-page AngularJS application scaffolded using `yo
  angular`, with a few modifications to make it work better in the full-stack
  project.

 - `server/` is the main HTTP server that brings together all other components.
  Also сontains the REST API server; it exposes the shared models via
  REST API.

## Build

This project uses [Grunt](http://gruntjs.com) for the build.

There are two major changes from the generic Gruntfile required for this
full-stack example:

 - `grunt serve` uses the `server/` component instead of `grunt connect`.

 - `lbclient` component provides a custom build script (`lbclient/build.js`)
   which runs `browserify` to produce a single js file to be used in the
   browser. The Gruntfile contains a custom task to run this build.

### Targets

 - `grunt serve` starts the application in development mode, watching for file changes
  and automatically reloading the application.
 - `grunt test` runs automated tests (only the front-end has tests at the
   moment).
 - `grunt build` creates the bundle for deploying to production.
 - `grunt serve:dist` starts the application serving the production bundle of the
   front-end SPA.
 - `grunt jshint` checks consistency of the coding style.

## Adding more features

#### Define a new shared model

The instructions assume the name of the new model is 'MyModel'.

 1. Create a file `models/my-model.json`, put the model definition there.
  Use `models/todo.json` as an example, see
  [loopback-boot docs](http://apidocs.strongloop.com/loopback-boot) for
  more details about the file format.

 2. (Optional) Add `models/my-model.js` and implement your custom model
  methods. See `models/todo.js` for an example.

 3. Add an entry to `rest/models.json` to configure the new model in the REST
  server:

    ```json
    {
      "MyModel": {
        "dataSource": "db"
      }
    }
    ```

 4. Define a client-only model to represent the remote server model in the
  client - create `lbclient/models/my-model.json` with the following content:

    ```json
    {
      "name": "RemoteMyModel",
      "base": "MyModel"
    }
    ```

 5. Add two entries to `lbclient/models.json` to configure the new models
  for the client:

    ```json
    {
      "MyModel": {
        "dataSource": "local"
      },
      "RemoteMyModel": {
        "dataSource": "remote"
      }
    }
    ```
