import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Generic JSON data API
  app.get("/api/data/:file", async (req, res) => {
    try {
      const filePath = path.join(__dirname, "src", "data", `${req.params.file}.json`);
      const data = await fs.readFile(filePath, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error(`Error reading ${req.params.file}.json:`, error);
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/data/:file", async (req, res) => {
    try {
      const filePath = path.join(__dirname, "src", "data", `${req.params.file}.json`);
      await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ status: "ok" });
    } catch (error) {
      console.error(`Error writing ${req.params.file}.json:`, error);
      res.status(500).json({ error: "Failed to write data" });
    }
  });

  // Mock Admin API Routes
  app.get("/api/dev/token", (req, res) => {
    res.send("mock-token-123");
  });

  app.get("/api/admin/database/health", (req, res) => {
    res.json({ status: "healthy", lastCheck: new Date().toISOString() });
  });

  app.post("/api/admin/database/mantenimiento", (req, res) => {
    setTimeout(() => {
      res.json({ success: true, message: "Mantenimiento completado exitosamente" });
    }, 1500);
  });

  app.get("/api/admin/backups", (req, res) => {
    res.json({
      backups: [
        { id: "1", date: new Date().toISOString(), size: 1024 * 1024 * 5, description: "Respaldo automático", type: "full" },
        { id: "2", date: new Date(Date.now() - 86400000).toISOString(), size: 1024 * 500, description: "Respaldo tabla usuarios", type: "table", table: "usuarios" }
      ]
    });
  });

  app.get("/api/admin/backups/drive", (req, res) => {
    res.json({
      backups: [
        { id: "d1", date: new Date().toISOString(), size: 1024 * 1024 * 10, description: "Respaldo Drive", type: "full" }
      ]
    });
  });

  app.post("/api/admin/backups/full", (req, res) => {
    setTimeout(() => {
      res.json({ success: true, message: "Respaldo completo creado exitosamente" });
    }, 2000);
  });

  app.post("/api/admin/backups/tabla", (req, res) => {
    setTimeout(() => {
      res.json({ success: true, message: `Respaldo de tabla ${req.body.nombreTabla} creado exitosamente` });
    }, 1000);
  });

  app.post("/api/admin/backups/config", (req, res) => {
    setTimeout(() => {
      res.json({ success: true, message: "Configuración de respaldos automáticos guardada" });
    }, 500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
