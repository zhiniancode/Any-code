# Any Code 构建指南（Windows）

## 前置要求检查清单

- [ ] Visual Studio Build Tools 2022（含 C++ 工具）
- [ ] Rust 1.70+ 和 Cargo
- [ ] Node.js 18.0+（已安装 ✓）
- [ ] WebView2 Runtime

## 构建步骤

### 1. 安装项目依赖

```bash
# 在项目根目录运行
npm install
```

这会安装所有前端依赖和 Tauri CLI。

### 2. 开发模式（热重载）

```bash
# 启动开发服务器
npm run tauri:dev
```

首次运行会：
- 下载 Rust 依赖（可能需要 5-10 分钟）
- 编译 Rust 后端
- 启动前端开发服务器
- 打开应用窗口

### 3. 生产构建

```bash
# 完整构建（优化版本，较慢）
npm run tauri:build

# 快速构建（开发版本，更快）
npm run tauri:build-fast
```

构建产物位置：
```
src-tauri/target/release/
├── any-code.exe           # 可执行文件
└── bundle/
    ├── msi/              # MSI 安装包
    └── nsis/             # NSIS 安装包
```

## 常见问题

### Q: 编译时提示找不到 MSVC

**A**: 需要在 "Developer Command Prompt for VS 2022" 中运行，或者：

```bash
# 设置环境变量（在 PowerShell 中）
$vsPath = & "C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe" -latest -property installationPath
Import-Module "$vsPath\Common7\Tools\Microsoft.VisualStudio.DevShell.dll"
Enter-VsDevShell -VsInstallPath $vsPath -SkipAutomaticLocation
```

### Q: Rust 编译错误 "linker 'link.exe' not found"

**A**: 确保已安装 Visual Studio Build Tools 的 C++ 组件。

### Q: 首次构建很慢

**A**: 正常现象，Rust 需要编译所有依赖。后续增量编译会快很多。

## 验证环境

运行以下命令验证所有工具已正确安装：

```bash
node --version    # 应显示 v18.0.0 或更高
npm --version     # 应显示版本号
rustc --version   # 应显示 rustc 1.70.0 或更高
cargo --version   # 应显示 cargo 版本号
```

## 下一步

环境配置完成后：
1. 运行 `npm install` 安装依赖
2. 运行 `npm run tauri:dev` 启动开发模式
3. 开始开发！
