import { ReplitConnectors } from "@replit/connectors-sdk";
import { execSync } from "child_process";
import { readFileSync, statSync } from "fs";
import path from "path";

const MAX_FILE_SIZE = 80 * 1024;
const CONCURRENCY = 10;
const OWNER = "njt-design";
const REPO = "blade-quill-art-academy";
const connectors = new ReplitConnectors();

async function githubApi(endpoint, options = {}) {
  const res = await connectors.proxy("github", endpoint, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!res.ok && res.status !== 404 && res.status !== 422) {
    const text = await res.text();
    throw new Error(`GitHub API ${endpoint} failed (${res.status}): ${text}`);
  }
  return res;
}

async function createBlob(filePath) {
  const fullPath = path.join("/home/runner/workspace", filePath);
  try {
    const stat = statSync(fullPath);
    if (stat.size > MAX_FILE_SIZE) {
      return { skipped: true, path: filePath, reason: `${Math.round(stat.size / 1024)}KB > limit` };
    }
    const buf = readFileSync(fullPath);
    let content, encoding;
    if (isBinary(buf)) {
      content = buf.toString("base64");
      encoding = "base64";
    } else {
      content = buf.toString("utf8");
      encoding = "utf-8";
    }
    const blobRes = await githubApi(`/repos/${OWNER}/${REPO}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content, encoding }),
    });
    const blob = await blobRes.json();
    return { sha: blob.sha, path: filePath };
  } catch (e) {
    return { skipped: true, path: filePath, reason: e.message };
  }
}

async function processBatch(items) {
  return Promise.all(items.map(createBlob));
}

async function main() {
  console.log("Getting list of tracked files...");
  const fileList = execSync("git ls-files", { cwd: "/home/runner/workspace" })
    .toString()
    .trim()
    .split("\n")
    .filter(Boolean);

  console.log(`Found ${fileList.length} files to push`);

  console.log("Checking repository state...");
  let initialCommitSha = null;
  const mainRefRes = await githubApi(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
    method: "GET",
  });
  if (mainRefRes.status === 200) {
    const mainRef = await mainRefRes.json();
    initialCommitSha = mainRef.object?.sha;
    console.log("Existing main branch SHA:", initialCommitSha);
  } else {
    console.log("Initializing empty repository...");
    const initFileRes = await githubApi(`/repos/${OWNER}/${REPO}/contents/.gitkeep`, {
      method: "PUT",
      body: JSON.stringify({
        message: "init",
        content: Buffer.from("").toString("base64"),
      }),
    });
    const initFile = await initFileRes.json();
    initialCommitSha = initFile.commit?.sha;
    console.log("Init commit SHA:", initialCommitSha);
  }

  const treeItems = [];
  let processed = 0;
  const skipped = [];

  for (let i = 0; i < fileList.length; i += CONCURRENCY) {
    const batch = fileList.slice(i, i + CONCURRENCY);
    const results = await processBatch(batch);
    for (const result of results) {
      if (result.skipped) {
        skipped.push(`${result.path || "?"}: ${result.reason}`);
      } else {
        treeItems.push({
          path: result.path,
          mode: "100644",
          type: "blob",
          sha: result.sha,
        });
        processed++;
      }
    }
    console.log(`  Progress: ${Math.min(i + CONCURRENCY, fileList.length)}/${fileList.length} files processed (${treeItems.length} blobs created)`);
  }

  if (skipped.length > 0) {
    console.log(`\nSkipped ${skipped.length} files (too large or unreadable):`);
    skipped.forEach(s => console.log("  -", s));
  }

  console.log(`\nCreating tree with ${treeItems.length} items...`);
  const treeRes = await githubApi(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ tree: treeItems }),
  });
  const tree = await treeRes.json();
  console.log("Tree SHA:", tree.sha);

  console.log("Creating full project commit...");
  const parents = initialCommitSha ? [initialCommitSha] : [];
  const commitRes = await githubApi(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: "Initial commit: Blade & Quill Art Academy full project",
      tree: tree.sha,
      parents,
    }),
  });
  const commit = await commitRes.json();
  console.log("Commit SHA:", commit.sha);

  console.log("Updating main branch...");
  const refRes = await githubApi(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: true }),
  });
  const ref = await refRes.json();
  console.log("Branch ref:", ref.ref);

  console.log(`\nDone! Repository is live at: https://github.com/${OWNER}/${REPO}`);
}

function isBinary(buffer) {
  const sample = buffer.slice(0, 8000);
  for (let i = 0; i < sample.length; i++) {
    if (sample[i] === 0) return true;
  }
  return false;
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
