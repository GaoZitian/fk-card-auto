# FK 免费名片赞自动领取

自动获取最新 `hashsalt` 并提交免费名片赞订单的 GitHub Actions 自动化工具。

## 功能

- 自动获取页面最新 `hashsalt`
- 自动提交 `tid=48` 免费领取订单
- 通过 GitHub Actions 定时运行
- QQ 号通过 Repository Secrets 配置，不暴露在代码中

## 文件说明

| 文件 | 说明 |
|------|------|
| `.github/workflows/auto-claim.yml` | GitHub Actions 定时任务配置 |

## 配置步骤

### 1. 设置 QQ 号（Repository Secret）

1. 进入仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 名称：`QQ_NUMBER`
4. 值：你的 QQ 号码
5. 点击 **Add secret**

### 2. 启用 GitHub Actions

Actions 已配置为每天早上 8 点（UTC）自动运行。

手动触发：
1. 进入 **Actions** 标签
2. 选择 **免费名片赞自动领取**
3. 点击 **Run workflow**

## 定时任务配置

定时配置（`.github/workflows/auto-claim.yml`）：

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
