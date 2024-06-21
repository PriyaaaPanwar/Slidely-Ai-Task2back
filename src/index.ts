import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;
const dbPath = path.resolve(__dirname, 'data.json');

app.use(bodyParser.json());

// /ping endpoint
app.get('/ping', (req: Request, res: Response) => {
  res.send(true);
});

// /submit endpoint
app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).send('All fields are required');
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  db.submissions.push({ name, email, phone, github_link, stopwatch_time });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.send('Submission successful');
});

// /read endpoint
app.get('/read', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);
  
    if (isNaN(index)) {
      return res.status(400).send('Index must be a valid number');
    }
  
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  
    if (index < 0 || index >= db.submissions.length) {
      return res.status(400).send('Invalid index');
    }
   
    res.json(db.submissions[index]);

  });
  

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
