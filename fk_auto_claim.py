#!/usr/bin/env python3
"""
FK 免费名片赞自动领取脚本
支持 GitHub Actions / 本地运行
"""

import requests
import re
import json
import subprocess
import sys
import os

BASE_URL = "https://fk.555655.cn"
TID = "48"

def get_qq():
    """从环境变量或参数获取 QQ 号"""
    qq = os.environ.get('QQ_NUMBER') or os.environ.get('QQ')
    if not qq:
        print("❌ 请设置 QQ_NUMBER 环境变量")
        print("   export QQ_NUMBER=你的QQ号")
        sys.exit(1)
    return qq

def get_page_with_session():
    """获取页面，自动提取 hashsalt 和 cookies"""
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Connection': 'keep-alive',
    })
    
    resp = session.get(f"{BASE_URL}/?cid=3&tid={TID}")
    
    # 提取 hashsalt 混淆代码
    match = re.search(r"var hashsalt=([^;]+);", resp.text)
    if not match:
        print("❌ 未找到 hashsalt")
        return None, None
    
    obfuscated = match.group(1)
    print(f"提取到混淆代码: {obfuscated[:50]}...")
    
    # 用 Node.js 解码
    try:
        node_code = f"console.log({obfuscated})"
        result = subprocess.run(['node', '-e', node_code], 
                              capture_output=True, text=True, timeout=5)
        hashsalt = result.stdout.strip()
        print(f"解码 hashsalt: {hashsalt}")
    except Exception as e:
        print(f"❌ Node.js 解码失败: {e}")
        return None, None
    
    return hashsalt, session

def submit_order(session, hashsalt, qq):
    """提交订单"""
    payload = {
        'tid': TID,
        'inputvalue': qq,
        'inputvalue2': '',
        'inputvalue3': '',
        'inputvalue4': '',
        'inputvalue5': '',
        'num': '1',
        'hashsalt': hashsalt
    }
    
    resp = session.post(f"{BASE_URL}/ajax.php?act=pay", data=payload)
    return resp.json()

def main():
    qq = get_qq()
    print(f"=== FK 免费名片赞自动领取 ===\n")
    print(f"QQ: {qq}")
    
    # 1. 获取页面和 hashsalt
    print("\n步骤 1: 获取页面...")
    hashsalt, session = get_page_with_session()
    if not hashsalt:
        sys.exit(1)
    
    # 2. 提交订单
    print(f"\n步骤 2: 提交订单...")
    result = submit_order(session, hashsalt, qq)
    
    print(f"\n响应: {json.dumps(result, ensure_ascii=False, indent=2)}")
    
    # 3. 判断结果
    if result.get('succ') == 1 or result.get('code') == 1:
        print("\n✅ 领取成功！")
    elif result.get('code') == 4:
        print("\n❌ 需要登录")
    elif result.get('code') == 2:
        print("\n🔒 需要验证码")
    elif result.get('code') == 3:
        print(f"\n⚠️ 系统提示: {result.get('msg')}")
    else:
        print(f"\n❌ 失败: {result.get('msg')}")

if __name__ == '__main__':
    main()
