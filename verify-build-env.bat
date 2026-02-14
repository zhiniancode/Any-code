@echo off
echo ========================================
echo Any Code 构建环境验证
echo ========================================
echo.

echo [1/5] 检查 Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js:
    node --version
) else (
    echo [FAIL] Node.js 未安装
)
echo.

echo [2/5] 检查 npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] npm:
    npm --version
) else (
    echo [FAIL] npm 未安装
)
echo.

echo [3/5] 检查 Rust...
rustc --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Rust:
    rustc --version
) else (
    echo [FAIL] Rust 未安装 - 请安装 https://rustup.rs/
)
echo.

echo [4/5] 检查 Cargo...
cargo --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Cargo:
    cargo --version
) else (
    echo [FAIL] Cargo 未安装
)
echo.

echo [5/5] 检查 MSVC 编译器...
where cl.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MSVC 编译器已找到
) else (
    echo [WARN] MSVC 编译器未在 PATH 中
    echo       请确保已安装 Visual Studio Build Tools
    echo       并运行 "Developer Command Prompt for VS 2022"
)
echo.

echo ========================================
echo 验证完成
echo ========================================
echo.
echo 如果所有检查都通过，可以运行：
echo   npm install
echo   npm run tauri dev
echo.
pause
