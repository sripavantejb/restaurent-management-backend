/**
 * Push local backend files to GitHub using `gh api` (avoids broken git libcurl).
 * Usage: node scripts/push-via-gh.mjs
 */
import { execFileSync } from "child_process";
import { readFileSync, readdirSync, statSync, writeFileSync, unlinkSync } from "fs";
import { join, relative } from "path";

const REPO = "sripavantejb/restaurent-management-backend";
const BRANCH = "main";
const ROOT = process.cwd();

function ghJson(args, input) {
  const tmp = join(ROOT, ".gh-api-payload.json");
  if (input !== undefined) {
    writeFileSync(tmp, JSON.stringify(input));
    try {
      const out = execFileSync(
        "gh",
        ["api", ...args, "--input", tmp],
        { encoding: "utf8", maxBuffer: 30_000_000 }
      );
      return out ? JSON.parse(out) : null;
    } finally {
      try {
        unlinkSync(tmp);
      } catch {
        /* ignore */
      }
    }
  }
  const out = execFileSync("gh", ["api", ...args], {
    encoding: "utf8",
    maxBuffer: 30_000_000,
  });
  return out ? JSON.parse(out) : null;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name.startsWith(".gh-")) {
      continue;
    }
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
console.log("Uploading", files.length, "files…");

const tree = [];
for (const file of files) {
  const path = relative(ROOT, file).replaceAll("\\", "/");
  const content = readFileSync(file);
  const blob = ghJson([`repos/${REPO}/git/blobs`], {
    content: content.toString("base64"),
    encoding: "base64",
  });
  tree.push({ path, mode: "100644", type: "blob", sha: blob.sha });
  console.log(" blob", path);
}

let parentSha = null;
try {
  const ref = ghJson([`repos/${REPO}/git/ref/heads/${BRANCH}`]);
  parentSha = ref.object.sha;
} catch {
  parentSha = null;
}

const treeRes = ghJson([`repos/${REPO}/git/trees`], {
  tree,
  base_tree: parentSha || undefined,
});

const commitPayload = {
  message: "Add RestaurantOS backend seed package",
  tree: treeRes.sha,
  parents: parentSha ? [parentSha] : [],
};
const commit = ghJson([`repos/${REPO}/git/commits`], commitPayload);

if (parentSha) {
  ghJson([`repos/${REPO}/git/refs/heads/${BRANCH}`, "-X", "PATCH"], {
    sha: commit.sha,
    force: true,
  });
} else {
  ghJson([`repos/${REPO}/git/refs`], {
    ref: `refs/heads/${BRANCH}`,
    sha: commit.sha,
  });
}

console.log("Pushed commit", commit.sha);
console.log(`https://github.com/${REPO}`);
