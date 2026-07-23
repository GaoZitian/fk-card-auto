# FK 免费名片赞自动领取

通过 GitHub Actions + Playwright 浏览器自动化，每天自动领取 QQ 名片赞。

## 原理

1. 使用 Playwright 启动真实 Chromium 浏览器
2. 访问 `fk.555655.cn` 首页和商品页，通过 JS 验证
3. 提取页面中的 `hashsalt`（每次动态生成）
4. 提交免费领取订单（`tid=48`）

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

## 文件说明

| 文件 | 说明 |
|------|------|
| `.github/workflows/auto-claim.yml` | GitHub Actions 定时任务配置 |
| `claim.js` | Playwright 自动化脚本 |

## 注意事项

- `hashsalt` 每次页面加载都会变化，Playwright 直接读取
- 免费商品每天限领一次
- 如果触发验证码或需要登录，脚本会停止并报告原因
- 请遵守网站使用条款
- 不要频繁请求，避免被限制

## License

MIT
