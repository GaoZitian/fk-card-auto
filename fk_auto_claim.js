// FK 免费名片赞自动领取 - JavaScript 版本
// 用于 GitHub Actions 或浏览器环境

const baseURL = "https://fk.555655.cn"
const tid = "48"

// 从环境变量获取 QQ 号（GitHub Actions）
const qq = process.env.QQ_NUMBER || process.env.QQ || "REPLACE_WITH_YOUR_QQ"

async function main() {
    console.log("=== FK 免费名片赞自动领取 ===")
    console.log("QQ:", qq)
    
    // 获取页面
    console.log("\n步骤 1: 获取页面...")
    const req = new Request(baseURL + "/?cid=3&tid=" + tid)
    req.headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
    
    let html
    try {
        const response = await req.load()
        if (typeof response === 'string') {
            html = response
        } else {
            html = response.text || response.responseText || ""
        }
    } catch(e) {
        console.log("❌ 页面获取失败:", e)
        return "❌ 页面获取失败"
    }
    
    console.log("页面长度:", html.length)
    
    // 提取 hashsalt
    const match = html.match(/var hashsalt=([^;]+);/)
    if (!match) {
        console.log("❌ 未找到 hashsalt")
        return "❌ 未找到 hashsalt"
    }
    
    const obfuscated = match[1]
    console.log("混淆代码:", obfuscated.substring(0, 30) + "...")
    
    // 解码 hashsalt
    let hashsalt
    try {
        hashsalt = eval(obfuscated)
    } catch(e) {
        console.log("❌ 解码失败:", e)
        return "❌ 解码失败"
    }
    console.log("hashsalt:", hashsalt)
    
    // 提交订单
    console.log("\n步骤 2: 提交订单...")
    const body = "tid=" + tid + "&inputvalue=" + qq + "&inputvalue2=&inputvalue3=&inputvalue4=&inputvalue5=&num=1&hashsalt=" + hashsalt
    
    const req2 = new Request(baseURL + "/ajax.php?act=pay", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': baseURL,
            'Referer': baseURL + "/?cid=3&tid=" + tid,
        },
        body: body
    })
    
    let resp
    try {
        const response = await req2.load()
        if (typeof response === 'string') {
            resp = response
        } else {
            resp = response.text || response.responseText || JSON.stringify(response)
        }
    } catch(e) {
        console.log("❌ 提交失败:", e)
        return "❌ 提交失败"
    }
    
    console.log("响应:", resp)
    
    // 解析结果
    try {
        const data = JSON.parse(resp)
        if (data.succ == 1 || data.code == 1) {
            console.log("✅ 领取成功！")
            return "✅ 领取成功！QQ: " + qq
        } else if (data.code == 4) {
            console.log("❌ 需要登录")
            return "❌ 需要登录"
        } else if (data.code == 2) {
            console.log("🔒 需要验证码")
            return "🔒 需要验证码"
        } else {
            console.log("❌ " + data.msg)
            return "❌ " + data.msg
        }
    } catch(e) {
        console.log("❌ 响应解析失败:", e)
        return "❌ 响应: " + resp.substring(0, 100)
    }
}

const result = await main()
console.log("\n最终结果:", result)
