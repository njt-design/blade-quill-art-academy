/**
 * Push this project to GitHub using a temporary SSH deploy key.
 *
 * Usage:
 *   node scripts/push-to-github.mjs [owner/repo] [branch]
 *
 * The Replit GitHub integration must be connected before running this script.
 * The @replit/connectors-sdk package is used to authenticate GitHub API calls.
 *
 * Arguments (optional – defaults are read from git or prompted):
 *   owner/repo  GitHub repository slug (e.g. "myuser/my-repo")
 *   branch      Remote branch to push to (default: "main")
 */

import { ReplitConnectors } from "@replit/connectors-sdk";
import { execSync, spawnSync } from "child_process";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { chmodSync } from "fs";
import path from "path";
import os from "os";

const connectors = new ReplitConnectors();

async function githubApi(endpoint, options = {}) {
  const res = await connectors.proxy("github", endpoint, {
    method: options.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    body: options.body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${endpoint} failed (${res.status}): ${text}`);
  }
  return res;
}

function run(cmd, opts = {}) {
  const result = spawnSync(cmd, { shell: true, encoding: "utf8", ...opts });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd}\n${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

async function getOrCreateRepo(owner, repo) {
  try {
    const res = await connectors.proxy("github", `/repos/${owner}/${repo}`, { method: "GET" });
    if (res.status === 404) {
      console.log(`Creating repository ${owner}/${repo}...`);
      const createRes = await githubApi("/user/repos", {
        method: "POST",
        body: JSON.stringify({
          name: repo,
          description: "Blade & Quill Art Academy - Full-stack web application",
          private: false,
          auto_init: false,
        }),
      });
      const created = await createRes.json();
      console.log("Created:", created.html_url);
      return created;
    }
    const existing = await res.json();
    console.log("Repository exists:", existing.html_url);
    return existing;
  } catch (e) {
    throw new Error(`Failed to get or create repository: ${e.message}`);
  }
}

async function setupDeployKey(owner, repo) {
  const keyPath = path.join(os.tmpdir(), `github-deploy-${repo}`);
  const pubKeyPath = `${keyPath}.pub`;

  // Generate SSH key pair
  console.log("Generating SSH deploy key...");
  run(`ssh-keygen -t ed25519 -C "replit-deploy-${repo}" -f "${keyPath}" -N ""`, {
    env: { ...process.env, HOME: os.homedir() },
  });

  const pubKey = readFileSync(pubKeyPath, "utf8").trim();

  // Check for existing deploy key with same title, remove if present
  const listRes = await connectors.proxy("github", `/repos/${owner}/${repo}/keys`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (listRes.ok) {
    const keys = await listRes.json();
    const existing = keys.find(k => k.title === `replit-deploy-${repo}`);
    if (existing) {
      console.log("Removing existing deploy key...");
      const delRes = await connectors.proxy("github", `/repos/${owner}/${repo}/keys/${existing.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!delRes.ok && delRes.status !== 204) {
        console.warn(`Warning: could not delete old deploy key (${delRes.status})`);
      }
    }
  }

  // Add new deploy key
  console.log("Adding deploy key to repository...");
  const addRes = await githubApi(`/repos/${owner}/${repo}/keys`, {
    method: "POST",
    body: JSON.stringify({
      title: `replit-deploy-${repo}`,
      key: pubKey,
      read_only: false,
    }),
  });
  const keyData = await addRes.json();
  console.log("Deploy key added (id:", keyData.id, ")");

  return { keyPath, keyId: keyData.id };
}

async function cleanupDeployKey(owner, repo, keyId) {
  try {
    const res = await connectors.proxy("github", `/repos/${owner}/${repo}/keys/${keyId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok || res.status === 204 || res.status === 404) {
      console.log("Deploy key removed from repository.");
    }
  } catch (e) {
    console.warn("Warning: could not remove deploy key:", e.message);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const repoSlug = args[0];
  const targetBranch = args[1] ?? "main";

  // Determine owner/repo
  let owner, repo;
  if (repoSlug && repoSlug.includes("/")) {
    [owner, repo] = repoSlug.split("/", 2);
  } else {
    // Detect from git remote if available
    const remotes = run("git remote -v 2>/dev/null || echo ''", {
      cwd: "/home/runner/workspace",
    });
    const githubMatch = remotes.match(/github\.com[:/]([^/\s]+)\/([^.\s]+)\.git/);
    if (githubMatch) {
      owner = githubMatch[1];
      repo = githubMatch[2];
      console.log(`Detected repository from git remote: ${owner}/${repo}`);
    } else {
      throw new Error(
        "Could not determine GitHub repository. Pass owner/repo as the first argument.\n" +
        "Usage: node scripts/push-to-github.mjs owner/repo [branch]"
      );
    }
  }

  console.log(`Target repository: ${owner}/${repo}, branch: ${targetBranch}`);

  // Ensure the repository exists
  await getOrCreateRepo(owner, repo);

  // Set up SSH deploy key
  const { keyPath, keyId } = await setupDeployKey(owner, repo);

  // Configure SSH for git
  const sshDir = path.join(os.homedir(), ".ssh");
  mkdirSync(sshDir, { recursive: true });
  chmodSync(sshDir, 0o700);
  chmodSync(keyPath, 0o600);

  const sshConfig = `Host github.com\n  IdentityFile ${keyPath}\n  StrictHostKeyChecking no\n  UserKnownHostsFile /dev/null\n`;
  writeFileSync(path.join(sshDir, "config"), sshConfig, { mode: 0o600 });

  const sshRemote = `git@github.com:${owner}/${repo}.git`;

  try {
    // Add or update the 'github' remote
    const remotes = run("git remote 2>/dev/null || echo ''", { cwd: "/home/runner/workspace" });
    if (remotes.split("\n").includes("github")) {
      run(`git remote set-url github "${sshRemote}"`, { cwd: "/home/runner/workspace" });
    } else {
      run(`git remote add github "${sshRemote}"`, { cwd: "/home/runner/workspace" });
    }

    // Verify SSH connection
    console.log("Testing SSH connection to GitHub...");
    const sshTest = spawnSync("ssh -T git@github.com 2>&1 || true", {
      shell: true,
      encoding: "utf8",
    });
    console.log("SSH result:", (sshTest.stdout + sshTest.stderr).trim().substring(0, 100));

    // Get local branch
    const localBranch = run("git rev-parse --abbrev-ref HEAD", { cwd: "/home/runner/workspace" });
    console.log(`Pushing ${localBranch} → ${targetBranch}...`);

    // Push (force only on initial push where remote branch has unrelated history)
    const pushResult = spawnSync(
      `git push github "${localBranch}:${targetBranch}"`,
      { shell: true, encoding: "utf8", cwd: "/home/runner/workspace" }
    );

    if (pushResult.status !== 0) {
      const errMsg = pushResult.stderr || pushResult.stdout || "";
      if (errMsg.includes("fetch first") || errMsg.includes("non-fast-forward")) {
        console.log("Remote has unrelated history (from API init). Forcing push...");
        run(`git push github "${localBranch}:${targetBranch}" --force`, { cwd: "/home/runner/workspace" });
      } else {
        throw new Error(`git push failed:\n${errMsg}`);
      }
    }

    console.log(`\nSuccess! Repository is live at: https://github.com/${owner}/${repo}`);
  } finally {
    // Always clean up the deploy key after use
    console.log("Cleaning up deploy key...");
    await cleanupDeployKey(owner, repo, keyId);
  }
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
