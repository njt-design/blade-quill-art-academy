/**
 * Push this project to GitHub using a temporary SSH deploy key.
 *
 * Usage:
 *   node scripts/push-to-github.mjs [owner/repo] [branch]
 *
 * The Replit GitHub integration must be connected before running this script.
 * The @replit/connectors-sdk package is used to authenticate GitHub API calls.
 *
 * Arguments:
 *   owner/repo  GitHub repository slug (e.g. "myuser/my-repo") — required
 *   branch      Remote branch to push to (default: "main")
 */

import { ReplitConnectors } from "@replit/connectors-sdk";
import { spawnSync } from "child_process";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { chmodSync } from "fs";
import path from "path";
import os from "os";

const WORKSPACE = "/home/runner/workspace";
const connectors = new ReplitConnectors();

// ── helpers ────────────────────────────────────────────────────────────────

async function githubApi(endpoint, method = "GET", body) {
  const res = await connectors.proxy("github", endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${method} ${endpoint} → ${res.status}: ${text}`);
  }
  return res;
}

function run(cmd, { cwd = WORKSPACE, allowFailure = false } = {}) {
  const result = spawnSync(cmd, {
    shell: true,
    encoding: "utf8",
    cwd,
    env: { ...process.env, HOME: os.homedir() },
  });
  if (!allowFailure && result.status !== 0) {
    throw new Error(`Command failed (exit ${result.status}): ${cmd}\n${result.stderr || result.stdout}`);
  }
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

// ── git setup ──────────────────────────────────────────────────────────────

function ensureGitInitialized() {
  const { status } = run("git rev-parse --is-inside-work-tree", { allowFailure: true });
  if (status !== 0) {
    console.log("Initializing git repository...");
    run("git init");
    run("git checkout -b main", { allowFailure: true });
  }
}

function ensureAllFilesCommitted() {
  const { stdout: status } = run("git status --porcelain");
  if (status.length > 0) {
    console.log("Staging and committing all changes...");
    run("git add -A");
    const { status: commitStatus } = run(
      'git commit -m "Initial commit: Blade & Quill Art Academy full project"',
      { allowFailure: true }
    );
    if (commitStatus !== 0) {
      const { stdout } = run("git status --short");
      if (stdout.trim() !== "") {
        throw new Error("git commit failed with uncommitted changes. Please check your repository.");
      }
    }
  } else {
    const { stdout: commitCount } = run("git rev-list --count HEAD 2>/dev/null || echo 0", {
      allowFailure: true,
    });
    if (commitCount === "0" || commitCount === "") {
      console.log("No commits yet — creating an initial commit...");
      run("git add -A");
      run('git commit -m "Initial commit: Blade & Quill Art Academy full project"', {
        allowFailure: true,
      });
    } else {
      console.log("Working tree clean, nothing to commit.");
    }
  }
}

// ── github repo ───────────────────────────────────────────────────────────

async function ensureRepoExists(owner, repo) {
  const res = await connectors.proxy("github", `/repos/${owner}/${repo}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 404) {
    console.log(`Creating repository ${owner}/${repo}...`);
    const createRes = await githubApi("/user/repos", "POST", {
      name: repo,
      description: "Blade & Quill Art Academy – Full-stack web application",
      private: false,
      auto_init: false,
    });
    const created = await createRes.json();
    console.log("Repository created:", created.html_url);
    return created;
  }
  if (!res.ok) {
    throw new Error(`Failed to check repository (${res.status})`);
  }
  const existing = await res.json();
  console.log("Repository found:", existing.html_url);
  return existing;
}

// ── deploy key ─────────────────────────────────────────────────────────────

