# FK 免费名片赞自动领取

自动获取最新 `hashsalt` 并提交免费名片赞订单的自动化工具。

## 功能

- 自动获取页面最新 `hashsalt`
- 自动提交 `tid=48` 免费领取订单
- 支持通过 GitHub Actions 定时运行

## 文件说明

| 文件 | 说明 |
|------|------|
| `fk_auto_claim.py` | Python 脚本，用于本地/Mac 运行 |
| `fk_auto_claim.js` | JavaScript 版本，用于 Scriptable 或浏览器 |
| `github/workflows/auto-claim.yml` | GitHub Actions 定时任务配置 |

## 使用方法

### 方式一：本地 Python 脚本

```bash
python3 fk_auto_claim.py
```

### 方式二：GitHub Actions（推荐）

1. Fork 本仓库
2. 在仓库 Settings → Secrets 中添加必要配置
3. 启用 GitHub Actions 定时任务

### 方式三：Scriptable + 快捷指令

1. 在 Scriptable 中运行 `fk_auto_claim.js` 获取 hashsalt
2. 通过快捷指令提交订单

## 注意事项

- `hashsalt` 每次页面加载都会变化，需要动态获取
- 免费商品每天限领一次
- 请遵守网站使用条款

## License

MIT
