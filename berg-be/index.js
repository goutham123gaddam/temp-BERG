import App from "./app.js";

const PORT = process.env.PORT || 3000;

const server = new App({ mockAuth: false });
server.listen(PORT);