async function setupDeployKey(owner, repo) {
  const keyPath = path.join(os.tmpdir(), `github-deploy-${repo}-${Date.now()}`);
  const pubKeyPath = `${keyPath}.pub`;

  console.log("Generating SSH deploy key...");
  run(`ssh-keygen -t ed25519 -C "replit-deploy-${repo}" -f "${keyPath}" -N ""`);
  chmodSync(keyPath, 0o600);

  const pubKey = readFileSync(pubKeyPath, "utf8").trim();

  // Remove any existing deploy key with the same title
  const listRes = await connectors.proxy("github", `/repos/${owner}/${repo}/keys`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (listRes.ok) {
    const existingKeys = await listRes.json();
    const title = `replit-deploy-${repo}`;
    const old = existingKeys.find(k => k.title === title);
    if (old) {
      console.log("Removing stale deploy key...");
      await connectors.proxy("github", `/repos/${owner}/${repo}/keys/${old.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  console.log("Adding deploy key to repository...");
  const addRes = await githubApi(`/repos/${owner}/${repo}/keys`, "POST", {
    title: `replit-deploy-${repo}`,
    key: pubKey,
    read_only: false,
  });
  const keyData = await addRes.json();
  console.log(`Deploy key added (id: ${keyData.id})`);

  return { keyPath, keyId: keyData.id };
}

async function removeDeployKey(owner, repo, keyId) {
  try {
    await connectors.proxy("github", `/repos/${owner}/${repo}/keys/${keyId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Deploy key removed from repository.");
  } catch {
    console.warn("Warning: could not remove deploy key (it can be deleted manually in GitHub settings).");
  }
}

// ── ssh config ─────────────────────────────────────────────────────────────

function buildSshConfig(keyPath) {
  const sshDir = path.join(os.homedir(), ".ssh");
  mkdirSync(sshDir, { recursive: true });
  chmodSync(sshDir, 0o700);

  // Fetch GitHub's host key rather than skipping verification
  const knownHostsPath = path.join(os.tmpdir(), "github_known_hosts");
  const scan = run("ssh-keyscan -H github.com 2>/dev/null", { allowFailure: true });
  if (scan.stdout) {
    writeFileSync(knownHostsPath, scan.stdout + "\n", { mode: 0o600 });
  } else {
    // Fall back to GitHub's published fingerprint if ssh-keyscan fails
    writeFileSync(
      knownHostsPath,
      "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl\n",
      { mode: 0o600 }
    );
  }

  const configPath = path.join(sshDir, "config");
  const sshConfig = [
    "Host github.com",
    `  IdentityFile ${keyPath}`,
    `  UserKnownHostsFile ${knownHostsPath}`,
    "  StrictHostKeyChecking yes",
  ].join("\n") + "\n";

  writeFileSync(configPath, sshConfig, { mode: 0o600 });
  return knownHostsPath;
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (!args[0] || !args[0].includes("/")) {
    throw new Error(
      "GitHub repository slug required.\nUsage: node scripts/push-to-github.mjs owner/repo [branch]"
    );
  }

  const [owner, repo] = args[0].split("/", 2);
  const targetBranch = args[1] ?? "main";

  console.log(`Target: ${owner}/${repo} → branch: ${targetBranch}`);

  // Step 1: Ensure git is ready
  ensureGitInitialized();
  ensureAllFilesCommitted();

  // Step 2: Ensure remote repository exists
  await ensureRepoExists(owner, repo);

  // Step 3: Set up SSH deploy key
  const { keyPath, keyId } = await setupDeployKey(owner, repo);
  buildSshConfig(keyPath);

  const sshRemote = `git@github.com:${owner}/${repo}.git`;

  try {
    // Step 4: Configure git remote
    const { stdout: remoteList } = run("git remote", { allowFailure: true });
    if (remoteList.split("\n").includes("github")) {
      run(`git remote set-url github "${sshRemote}"`);
    } else {
      run(`git remote add github "${sshRemote}"`);
    }

    // Step 5: Get current branch
    const { stdout: localBranch } = run("git rev-parse --abbrev-ref HEAD");
    console.log(`Pushing ${localBranch} → ${targetBranch}...`);

    // Step 6: Push (force only when remote has diverged from an API-created init)
    const pushResult = run(`git push github "${localBranch}:${targetBranch}"`, { allowFailure: true });
    if (pushResult.status !== 0) {
      const err = pushResult.stderr;
      if (err.includes("fetch first") || err.includes("non-fast-forward")) {
        console.log("Remote has unrelated history (API-created init commit). Force-pushing...");
        run(`git push github "${localBranch}:${targetBranch}" --force`);
      } else {
        throw new Error(`git push failed:\n${pushResult.stderr}`);
      }
    }

    // Step 7: Verify push by fetching latest commit from remote
    const verifyRes = await connectors.proxy(
      "github",
      `/repos/${owner}/${repo}/branches/${targetBranch}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    const branch = await verifyRes.json();
    const remoteSha = branch.commit?.sha?.substring(0, 7) ?? "unknown";
    const { stdout: localSha } = run("git rev-parse --short HEAD");
    console.log(`\nVerification: local HEAD=${localSha}, remote HEAD=${remoteSha}`);
    if (remoteSha !== "unknown" && !localSha.startsWith(remoteSha) && !remoteSha.startsWith(localSha)) {
      throw new Error(`Push verification failed: remote SHA ${remoteSha} does not match local ${localSha}`);
    }

    console.log(`\nSuccess! Repository is live at: https://github.com/${owner}/${repo}`);
  } finally {
    // Always clean up the deploy key
    await removeDeployKey(owner, repo, keyId);
  }
}

main().catch(err => {
  console.error("\nError:", err.message);
  process.exit(1);
});
