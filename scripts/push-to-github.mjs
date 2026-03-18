/**
 * Push this project to GitHub using a temporary SSH deploy key.
 *
 * Usage:
 *   node scripts/push-to-github.mjs owner/repo [branch]
 *
 * The Replit GitHub integration must be connected before running this script.
 * Requires: @replit/connectors-sdk (installed in workspace root).
 *
 * Arguments:
 *   owner/repo  GitHub repository slug — required (e.g. "myuser/my-repo")
 *   branch      Remote branch to push to — default: "main"
 */

import { ReplitConnectors } from "@replit/connectors-sdk";
import { spawnSync } from "child_process";
import { writeFileSync, readFileSync, mkdirSync, chmodSync } from "fs";
import path from "path";
import os from "os";

const WORKSPACE = "/home/runner/workspace";
const connectors = new ReplitConnectors();

// ── shell helpers ─────────────────────────────────────────────────────────

/**
 * Run a command using an args array to prevent shell injection.
 * @param {string} cmd
 * @param {string[]} args
 * @param {{ cwd?: string, allowFailure?: boolean }} opts
 */
function run(cmd, args, { cwd = WORKSPACE, allowFailure = false } = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    cwd,
    env: { ...process.env, HOME: os.homedir() },
  });
  if (!allowFailure && result.status !== 0) {
    throw new Error(
      `Command failed (exit ${result.status}): ${cmd} ${args.join(" ")}\n` +
        (result.stderr || result.stdout)
    );
  }
  return { stdout: (result.stdout || "").trim(), stderr: (result.stderr || "").trim(), status: result.status };
}

// ── GitHub API helper ─────────────────────────────────────────────────────

