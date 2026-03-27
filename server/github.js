const { execSync } = require('child_process');
const axios = require('axios');

const REPO = 'optizmo/claude-plugin-marketplace-data-public';
const ORG = 'optizmo';

function getToken() {
  try {
    return execSync('gh auth token', { encoding: 'utf8' }).trim();
  } catch {
    throw new Error('Could not retrieve GitHub token. Run: gh auth login');
  }
}

function getHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    Accept: 'application/vnd.github.v3+json',
  };
}

function parseLabels(labels) {
  const names = labels.map((l) => l.name);
  return {
    team: names.includes('team:platform')
      ? 'platform'
      : names.includes('team:product')
      ? 'product'
      : null,
    priority: names.includes('priority:now')
      ? 'now'
      : names.includes('priority:later')
      ? 'later'
      : null,
    effort: names.includes('effort:large')
      ? 'large'
      : names.includes('effort:medium')
      ? 'medium'
      : names.includes('effort:small')
      ? 'small'
      : null,
    status: names.includes('status:in-progress') ? 'in-progress' : 'proposed',
    isWeeklyGoal: names.includes('weekly-goal'),
  };
}

function shapeIssue(issue) {
  const parsed = parseLabels(issue.labels);
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body || '',
    url: issue.html_url,
    status: issue.state === 'closed' ? 'done' : parsed.status,
    team: parsed.team,
    priority: parsed.priority,
    effort: parsed.effort,
    isWeeklyGoal: parsed.isWeeklyGoal,
    assignees: issue.assignees.map((a) => ({
      login: a.login,
      avatarUrl: a.avatar_url,
    })),
    labels: issue.labels.map((l) => l.name),
  };
}

async function fetchIssues() {
  const response = await axios.get(
    `https://api.github.com/repos/${REPO}/issues`,
    {
      params: { state: 'open', per_page: 100 },
      headers: getHeaders(),
    }
  );
  return response.data.map(shapeIssue);
}

async function updateIssue(number, { labels, assignees, state, body }) {
  const headers = getHeaders();
  const base = `https://api.github.com/repos/${REPO}/issues/${number}`;

  if (labels !== undefined) {
    await axios.put(`${base}/labels`, { labels }, { headers });
  }

  const bodyPatch = {};
  if (assignees !== undefined) bodyPatch.assignees = assignees;
  if (state !== undefined) bodyPatch.state = state;
  if (body !== undefined) bodyPatch.body = body;
  if (Object.keys(bodyPatch).length > 0) {
    await axios.patch(base, bodyPatch, { headers });
  }

  const { data } = await axios.get(base, { headers });
  return shapeIssue(data);
}

async function fetchDoneIssues() {
  const response = await axios.get(
    `https://api.github.com/repos/${REPO}/issues`,
    {
      params: { state: 'closed', per_page: 20 },
      headers: getHeaders(),
    }
  );
  return response.data.map(shapeIssue);
}

async function fetchOrgMembers() {
  const { data } = await axios.get(
    `https://api.github.com/orgs/${ORG}/members`,
    { params: { per_page: 100 }, headers: getHeaders() }
  );
  return data.map((m) => ({ login: m.login, avatarUrl: m.avatar_url }));
}

module.exports = { fetchIssues, fetchDoneIssues, updateIssue, fetchOrgMembers };
