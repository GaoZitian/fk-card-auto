const { chromium } = require('playwright-core');

async function main() {
    console.log("=== 启动浏览器 ===");
    
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 },
        isMobile: true,
    });
    
    const page = await context.newPage();
    
    // 步骤 1: 访问首页
    console.log("访问首页...");
    await page.goto('https://fk.555655.cn/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // 步骤 2: 访问商品页
    console.log("访问商品页...");
    await page.goto('https://fk.555655.cn/?cid=3&tid=48', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // 步骤 3: 提取 hashsalt
    console.log("提取 hashsalt...");
    const hashsalt = await page.evaluate(() => {
        return typeof hashsalt !== 'undefined' ? hashsalt : null;
    });
    
    if (!hashsalt) {
        console.log("❌ 未找到 hashsalt");
        await browser.close();
        process.exit(1);
    }
    
    console.log("hashsalt:", hashsalt);
    
    // 步骤 4: 提交订单
    console.log("提交订单...");
    const response = await page.evaluate(({ hashsalt, qq }) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/ajax.php?act=pay', false);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(`tid=48&inputvalue=${qq}&num=1&hashsalt=${hashsalt}`);
        return xhr.responseText;
    }, { hashsalt, qq: process.env.QQ_NUMBER });
    
    console.log("响应:", response);
    
    // 解析结果
    const data = JSON.parse(response);
    if (data.succ == 1 || data.code == 1) {
        console.log("✅ 领取成功！");
    } else if (data.code == 4) {
        console.log("❌ 需要登录");
    } else if (data.code == 2) {
        console.log("🔒 需要验证码");
    } else {
        console.log("❌", data.msg);
    }
    
    await browser.close();
}

main().catch(console.error);
