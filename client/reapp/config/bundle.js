window.CONFIG = {
  "routes": {
    "/": {
      "name": "home",
      "handler": "WelcomeView",
      "default": true
    },
    "/me": {
      "name": "user",
      "handler": "UserView"
    },
    "/my/todos/:status": {
      "name": "todoStatus",
      "handler": "TodoView"
    },
    "/my/todos": {
      "name": "todos",
      "handler": "TodoView"
    },
    "/login": {
      "name": "login",
      "handler": "LoginView"
    },
    "/register": {
      "name": "register",
      "handler": "RegisterView"
    },
    "/debug": {
      "name": "debug",
      "handler": "ChangeView"
    }
  }
};
