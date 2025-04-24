# repo-mirror (Deno 版本)

一个简单的 Git 仓库镜像工具，用于克隆源仓库并同步所有分支和标签到目标仓库。使用 Deno 实现，无需 Node.js 依赖。

## 使用方法

1. 安装 [Deno](https://deno.com/manual/getting_started/installation)

2. 运行脚本（需要允许运行子进程）：

```sh
deno run --allow-run index.ts --from=https://example.com/source.git --to=https://example.com/target.git
```

### 参数说明
- `--from`: 源仓库的 URL
- `--to`: 目标仓库的 URL

## 功能特点
- 自动克隆源仓库
- 同步所有远程分支
- 同步所有标签
- 自动清理临时文件

## 说明
- 无需 package.json、tsconfig.json、node_modules
- 需要本地已安装 git
- 使用临时目录进行克隆和同步操作