async function githubApi(endpoint, method = "GET", body) {
  const res = await connectors.proxy("github", endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${method} ${endpoint} → ${res.status}: ${text}`);
  }
  return res;
}

// ── validate slug ─────────────────────────────────────────────────────────

function validateSlug(owner, repo) {
  const nameRe = /^[a-zA-Z0-9_.-]+$/;
  if (!nameRe.test(owner)) throw new Error(`Invalid owner name: ${owner}`);
  if (!nameRe.test(repo)) throw new Error(`Invalid repo name: ${repo}`);
}

function validateBranch(branch) {
  if (!/^[a-zA-Z0-9_./\-]+$/.test(branch)) throw new Error(`Invalid branch name: ${branch}`);
}

// ── git initialization ────────────────────────────────────────────────────

function ensureGitInitialized() {
  const { status } = run("git", ["rev-parse", "--is-inside-work-tree"], { allowFailure: true });
  if (status !== 0) {
    console.log("Initializing git repository...");
    run("git", ["init"]);
    // Try to set default branch to main; ignore error on older git
    run("git", ["checkout", "-b", "main"], { allowFailure: true });
  }
}

function ensureAllFilesCommitted() {
  const { stdout: statusOut } = run("git", ["status", "--porcelain"]);
  if (statusOut.length > 0) {
    console.log("Uncommitted changes detected — staging and committing all files...");
    run("git", ["add", "-A"]);
    const { status: commitStatus, stderr } = run(
      "git",
      ["commit", "-m", "Initial commit: Blade & Quill Art Academy full project"],
      { allowFailure: true }
    );
    if (commitStatus !== 0 && !stderr.includes("nothing to commit")) {
      throw new Error(`git commit failed:\n${stderr}`);
    }
  } else {
    // Check if there's at least one commit
    const { status: logStatus } = run("git", ["rev-parse", "HEAD"], { allowFailure: true });
    if (logStatus !== 0) {
      console.log("No commits yet — creating initial commit...");
      run("git", ["add", "-A"]);
      run("git", ["commit", "-m", "Initial commit: Blade & Quill Art Academy full project"]);
    } else {
      console.log("Working tree clean.");
    }
  }
}

// ── GitHub repository ─────────────────────────────────────────────────────

async function ensureRepoExists(owner, repo) {
  const checkRes = await connectors.proxy("github", `/repos/${owner}/${repo}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (checkRes.status === 200) {
    const existing = await checkRes.json();
    console.log("Repository found:", existing.html_url);
    return existing;
  }

  if (checkRes.status !== 404) {
    const text = await checkRes.text();
    throw new Error(`Failed to check repository (${checkRes.status}): ${text}`);
  }

  // Determine whether owner is a user or an org
  const meRes = await connectors.proxy("github", "/user", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const me = await meRes.json();
  const isPersonalRepo = me.login.toLowerCase() === owner.toLowerCase();

  const createEndpoint = isPersonalRepo ? "/user/repos" : `/orgs/${owner}/repos`;
  console.log(`Creating repository via ${createEndpoint}...`);
  const createRes = await githubApi(createEndpoint, "POST", {
    name: repo,
    description: "Blade & Quill Art Academy – Full-stack web application",
    private: false,
    auto_init: false,
  });
  const created = await createRes.json();
  console.log("Repository created:", created.html_url);
  return created;
}

// ── SSH deploy key ────────────────────────────────────────────────────────

async function setupDeployKey(owner, repo) {
  const keyPath = path.join(os.tmpdir(), `deploy-${repo}-${Date.now()}`);
  const pubKeyPath = `${keyPath}.pub`;

  console.log("Generating SSH deploy key...");
  run("ssh-keygen", ["-t", "ed25519", "-C", `replit-deploy-${repo}`, "-f", keyPath, "-N", ""], {
    cwd: os.tmpdir(),
  });
  chmodSync(keyPath, 0o600);

  const pubKey = readFileSync(pubKeyPath, "utf8").trim();
  const title = `replit-deploy-${repo}`;

  // Remove stale key with same title if present
  const listRes = await connectors.proxy("github", `/repos/${owner}/${repo}/keys`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (listRes.ok) {
    const keys = await listRes.json();
    const stale = keys.find(k => k.title === title);
    if (stale) {
      console.log("Removing stale deploy key...");
      await connectors.proxy("github", `/repos/${owner}/${repo}/keys/${stale.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  console.log("Adding deploy key to repository...");
  const addRes = await githubApi(`/repos/${owner}/${repo}/keys`, "POST", {
    title,
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
    console.log("Deploy key removed.");
  } catch {
    console.warn("Could not remove deploy key — delete it manually in GitHub repository settings.");
  }
}

// ── SSH config ────────────────────────────────────────────────────────────

function configureSsh(keyPath) {
  const sshDir = path.join(os.homedir(), ".ssh");
  mkdirSync(sshDir, { recursive: true });
  chmodSync(sshDir, 0o700);

  const knownHostsPath = path.join(os.tmpdir(), "github_known_hosts");

  // Fetch GitHub's host keys to verify identity (avoids MITM)
  const { stdout: scanned, status } = run("ssh-keyscan", ["-H", "github.com"], {
    cwd: os.tmpdir(),
    allowFailure: true,
  });
  if (status === 0 && scanned) {
    writeFileSync(knownHostsPath, scanned + "\n", { mode: 0o600 });
  } else {
    // GitHub's published ED25519 host key as fallback
    writeFileSync(
      knownHostsPath,
      "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl\n",
      { mode: 0o600 }
    );
  }

  const sshConfigPath = path.join(sshDir, "config");
  const sshConfig = [
    "Host github.com",
    `  IdentityFile ${keyPath}`,
    `  UserKnownHostsFile ${knownHostsPath}`,
    "  StrictHostKeyChecking yes",
    "",
  ].join("\n");
  writeFileSync(sshConfigPath, sshConfig, { mode: 0o600 });
}

// ── main ──────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (!args[0] || !args[0].includes("/")) {
    throw new Error(
      "GitHub repository slug required.\n" +
        "Usage: node scripts/push-to-github.mjs owner/repo [branch]"
    );
  }

  const [owner, repo] = args[0].split("/", 2);
  const targetBranch = args[1] ?? "main";

  validateSlug(owner, repo);
  validateBranch(targetBranch);

  console.log(`Target: ${owner}/${repo} → branch: ${targetBranch}`);

  // Step 1: Ensure git repo is initialized and all files are committed
  ensureGitInitialized();
  ensureAllFilesCommitted();

  // Step 2: Ensure remote repository exists
  await ensureRepoExists(owner, repo);

  // Step 3: Set up temporary SSH deploy key
  const { keyPath, keyId } = await setupDeployKey(owner, repo);
  configureSsh(keyPath);

  const sshUrl = `git@github.com:${owner}/${repo}.git`;

  try {
    // Step 4: Set 'origin' to the GitHub repository
    const { stdout: remoteList } = run("git", ["remote"], { allowFailure: true });
    const remotes = remoteList.split("\n").filter(Boolean);
    if (remotes.includes("origin")) {
      run("git", ["remote", "set-url", "origin", sshUrl]);
    } else {
      run("git", ["remote", "add", "origin", sshUrl]);
    }
    console.log("origin set to:", sshUrl);

    // Step 5: Determine local branch
    const { stdout: localBranch } = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    console.log(`Pushing ${localBranch} → origin/${targetBranch}...`);

    // Step 6: Push (force only when remote has diverged from API-created init)
    const pushResult = run(
      "git",
      ["push", "origin", `${localBranch}:${targetBranch}`],
      { allowFailure: true }
    );
    if (pushResult.status !== 0) {
      const errText = pushResult.stderr;
      if (errText.includes("fetch first") || errText.includes("non-fast-forward")) {
        console.log("Remote has unrelated history. Force-pushing to replace API-init commit...");
        run("git", ["push", "origin", `${localBranch}:${targetBranch}`, "--force"]);
      } else {
        throw new Error(`git push failed:\n${pushResult.stderr}`);
      }
    }

    // Step 7: Verify the push succeeded
    const verifyRes = await connectors.proxy(
      "github",
      `/repos/${owner}/${repo}/branches/${targetBranch}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    const branchData = await verifyRes.json();
    const remoteSha = branchData.commit?.sha?.substring(0, 7) ?? "unknown";
    const { stdout: localSha } = run("git", ["rev-parse", "--short", "HEAD"]);

    if (remoteSha !== "unknown" && remoteSha !== localSha) {
      throw new Error(
        `Push verification failed: remote SHA (${remoteSha}) ≠ local SHA (${localSha})`
      );
    }

    console.log(`\nVerified: local=${localSha} remote=${remoteSha}`);
    console.log(`Success! Full codebase pushed to: https://github.com/${owner}/${repo}`);
    console.log(`Branch: ${targetBranch} | Files: see https://github.com/${owner}/${repo}/tree/${targetBranch}`);
  } finally {
    // Always remove the deploy key
    await removeDeployKey(owner, repo, keyId);
  }
}

main().catch(err => {
  console.error("\nError:", err.message);
  process.exit(1);
});
