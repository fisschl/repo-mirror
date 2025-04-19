import { execa } from "execa";
import { join } from "node:path";
import { basename } from "node:path";
import { readFile } from "node:fs/promises";

export interface ProjectConfig {
  /**
   * 仓库地址，HTTP/HTTPS
   */
  from: string;
  /**
   * 新仓库地址，HTTP/HTTPS
   */
  to: string;
  /**
   * 克隆到的目录，绝对路径
   */
  cwd: string;
}

const cloneAndPush = async (config: ProjectConfig): Promise<void> => {
  const name = basename(config.from, ".git");
  const dir = join(config.cwd, name);

  // 获取远程分支列表
  async function getRemoteBranches(): Promise<string[]> {
    try {
      const { stdout } = await execa("git", ["branch", "-r"], { cwd: dir });
      // 解析远程分支列表
      const branches = stdout
        .split("\n")
        .map((branch: string) => branch.trim())
        .filter(
          (branch: string) =>
            branch && !branch.includes("->") && !branch.includes("HEAD")
        )
        .map((branch: string) => branch.replace("origin/", ""));
      return branches;
    } catch (error) {
      console.error(`Error fetching remote branches: ${error}`);
      throw error;
    }
  }

  // 创建本地分支并设置跟踪
  async function createLocalBranch(branchName: string): Promise<void> {
    try {
      await execa(
        "git",
        ["checkout", "-b", branchName, `origin/${branchName}`],
        { cwd: dir }
      );
      console.log(`Branch ${branchName} created and tracked successfully.`);
    } catch (error) {
      console.error(`Error creating branch ${branchName}: ${error}`);
    }
  }

  // 克隆仓库
  console.log(`Cloning repository from ${config.from}...`);
  await execa("git", ["clone", config.from, dir], { cwd: config.cwd });
  console.log("Repository cloned successfully.");

  console.log("Fetching remote branches...");
  const remoteBranches = await getRemoteBranches();
  console.log(`Found ${remoteBranches.length} remote branches:`);
  console.log(remoteBranches.join("\n"));

  for (const branch of remoteBranches) {
    await createLocalBranch(branch);
  }

  console.log("All branches created and tracked successfully.");

  await execa("git", ["remote", "rename", "origin", "old-origin"], {
    cwd: dir,
  });
  await execa("git", ["remote", "add", "origin", config.to], { cwd: dir });

  console.log("Pushing branches to remote...");
  await execa("git", ["push", "--set-upstream", "origin", "--all"], {
    cwd: dir,
  });
  await execa("git", ["push", "--set-upstream", "origin", "--tags"], {
    cwd: dir,
  });

  console.log("Pushed branches to remote successfully.");
};

// 入口函数：读取 config.json 并批量执行 cloneAndPush
async function main() {
  try {
    const raw = await readFile("config.json", "utf-8");
    const configs: ProjectConfig[] = JSON.parse(raw);
    if (!Array.isArray(configs))
      throw new Error("配置文件格式错误，必须为数组");
    for (const conf of configs) {
      await cloneAndPush(conf);
    }
  } catch (err) {
    console.error("读取或处理 config.json 出错:", err);
    process.exit(1);
  }
}

await main();
