const express = require('express');
const cors = require('cors');
const { fetchIssues, updateIssue, fetchOrgMembers } = require('./github');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/issues', async (req, res) => {
  try {
    const issues = await fetchIssues();
    res.json(issues);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    const members = await fetchOrgMembers();
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/issues/:number', async (req, res) => {
  try {
    const updated = await updateIssue(req.params.number, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
