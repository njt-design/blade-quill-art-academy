/**
 * Push this project to GitHub using a temporary SSH deploy key.
 *
 * Usage:
 *   node scripts/push-to-github.mjs owner/repo [branch] [--force]
 *
 * The Replit GitHub integration must be connected before running this script.
 * Requires: @replit/connectors-sdk (installed in workspace root).
 *
 * Arguments:
 *   owner/repo  GitHub repository slug — required (e.g. "myuser/my-repo")
 *   branch      Remote branch name — default: "main"
 *   --force     Allow force-push when remote has diverged history
 */

import { ReplitConnectors } from "@replit/connectors-sdk";
import { spawnSync } from "child_process";
import { writeFileSync, readFileSync, mkdirSync, chmodSync } from "fs";
import path from "path";
import os from "os";

const WORKSPACE = "/home/runner/workspace";
const connectors = new ReplitConnectors();

// ── shell helpers ──────────────────────────────────────────────────────────

/**
 * Run a command with an argument array (no shell interpolation).
 */
function run(cmd, args, { cwd = WORKSPACE, allowFailure = false, env } = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    cwd,
    env: env ?? { ...process.env, HOME: os.homedir() },
  });
  if (!allowFailure && result.status !== 0) {
    throw new Error(
      `Command failed (exit ${result.status}): ${[cmd, ...args].join(" ")}\n` +
        (result.stderr || result.stdout)
    );
  }
  return {
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
    status: result.status ?? -1,
  };
}

// ── GitHub API ─────────────────────────────────────────────────────────────

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

// ── input validation ───────────────────────────────────────────────────────

function validateSlug(owner, repo) {
  const re = /^[a-zA-Z0-9_.-]+$/;
  if (!re.test(owner)) throw new Error(`Invalid GitHub owner name: "${owner}"`);
  if (!re.test(repo)) throw new Error(`Invalid GitHub repo name: "${repo}"`);
}

function validateBranch(branch) {
  if (!/^[a-zA-Z0-9_./\-]+$/.test(branch)) {
    throw new Error(`Invalid branch name: "${branch}"`);
  }
}

// ── git setup ──────────────────────────────────────────────────────────────

function ensureGitInitialized() {
  const { status } = run("git", ["rev-parse", "--is-inside-work-tree"], { allowFailure: true });
  if (status !== 0) {
    console.log("Initializing git repository...");
    run("git", ["init"]);
    run("git", ["checkout", "-b", "main"], { allowFailure: true });
  }
}

function ensureAllFilesCommitted() {
  // Check if HEAD exists at all
  const { status: headStatus } = run("git", ["rev-parse", "HEAD"], { allowFailure: true });
  const { stdout: statusOut } = run("git", ["status", "--porcelain"]);

  if (headStatus !== 0) {
    // No commits yet
    console.log("No commits yet — staging all files and creating initial commit...");
    run("git", ["add", "-A"]);
    run("git", ["commit", "-m", "Initial commit: Blade & Quill Art Academy full project"]);
    return;
  }

  if (statusOut.length > 0) {
    console.log("Uncommitted changes — staging and committing...");
    run("git", ["add", "-A"]);
    const { status: commitStatus, stderr } = run(
      "git",
      ["commit", "-m", "Sync: Blade & Quill Art Academy"],
      { allowFailure: true }
    );
    if (commitStatus !== 0 && !stderr.includes("nothing to commit")) {
      throw new Error(`git commit failed:\n${stderr}`);
    }
  } else {
    console.log("Working tree clean — nothing to commit.");
  }
}

// ── GitHub repo ────────────────────────────────────────────────────────────

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

  // Determine whether to create under user or org namespace
  const meRes = await connectors.proxy("github", "/user", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const me = await meRes.json();
  const isPersonalRepo = me.login.toLowerCase() === owner.toLowerCase();
  const createEndpoint = isPersonalRepo ? "/user/repos" : `/orgs/${owner}/repos`;

  console.log(`Creating ${owner}/${repo} via ${createEndpoint}...`);
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

// ── SSH deploy key ─────────────────────────────────────────────────────────

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

  // Remove stale key with same title
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

  console.log("Adding deploy key with write access...");
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
    console.warn(
      "Warning: could not remove the deploy key automatically.\n" +
        `Please remove key id ${keyId} manually in https://github.com/${owner}/${repo}/settings/keys`
    );
  }
}

// ── GIT_SSH_COMMAND builder ────────────────────────────────────────────────

