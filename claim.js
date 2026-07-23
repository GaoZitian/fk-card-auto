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
    
    try {
        // 步骤 1: 访问首页
        console.log("步骤 1: 访问首页...");
        const homeResp = await page.goto('https://fk.555655.cn/', { 
            waitUntil: 'networkidle', 
            timeout: 30000 
        });
        console.log("首页状态码:", homeResp.status());
        await page.waitForTimeout(2000);
        
        // 步骤 2: 访问商品页
        console.log("步骤 2: 访问商品页...");
        const prodResp = await page.goto('https://fk.555655.cn/?cid=3&tid=48', { 
            waitUntil: 'networkidle', 
            timeout: 30000 
        });
        console.log("商品页状态码:", prodResp.status());
        await page.waitForTimeout(3000);
        
        // 步骤 3: 提取 hashsalt
        console.log("步骤 3: 提取 hashsalt...");
        const hashsalt = await page.evaluate(() => {
            return typeof hashsalt !== 'undefined' ? hashsalt : null;
        });
        
        if (!hashsalt) {
            console.log("❌ 未找到 hashsalt");
            console.log("页面标题:", await page.title());
            console.log("页面 URL:", page.url);
            process.exit(1);
        }
        
        console.log("hashsalt:", hashsalt);
        
        // 步骤 4: 提交订单
        console.log("步骤 4: 提交订单...");
        const response = await page.evaluate(({ hashsalt, qq }) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/ajax.php?act=pay', false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(`tid=48&inputvalue=${qq}&num=1&hashsalt=${hashsalt}`);
            return xhr.responseText;
        }, { hashsalt, qq: process.env.QQ_NUMBER });
        
        console.log("原始响应:", response);
        
        // 解析结果
        let data;
        try {
            data = JSON.parse(response);
        } catch(e) {
            console.log("❌ 响应不是合法 JSON:", e);
            process.exit(1);
        }
        
        console.log("解析结果:", JSON.stringify(data, null, 2));
        
        // 严格判断是否真的领取成功
        // 注意：手机抓包成功的返回是 {"succ":1,"msg":"领取成功！"}
        // 也可能返回 {"code":1,"msg":"领取成功！"}
        const isSuccess = data.succ === 1 || data.code === 1;
        const isCaptcha = data.code === 2;
        const isLogin = data.code === 4;
        const isRepeat = data.code === 3; // 每天限领一次
        const isVerifyFail = data.code === -1;
        
        if (isSuccess) {
            console.log("✅ 真实成功 - 订单已提交");
            process.exit(0);
        } else if (isCaptcha) {
            console.log("🔒 需要验证码（Geetest/VAPTCHA/数星），自动脚本无法处理");
            process.exit(2);
        } else if (isLogin) {
            console.log("❌ 需要登录 - Actions 没有登录态");
            process.exit(3);
        } else if (isRepeat) {
            console.log("⚠️ 每天限领一次，今天已经领过了");
            process.exit(0); // 这也是正常结果
        } else if (isVerifyFail) {
            console.log("❌ 验证失败 - 可能缺少 cookie 或被反爬拦截");
            console.log("提示:", data.msg || "请刷新页面重试");
            process.exit(4);
        } else {
            console.log("❌ 领取失败:", data.msg || data);
            process.exit(5);
        }
        
    } catch(e) {
        console.log("❌ 流程异常:", e.message);
        process.exit(10);
    } finally {
        await browser.close();
    }
}

main();
