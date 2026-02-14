# 环境检查脚本
Write-Host "=== Any Code 构建环境检查 ===" -ForegroundColor Cyan

# 检查 Node.js
Write-Host "`n[1/4] 检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js 未安装" -ForegroundColor Red
}

# 检查 Rust
Write-Host "`n[2/4] 检查 Rust..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version
    Write-Host "✓ Rust: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Rust 未安装" -ForegroundColor Red
}

# 检查 MSVC
Write-Host "`n[3/4] 检查 MSVC 工具链..." -ForegroundColor Yellow
$vsWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $vsWhere) {
    $vsPath = & $vsWhere -latest -property installationPath
    if ($vsPath) {
        Write-Host "✓ Visual Studio Build Tools 已安装" -ForegroundColor Green
        Write-Host "  路径: $vsPath" -ForegroundColor Gray
    }
} else {
    Write-Host "✗ Visual Studio Build Tools 未找到" -ForegroundColor Red
}

# 检查 WebView2
Write-Host "`n[4/4] 检查 WebView2 Runtime..." -ForegroundColor Yellow
$webview2Path = "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
if (Test-Path $webview2Path) {
    Write-Host "✓ WebView2 Runtime 已安装" -ForegroundColor Green
} else {
    Write-Host "⚠ WebView2 Runtime 可能未安装" -ForegroundColor Yellow
}

Write-Host "`n=== 检查完成 ===" -ForegroundColor Cyan
