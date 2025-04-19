# repo-mirror (Deno 版本)

本项目用于批量镜像 Git 仓库（clone、同步所有分支和标签到新仓库）。已完全移除 Node.js 依赖，使用 Deno 标准库和 API 实现。

## 使用方法

1. 安装 [Deno](https://deno.com/manual/getting_started/installation)

2. 配置 `config.json`，格式如下：

```json
[
  {
    "from": "https://example.com/source.git",
    "to": "https://example.com/target.git",
    "cwd": "/your/clone/dir"
  }
]
```

3. 运行脚本（需允许运行子进程和文件读取）：

```sh
deno run --allow-run --allow-read index.ts
```

## 主要依赖
- [Deno 标准库 path](https://deno.land/std/path)
- Deno.Command（用于执行 git 命令）

## 说明
- 无需 package.json、tsconfig.json、node_modules。
- 需本地已安装 git。
- 支持多条配置批量执行。
