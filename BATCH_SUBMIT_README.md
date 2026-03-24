# BeforeDawn 批量提交漏洞功能说明

## 功能概述

本次修改为 BeforeDawn 漏洞管理平台添加了批量提交漏洞的功能，允许安全人员一次性提交多个漏洞，提高工作效率。

## 后端修改

### 新增文件

1. **BatchVulnerabilityController.java**
   - 路径: `com.beforedawn.module.vuln.controller`
   - 功能: 处理批量提交漏洞的HTTP请求
   - API端点: `POST /vulnerability/batch-submit`

2. **BatchVulnerabilityService.java**
   - 路径: `com.beforedawn.module.vuln.service`
   - 功能: 批量提交漏洞的业务逻辑接口

3. **BatchVulnerabilityServiceImpl.java**
   - 路径: `com.beforedawn.module.vuln.service.impl`
   - 功能: 实现批量提交漏洞的业务逻辑
   - 特点: 
     - 支持事务处理
     - 逐个处理漏洞，单个失败不影响其他
     - 返回详细的提交结果

4. **BatchVulnerabilityDTO.java**
   - 路径: `com.beforedawn.module.vuln.dto`
   - 功能: 批量提交请求的数据传输对象

5. **BatchSubmitResultDTO.java**
   - 路径: `com.beforedawn.module.vuln.dto`
   - 功能: 批量提交结果的返回对象

### API说明

**POST /api/vulnerability/batch-submit**

请求体:
```json
{
  "vulnerabilities": [
    {
      "title": "漏洞标题1",
      "sourceType": "self_check",
      "vulnType": "sql_injection",
      "riskLevel": "high",
      "description": "漏洞描述",
      "assetId": "123"
    },
    {
      "title": "漏洞标题2",
      "sourceType": "security_scan",
      "vulnType": "xss",
      "riskLevel": "medium",
      "description": "漏洞描述",
      "assetId": "456"
    }
  ]
}
```

响应:
```json
{
  "code": 200,
  "message": "批量提交漏洞成功",
  "result": {
    "total": 2,
    "success": 2,
    "failed": 0,
    "results": [
      {
        "index": 0,
        "title": "漏洞标题1",
        "success": true,
        "message": "提交成功，漏洞编号：VULN-20260324-0001"
      },
      {
        "index": 1,
        "title": "漏洞标题2",
        "success": true,
        "message": "提交成功，漏洞编号：VULN-20260324-0002"
      }
    ]
  }
}
```

## 前端修改

### 新增文件

1. **batch-submit.html**
   - 独立的批量提交漏洞页面
   - 特点:
     - 基于 Vue3 + Element Plus
     - 支持动态添加/删除漏洞表单
     - 支持从模板快速加载示例数据
     - 显示详细的提交结果

2. **batch-vuln-api.js**
   - API调用封装

### 使用方法

1. 将 `batch-submit.html` 放置在 nginx 配置的静态文件目录
2. 访问路径: `http://域名/batch-submit.html`

## 部署步骤

### 后端部署

1. 备份原 jar 文件
```bash
cp /path/to/app.jar /path/to/app.jar.bak
```

2. 替换新的 jar 文件
```bash
cp /path/to/app-new.jar /path/to/app.jar
```

3. 重启后端服务

### 前端部署

1. 将 `batch-submit.html` 复制到前端服务器的 `/usr/share/nginx/html/` 目录
2. 将 `batch-vuln-api.js` 复制到前端服务器的 `/usr/share/nginx/html/assets/` 目录
3. 确保 nginx 已配置 `/api/` 代理到后端服务

## 注意事项

1. **批量大小限制**: 建议每次批量提交不超过 100 个漏洞
2. **事务处理**: 每个漏洞的提交是独立的，一个失败不会影响其他
3. **权限验证**: 需要安全人员或管理员权限才能提交漏洞
4. **Token认证**: 前端需要携带有效的 JWT Token 进行认证

## 漏洞表单字段说明

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | String | 是 | 漏洞标题，5-200字符 |
| sourceType | String | 是 | 漏洞来源 |
| vulnType | String | 是 | 漏洞类型 |
| riskLevel | String | 是 | 风险等级 |
| description | String | 是 | 漏洞描述 |
| assetId | String | 是 | 关联资产ID |

## 漏洞来源选项

- self_check: 自查发现
- attack_defense: 攻防演练
- superior_report: 上级通报
- penetration_test: 渗透测试
- code_audit: 代码审计
- security_scan: 安全扫描
- external_report: 外部报告
- user_feedback: 用户反馈
- emergency: 应急响应
- other: 其他

## 漏洞类型选项

- sql_injection: SQL注入
- xss: XSS跨站脚本
- csrf: CSRF跨站请求伪造
- file_upload: 文件上传漏洞
- file_inclusion: 文件包含漏洞
- command_injection: 命令执行
- code_execution: 代码执行
- broken_access_control: 越权访问
- info_disclosure: 敏感信息泄露
- weak_password: 弱口令
- unauthorized_access: 未授权访问
- xxe: XXE漏洞
- ssrf: SSRF漏洞
- deserialization: 反序列化漏洞
- business_logic: 逻辑漏洞
- misconfiguration: 配置错误
- middleware: 中间件漏洞
- other: 其他

## 风险等级选项

- critical: 严重
- high: 高危
- medium: 中危
- low: 低危
