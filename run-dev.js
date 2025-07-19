const fs = require('fs');
const path = require('path');
const toml = require('toml');
const dotenv = require('dotenv');
const concurrently = require('concurrently');

const loadEnv = (dirname) => {
  const envPath = path.join(dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    return Object.entries(envConfig).map(([key, val]) => `${key}=${val}`).join(' ');
  }
  return '';
}

// Load TOML config
function getCommandFromToml(dir) {
  const tomlPath = path.join(__dirname, dir, 'dev.toml');
  const content = fs.readFileSync(tomlPath, 'utf-8');
  const parsed = toml.parse(content);
  return { command: parsed.dev.command, cwd: path.join(__dirname, dir) };
}

const frontend = getCommandFromToml('frontend');
const backend = getCommandFromToml('backend');

// Prepend cross-env to the command
function withEnv(dir, cmd) {
  return `cross-env ${loadEnv(dir)} ${cmd}`;
}

// Run both concurrently
concurrently(
  [
    {
      command: withEnv('backend', backend.command),
      name: '🧠  BACKENDD',
      cwd: backend.cwd
    },
    {
      command: withEnv('frontend', frontend.command),
      name: '💻  FRONTEND',
      cwd: frontend.cwd
    }
  ],
  {
    prefix: 'name',
    restartTries: 1
  }
);
