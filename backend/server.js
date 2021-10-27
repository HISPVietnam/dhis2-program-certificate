import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

import { certificate, verify } from "./certificate.js";
import { init } from "./utils.js";
const __dirname = path.resolve();
/////////////////////////////////////////////////////////////////////////////
const startApp = async () => {
  const app = express();
  const PORT = 8080;
  await init();
  app.use(cors());
  app.use(express.static(path.join(__dirname, "portal/assets")));
  app.use(bodyParser.text());
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "portal", "index.html"));
  });

  app.get("/api/certificate", certificate);
  app.post("/api/verify", verify);

  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
};
startApp();
/////////////////////////////////////////////////////////////////////////////
