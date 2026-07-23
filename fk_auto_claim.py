#!/usr/bin/env python3
"""
FK 免费名片赞自动领取脚本
"""

import requests
import re
import json
import subprocess
import sys

BASE_URL = "https://fk.555655.cn"
TID = "48"
QQ_NUMBER = "REPLACE_WITH_YOUR_QQ"

def get_page_with_session():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Connection': 'keep-alive',
    })
    resp = session.get(f"{BASE_URL}/?cid=3&tid={TID}")
    match = re.search(r"var hashsalt=([^;]+);", resp.text)
    if not match:
        return None, None
    obfuscated = match.group(1)
    try:
        node_code = f"console.log({obfuscated})"
        result = subprocess.run(['node', '-e', node_code], capture_output=True, text=True, timeout=5)
        hashsalt = result.stdout.strip()
    except Exception:
        hashsalt = None
    return hashsalt, session

def submit_order(session, hashsalt, qq):
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
    hashsalt, session = get_page_with_session()
    if not hashsalt:
        print("❌ 获取 hashsalt 失败")
        sys.exit(1)
    result = submit_order(session, hashsalt, QQ_NUMBER)
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
