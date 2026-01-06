import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Create database adapter (use absolute path so it works regardless of cwd)
const adapter = new JSONFile(path.join(__dirname, "database.json"));
const db = new Low(adapter, { results: [] });

// Initialize database with 10 students
async function initDB() {
  await db.read();
  db.data = db.data || { results: [] };

  // If database is empty, add 10 sample students
  if (db.data.results.length === 0) {
    for (let i = 1; i <= 10; i++) {
      db.data.results.push({
        roll: i,
        name: `Student ${i}`,
        marks: {
          tamil: Math.floor(Math.random() * 100),
          english: Math.floor(Math.random() * 100),
          maths: Math.floor(Math.random() * 100),
          science: Math.floor(Math.random() * 100),
          social: Math.floor(Math.random() * 100)
        }
      });
    }
    await db.write();
    console.log("✔ Database created with 10 sample students");
  } else {
    console.log("✔ Database loaded");
  }
}

initDB();

// API : Get result by roll number
app.get("/result/:roll", async (req, res) => {
  await db.read();
  const roll = parseInt(req.params.roll);

  const student = db.data.results.find((s) => s.roll === roll);

  if (student) {
    // Calculate total & result
    const total =
      student.marks.tamil +
      student.marks.english +
      student.marks.maths +
      student.marks.science +
      student.marks.social;

    const result = total >= 200 ? "PASS" : "FAIL";

    res.json({
      roll: student.roll,
      name: student.name,
      marks: student.marks,
      total: total,
      result: result
    });
  } else {
    res.json({ error: "Roll number not found" });
  }
});

// Start Server
app.listen(8080, () => {
  console.log("✔ Server running at http://localhost:8080");
});