function buildGitSshCommand(keyPath) {
  const knownHostsPath = path.join(os.tmpdir(), `github_known_hosts_${Date.now()}`);

  // Fetch GitHub's real host key (avoids MITM)
  const { stdout: scanned, status } = run("ssh-keyscan", ["-H", "github.com"], {
    cwd: os.tmpdir(),
    allowFailure: true,
  });
  if (status === 0 && scanned.trim().length > 0) {
    writeFileSync(knownHostsPath, scanned + "\n", { mode: 0o600 });
  } else {
    // GitHub's published ED25519 host key as a safe fallback
    writeFileSync(
      knownHostsPath,
      "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl\n",
      { mode: 0o600 }
    );
  }

  // Return the GIT_SSH_COMMAND value — does not modify ~/.ssh/config
  return `ssh -i ${keyPath} -o StrictHostKeyChecking=yes -o UserKnownHostsFile=${knownHostsPath}`;
}

// ── push ───────────────────────────────────────────────────────────────────

function gitPush(localBranch, targetBranch, sshUrl, gitSshCommand, force) {
  const pushArgs = ["push", sshUrl, `${localBranch}:refs/heads/${targetBranch}`];
  const env = { ...process.env, HOME: os.homedir(), GIT_SSH_COMMAND: gitSshCommand };

  const result = run("git", pushArgs, { allowFailure: true, env });

  if (result.status !== 0) {
    const errText = result.stderr;
    const isDivergent = errText.includes("fetch first") || errText.includes("non-fast-forward");

    if (isDivergent && !force) {
      throw new Error(
        "Remote branch has diverged from local history.\n" +
          "This happens when the repository was initialized via the GitHub API before git push.\n" +
          "Re-run with --force to replace the remote history:\n" +
          "  node scripts/push-to-github.mjs owner/repo [branch] --force"
      );
    }

    if (isDivergent && force) {
      console.log("--force specified: replacing remote history...");
      run("git", [...pushArgs, "--force"], { env });
    } else {
      throw new Error(`git push failed:\n${errText}`);
    }
  }
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  const rawArgs = process.argv.slice(2);

  if (!rawArgs[0] || !rawArgs[0].includes("/")) {
    throw new Error(
      "GitHub repository slug required.\n" +
        "Usage: node scripts/push-to-github.mjs owner/repo [branch] [--force]"
    );
  }

  const [owner, repo] = rawArgs[0].split("/", 2);
  const targetBranch = rawArgs.find(a => !a.startsWith("-") && a !== rawArgs[0]) ?? "main";
  const force = rawArgs.includes("--force");

  validateSlug(owner, repo);
  validateBranch(targetBranch);

  console.log(`Target: ${owner}/${repo} → branch: ${targetBranch}${force ? " (--force)" : ""}`);

  // 1. Git init + commit
  ensureGitInitialized();
  ensureAllFilesCommitted();

  // 2. Ensure remote repo exists
  await ensureRepoExists(owner, repo);

  // 3. Set up temporary SSH deploy key
  const { keyPath, keyId } = await setupDeployKey(owner, repo);

  // 4. Build GIT_SSH_COMMAND (does not touch ~/.ssh/config)
  const gitSshCommand = buildGitSshCommand(keyPath);

  const sshUrl = `git@github.com:${owner}/${repo}.git`;

  try {
    // 5. Set origin to the GitHub SSH URL
    const { stdout: remoteList } = run("git", ["remote"], { allowFailure: true });
    if (remoteList.split("\n").includes("origin")) {
      run("git", ["remote", "set-url", "origin", sshUrl]);
    } else {
      run("git", ["remote", "add", "origin", sshUrl]);
    }
    console.log("origin →", sshUrl);

    // 6. Push
    const { stdout: localBranch } = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    console.log(`Pushing ${localBranch} → origin/${targetBranch}...`);
    gitPush(localBranch, targetBranch, sshUrl, gitSshCommand, force);

    // 7. Verify push
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
    console.log(`\nSuccess! Codebase pushed to: https://github.com/${owner}/${repo}`);
    console.log(`  Branch : ${targetBranch}`);
    console.log(`  Tree   : https://github.com/${owner}/${repo}/tree/${targetBranch}`);
  } finally {
    await removeDeployKey(owner, repo, keyId);
  }
}

main().catch(err => {
  console.error("\nError:", err.message);
  process.exit(1);
});
