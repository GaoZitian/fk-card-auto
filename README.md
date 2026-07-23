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
| `fk_auto_claim.js` | JavaScript 版本，用于 GitHub Actions 或浏览器 |
| `.github/workflows/auto-claim.yml` | GitHub Actions 定时任务配置 |

## 配置步骤

### 1. 设置 QQ 号（Repository Secret）

在 GitHub 仓库中设置 Secrets：

1. 进入仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 名称：`QQ_NUMBER`
4. 值：你的 QQ 号码（如 `973879550`）
5. 点击 **Add secret**

### 2. 启用 GitHub Actions

Actions 已配置为每天早上 8 点（UTC）自动运行。

手动触发：
1. 进入 **Actions** 标签
2. 选择 **免费名片赞自动领取**
3. 点击 **Run workflow**

## 本地使用

### Python 脚本

```bash
# 设置 QQ 号
export QQ_NUMBER=你的QQ号

# 运行脚本
python3 fk_auto_claim.py
```

### Scriptable / 浏览器

```javascript
// 在浏览器控制台或 Scriptable 中运行
const qq = "你的QQ号"
// 运行 fk_auto_claim.js
```

## 定时任务配置

GitHub Actions 定时配置（`.github/workflows/auto-claim.yml`）：

```yaml
schedule:
  - cron: '0 8 * * *'  # 每天早上 8 点 UTC 运行
```

修改时间规则：[crontab.guru](https://crontab.guru/)

## 注意事项

- `hashsalt` 每次页面加载都会变化，需要动态获取
- 免费商品每天限领一次
- 请遵守网站使用条款
- 不要频繁请求，避免被限制

## License

MIT
