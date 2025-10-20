# Git Hooks 配置说明

本项目使用 [Husky](https://typicode.github.io/husky/) 来管理 Git hooks，确保代码质量。

## 已配置的 Hooks

### pre-commit
- **触发时机**: 执行 `git commit` 时
- **作用**: 使用 `lint-staged` 检查并自动修复暂存的文件
- **检查内容**: 只检查即将提交的文件（`.js`, `.jsx`, `.ts`, `.tsx`, `.astro`）
- **失败时**: 如果有无法自动修复的 lint 错误，提交将被阻止

### pre-push  
- **触发时机**: 执行 `git push` 时
- **作用**: 运行完整的 ESLint 检查
- **检查内容**: 检查整个项目的代码
- **失败时**: 如果有任何 lint 错误，推送将被阻止

## 如何使用

### 正常工作流

```bash
# 1. 修改代码
# 2. 添加到暂存区
git add .

# 3. 提交（会自动运行 pre-commit hook）
git commit -m "your commit message"
# 如果有错误会自动修复，修复后的文件会被自动添加到提交中

# 4. 推送（会自动运行 pre-push hook）
git push
# 如果检查失败，推送会被阻止
```

### 跳过 Hooks（不推荐）

如果在紧急情况下需要跳过检查：

```bash
# 跳过 pre-commit hook
git commit --no-verify -m "emergency commit"

# 跳过 pre-push hook
git push --no-verify
```

⚠️ **注意**: 跳过检查可能会导致代码质量问题，请谨慎使用。

## 手动运行检查

```bash
# 运行完整的 lint 检查
pnpm run lint

# 只检查暂存的文件
pnpm exec lint-staged
```

## 维护

如果需要修改 hooks，直接编辑 `.husky` 目录中的对应文件即可。

如果 hooks 不工作，尝试重新初始化：

```bash
pnpm run prepare
```

