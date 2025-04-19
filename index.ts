import { join, basename } from "jsr:@std/path";

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
      const cmd = new Deno.Command("git", {
        args: ["branch", "-r"],
        cwd: dir,
        stdout: "piped",
        stderr: "piped",
      });
      const { stdout, stderr, code } = await cmd.output();
      if (code !== 0) {
        throw new Error(new TextDecoder().decode(stderr));
      }
      const output = new TextDecoder().decode(stdout);
      const branches = output
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
      const cmd = new Deno.Command("git", {
        args: ["checkout", "-b", branchName, `origin/${branchName}`],
        cwd: dir,
        stdout: "piped",
        stderr: "piped",
      });
      const { code, stderr } = await cmd.output();
      if (code === 0) {
        console.log(`Branch ${branchName} created and tracked successfully.`);
      } else {
        console.error(
          `Error creating branch ${branchName}:\n` +
            new TextDecoder().decode(stderr)
        );
      }
    } catch (error) {
      console.error(`Error creating branch ${branchName}: ${error}`);
    }
  }

  // 克隆仓库
  console.log(`Cloning repository from ${config.from}...`);
  {
    const cmd = new Deno.Command("git", {
      args: ["clone", config.from, dir],
      cwd: config.cwd,
      stdout: "inherit",
      stderr: "inherit",
    });
    const { code } = await cmd.output();
    if (code !== 0) throw new Error("git clone failed");
  }
  console.log("Repository cloned successfully.");

  console.log("Fetching remote branches...");
  const remoteBranches = await getRemoteBranches();
  console.log(`Found ${remoteBranches.length} remote branches:`);
  console.log(remoteBranches.join("\n"));

  for (const branch of remoteBranches) {
    await createLocalBranch(branch);
  }

  console.log("All branches created and tracked successfully.");

  // 重命名和添加 remote
  await new Deno.Command("git", {
    args: ["remote", "rename", "origin", "old-origin"],
    cwd: dir,
    stdout: "inherit",
    stderr: "inherit",
  }).output();

  await new Deno.Command("git", {
    args: ["remote", "add", "origin", config.to],
    cwd: dir,
    stdout: "inherit",
    stderr: "inherit",
  }).output();

  // 推送所有分支和标签
  await new Deno.Command("git", {
    args: ["push", "--set-upstream", "origin", "--all"],
    cwd: dir,
    stdout: "inherit",
    stderr: "inherit",
  }).output();
  await new Deno.Command("git", {
    args: ["push", "--set-upstream", "origin", "--tags"],
    cwd: dir,
    stdout: "inherit",
    stderr: "inherit",
  }).output();

  console.log("Pushed branches to remote successfully.");
};

// 入口函数：读取 config.json 并批量执行 cloneAndPush
async function main() {
  try {
    const raw = await Deno.readTextFile("config.json");
    const configs: ProjectConfig[] = JSON.parse(raw);
    if (!Array.isArray(configs))
      throw new Error("配置文件格式错误，必须为数组");
    for (const conf of configs) {
      await cloneAndPush(conf);
    }
  } catch (err) {
    console.error("读取或处理 config.json 出错:", err);
    Deno.exit(1);
  }
}

main();
