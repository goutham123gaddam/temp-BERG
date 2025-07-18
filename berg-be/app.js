import express from "express";
import { supabaseAuthMiddleware } from "./middleware/supabase.middleware.js";
import { mockAuthMiddleware } from "./middleware/mockauth.middleware.js";
import apiRoutes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

class App {
  constructor(config = { mockAuth: false }) {
    /**
     * @type {import('express').Application}
     */
    this.app = express();
    this.config = config;

    this.setMiddleware();
    this.setRoutes();
    this.setErrorHandler();
  }

  setMiddleware() {
    this.app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://berg-annotation-interface.onrender.com",
        ],
        credentials: true,
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    if (this.config.mockAuth) {
      this.app.use(mockAuthMiddleware);
    } else {
      this.app.use(supabaseAuthMiddleware);
    }
  }

  setRoutes() {
    this.app.use("/api/v1", apiRoutes);
  }

  setErrorHandler() {
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    });
  }

  /**
   * @param {number} port - Port number to listen on.
   */
  listen(port) {
    this.app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}

export default App;
