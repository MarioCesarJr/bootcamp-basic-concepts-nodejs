const express = require('express');

const server = express();

server.use(express.json());

/**
 *  HTTP codes
 *  1xx: Informational
 *  2xx: Success ex. 200: SUCCESS, 201: CREATED
 *  3xx: Redirection ex. 301: MOVED PERMANENTLY, 302: MOVED
 *  4xx: Client error ex. 400: BAD REQUEST, 401: UNAUTHORIZED, 404: NOT FOUND
 */

let numberOfRequests = 0;

/**
 * Middlewares
 */
server.use((req, res, next) => {
  console.time('Request');

  console.log(`Method: ${req.method}; URL: ${req.url}`);
  next();

  console.timeEnd('Request');

  console.log('*******************');
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Number of requests ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

/**
 * Projects
 */
const projects = [];

/**
 * Create project
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return res.status('400').json({ error: 'Validation failed' });
  }

  const projectIdExists = projects.find(p => p.id === id);

  if (projectIdExists) {
    return res.status('400').json({ error: 'Project id already exists' });
  }

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

/**
 * List projects
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/**
 * Update project
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  if (!title) {
    return res.status('400').json({ error: 'Title is required' });
  }

  project.title = title;

  return res.json(project);
});

/**
 * Delete project
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.find(p => p.id === id);

  projects.splice(index, 1);

  return res.send();
});

/**
 * Create tasks
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3333);
