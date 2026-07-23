// FK 免费名片赞自动领取 - JavaScript 版本
const baseURL = "https://fk.555655.cn"
const tid = "48"
const qq = args && args.shortcutParameter ? args.shortcutParameter : "REPLACE_WITH_YOUR_QQ"

async function main() {
    const req = new Request(baseURL + "/?cid=3&tid=" + tid)
    req.headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15',
    }
    const html = await req.load()
    
    const match = html.match(/var hashsalt=([^;]+);/)
    if (!match) {
        console.log("❌ 未找到 hashsalt")
        return "❌ 未找到 hashsalt"
    }
    
    let hashsalt
    try {
        hashsalt = eval(match[1])
    } catch(e) {
        console.log("❌ 解码失败")
        return "❌ 解码失败"
    }
    
    const body = "tid=" + tid + "&inputvalue=" + qq + "&inputvalue2=&inputvalue3=&inputvalue4=&inputvalue5=&num=1&hashsalt=" + hashsalt
    
    const req2 = new Request(baseURL + "/ajax.php?act=pay", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: body
    })
    
    const resp = await req2.load()
    console.log("响应:", resp)
    return resp
}

const result = await main()
console.log(result)
