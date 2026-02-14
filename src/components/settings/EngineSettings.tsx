/**
 * EngineSettings Component
 *
 * Manages execution engine runtime configurations (Native/WSL)
 * and displays installation status for Claude Code, Codex, and Gemini
 */

import React, { useState } from 'react';
import { Zap, Monitor, Terminal, Sparkles, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { relaunchApp } from '@/lib/updater';
import { ask, message } from '@tauri-apps/plugin-dialog';
import { useEngineStatus } from '@/hooks/useEngineStatus';
import type { CodexRuntimeMode, GeminiRuntimeMode, ClaudeRuntimeMode } from '@/components/ExecutionEngineSelector';

export const EngineSettings: React.FC = () => {
  const [savingConfig, setSavingConfig] = useState(false);

  // 使用全局缓存的引擎状态
  const {
    codexAvailable,
    codexVersion,
    geminiInstalled: geminiAvailable,
    geminiVersion,
    claudeInstalled,
    claudeVersion,
    codexModeConfig: cachedCodexModeConfig,
    geminiWslModeConfig: cachedGeminiWslModeConfig,
    claudeWslModeConfig: cachedClaudeWslModeConfig,
  } = useEngineStatus();

  // 本地状态用于跟踪用户修改
  const [localCodexModeConfig, setLocalCodexModeConfig] = useState<any>(null);
  const [localGeminiWslModeConfig, setLocalGeminiWslModeConfig] = useState<any>(null);
  const [localClaudeWslModeConfig, setLocalClaudeWslModeConfig] = useState<any>(null);

  // 使用本地修改的值，如果没有则使用缓存的值
  const codexModeConfig = localCodexModeConfig || cachedCodexModeConfig || null;
  const geminiWslModeConfig = localGeminiWslModeConfig || cachedGeminiWslModeConfig || null;
  const claudeWslModeConfig = localClaudeWslModeConfig || cachedClaudeWslModeConfig || null;

  const handleCodexRuntimeModeChange = async (mode: CodexRuntimeMode) => {
    if (!codexModeConfig) return;

    setSavingConfig(true);
    try {
      await api.setCodexModeConfig(mode, codexModeConfig.wslDistro);
      setLocalCodexModeConfig({ ...codexModeConfig, mode });

      const shouldRestart = await ask('配置已保存。是否立即重启应用以使更改生效？', {
        title: '重启应用',
        kind: 'info',
        okLabel: '立即重启',
        cancelLabel: '稍后重启',
      });

      if (shouldRestart) {
        try {
          await relaunchApp();
        } catch (restartError) {
          console.error('[EngineSettings] Failed to restart:', restartError);
          await message('配置已保存，但自动重启失败。请手动重启应用以使更改生效。', {
            title: '提示',
            kind: 'warning',
          });
        }
      }
    } catch (error) {
      console.error('[EngineSettings] Failed to save Codex mode config:', error);
      await message('保存配置失败: ' + (error instanceof Error ? error.message : String(error)), {
        title: '错误',
        kind: 'error',
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleWslDistroChange = async (distro: string) => {
    if (!codexModeConfig) return;

    const newDistro = distro === '__default__' ? null : distro;
    setSavingConfig(true);
    try {
      await api.setCodexModeConfig(codexModeConfig.mode, newDistro);
      setLocalCodexModeConfig({ ...codexModeConfig, wslDistro: newDistro });

      const shouldRestart = await ask('配置已保存。是否立即重启应用以使更改生效？', {
        title: '重启应用',
        kind: 'info',
        okLabel: '立即重启',
        cancelLabel: '稍后重启',
      });

      if (shouldRestart) {
        try {
          await relaunchApp();
        } catch (restartError) {
          console.error('[EngineSettings] Failed to restart:', restartError);
          await message('配置已保存，但自动重启失败。请手动重启应用以使更改生效。', {
            title: '提示',
            kind: 'warning',
          });
        }
      }
    } catch (error) {
      console.error('[EngineSettings] Failed to save WSL distro:', error);
      await message('保存配置失败: ' + (error instanceof Error ? error.message : String(error)), {
        title: '错误',
        kind: 'error',
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleGeminiRuntimeModeChange = async (mode: GeminiRuntimeMode) => {
    if (!geminiWslModeConfig) return;

    setSavingConfig(true);
    try {
      await api.setGeminiWslModeConfig(mode, geminiWslModeConfig.wslDistro);
      setLocalGeminiWslModeConfig({ ...geminiWslModeConfig, mode });

      const shouldRestart = await ask('配置已保存。是否立即重启应用以使更改生效？', {
        title: '重启应用',
        kind: 'info',
        okLabel: '立即重启',
        cancelLabel: '稍后重启',
      });

      if (shouldRestart) {
        try {
          await relaunchApp();
        } catch (restartError) {
          console.error('[EngineSettings] Failed to restart:', restartError);
          await message('配置已保存，但自动重启失败。请手动重启应用以使更改生效。', {
            title: '提示',
            kind: 'warning',
          });
        }
      }
    } catch (error) {
      console.error('[EngineSettings] Failed to save Gemini WSL mode config:', error);
      await message('保存配置失败: ' + (error instanceof Error ? error.message : String(error)), {
        title: '错误',
        kind: 'error',
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleGeminiWslDistroChange = async (distro: string) => {
    if (!geminiWslModeConfig) return;

    const newDistro = distro === '__default__' ? null : distro;
    setSavingConfig(true);
    try {
      await api.setGeminiWslModeConfig(geminiWslModeConfig.mode, newDistro);
      setLocalGeminiWslModeConfig({ ...geminiWslModeConfig, wslDistro: newDistro });

      const shouldRestart = await ask('配置已保存。是否立即重启应用以使更改生效？', {
        title: '重启应用',
        kind: 'info',
        okLabel: '立即重启',
        cancelLabel: '稍后重启',
      });

      if (shouldRestart) {
        try {
          await relaunchApp();
        } catch (restartError) {
          console.error('[EngineSettings] Failed to restart:', restartError);
          await message('配置已保存，但自动重启失败。请手动重启应用以使更改生效。', {
            title: '提示',
            kind: 'warning',
          });
        }
      }
    } catch (error) {
      console.error('[EngineSettings] Failed to save Gemini WSL distro:', error);
      await message('保存配置失败: ' + (error instanceof Error ? error.message : String(error)), {
        title: '错误',
        kind: 'error',
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleClaudeRuntimeModeChange = async (mode: ClaudeRuntimeMode) => {
    if (!claudeWslModeConfig) return;

    setSavingConfig(true);
    try {
      await api.setClaudeWslModeConfig(mode, claudeWslModeConfig.wslDistro);
      setLocalClaudeWslModeConfig({ ...claudeWslModeConfig, mode });

      const shouldRestart = await ask('配置已保存。是否立即重启应用以使更改生效？', {
        title: '重启应用',
        kind: 'info',
        okLabel: '立即重启',
        cancelLabel: '稍后重启',
      });

      if (shouldRestart) {
        try {
          await relaunchApp();
        } catch (restartError) {
          console.error('[EngineSettings] Failed to restart:', restartError);
          await message('配置已保存，但自动重启失败。请手动重启应用以使更改生效。', {
            title: '提示',
            kind: 'warning',
          });
        }
      }
    } catch (error) {
      console.error('[EngineSettings] Failed to save Claude WSL mode config:', error);
      await message('保存配置失败: ' + (error instanceof Error ? error.message : String(error)), {
        title: '错误',
        kind: 'error',
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleClaudeWslDistroChange = async (distro: string) => {
    if (!claudeWslModeConfig) return;

    const newDistro = distro === '__default__' ? null : distro;
    setSavingConfig(true);
    try {
      await api.setClaudeWslModeConfig(claudeWslModeConfig.mode, newDistro);
      setLocalClaudeWslModeConfig({ ...claudeWslModeConfig, wslDistro: newDistro });

      const shouldRestart = await ask('配置已保存。是否立即重启应用以使更改生效？', {
        title: '重启应用',
        kind: 'info',
        okLabel: '立即重启',
        cancelLabel: '稍后重启',
      });

      if (shouldRestart) {
        try {
          await relaunchApp();
        } catch (restartError) {
          console.error('[EngineSettings] Failed to restart:', restartError);
          await message('配置已保存，但自动重启失败。请手动重启应用以使更改生效。', {
            title: '提示',
            kind: 'warning',
          });
        }
      }
    } catch (error) {
      console.error('[EngineSettings] Failed to save Claude WSL distro:', error);
      await message('保存配置失败: ' + (error instanceof Error ? error.message : String(error)), {
        title: '错误',
        kind: 'error',
      });
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Claude Code Configuration */}
      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Claude Code</h3>
        </div>

        {/* Status */}
        <div className="rounded-md border p-3 bg-background">
          <div className="flex items-center gap-2 text-sm">
            <div className={`h-2 w-2 rounded-full ${claudeInstalled ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{claudeInstalled ? '已安装' : '未安装'}</span>
            {claudeVersion && <span className="text-muted-foreground">• {claudeVersion}</span>}
          </div>
        </div>

        {/* WSL Mode Configuration */}
        {claudeWslModeConfig && (claudeWslModeConfig.nativeAvailable || claudeWslModeConfig.wslAvailable) && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                运行环境
              </Label>
              <Select
                value={claudeWslModeConfig.isWindows ? claudeWslModeConfig.mode : 'native'}
                onValueChange={(v) => handleClaudeRuntimeModeChange(v as ClaudeRuntimeMode)}
                disabled={savingConfig}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {claudeWslModeConfig.isWindows && (
                    <SelectItem value="auto">
                      <div>
                        <div className="font-medium">自动检测</div>
                        <div className="text-xs text-muted-foreground">原生优先，WSL 后备</div>
                      </div>
                    </SelectItem>
                  )}
                  <SelectItem value="native" disabled={!claudeWslModeConfig.nativeAvailable}>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3 w-3" />
                      <div>
                        <div className="font-medium">{claudeWslModeConfig.isWindows ? 'Windows 原生' : 'Linux 原生'}</div>
                        <div className="text-xs text-muted-foreground">
                          {claudeWslModeConfig.nativeAvailable ? (claudeWslModeConfig.isWindows ? '使用 Windows 版 Claude' : '使用本机 Claude') : '未安装'}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  {claudeWslModeConfig.isWindows && (
                    <SelectItem value="wsl" disabled={!claudeWslModeConfig.wslAvailable}>
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3 w-3" />
                        <div>
                          <div className="font-medium">WSL</div>
                          <div className="text-xs text-muted-foreground">
                            {claudeWslModeConfig.wslAvailable ? '使用 WSL 中的 Claude' : '未安装'}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* WSL Distro Selection */}
            {claudeWslModeConfig.isWindows && claudeWslModeConfig.mode === 'wsl' && claudeWslModeConfig.availableDistros.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">WSL 发行版</Label>
                <Select
                  value={claudeWslModeConfig.wslDistro || '__default__'}
                  onValueChange={handleClaudeWslDistroChange}
                  disabled={savingConfig}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__default__">
                      <div className="text-muted-foreground">默认（自动选择）</div>
                    </SelectItem>
                    {claudeWslModeConfig.availableDistros.map((distro: string) => (
                      <SelectItem key={distro} value={distro}>
                        {distro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Current Runtime Status */}
            <div className="rounded-md border p-2 bg-muted/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">当前运行环境:</span>
                <span className="font-medium">
                  {claudeWslModeConfig.actualMode === 'wsl' ? (
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3 w-3" />
                      WSL
                      {claudeWslModeConfig.wslClaudeVersion && (
                        <span className="text-muted-foreground ml-1">({claudeWslModeConfig.wslClaudeVersion})</span>
                      )}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Monitor className="h-3 w-3" />
                      {claudeWslModeConfig.isWindows ? 'Windows 原生' : 'Linux 原生'}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Codex Configuration */}
      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Codex</h3>
        </div>

        {/* Status */}
        <div className="rounded-md border p-3 bg-background">
          <div className="flex items-center gap-2 text-sm">
            <div className={`h-2 w-2 rounded-full ${codexAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{codexAvailable ? '已安装' : '未安装'}</span>
            {codexVersion && <span className="text-muted-foreground">• {codexVersion}</span>}
          </div>
        </div>

        {/* WSL Mode Configuration */}
        {codexModeConfig && (codexModeConfig.nativeAvailable || codexModeConfig.wslAvailable) && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                运行环境
              </Label>
              <Select
                value={codexModeConfig.mode}
                onValueChange={(v) => handleCodexRuntimeModeChange(v as CodexRuntimeMode)}
                disabled={savingConfig}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {codexModeConfig.isWindows && (
                    <SelectItem value="auto">
                      <div>
                        <div className="font-medium">自动检测</div>
                        <div className="text-xs text-muted-foreground">原生优先，WSL 后备</div>
                      </div>
                    </SelectItem>
                  )}
                  <SelectItem value="native" disabled={!codexModeConfig.nativeAvailable}>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3 w-3" />
                      <div>
                        <div className="font-medium">{codexModeConfig.isWindows ? 'Windows 原生' : 'Linux 原生'}</div>
                        <div className="text-xs text-muted-foreground">
                          {codexModeConfig.nativeAvailable ? (codexModeConfig.isWindows ? '使用 Windows 版 Codex' : '使用本机 Codex') : '未安装'}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  {codexModeConfig.isWindows && (
                    <SelectItem value="wsl" disabled={!codexModeConfig.wslAvailable}>
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3 w-3" />
                        <div>
                          <div className="font-medium">WSL</div>
                          <div className="text-xs text-muted-foreground">
                            {codexModeConfig.wslAvailable ? '使用 WSL 中的 Codex' : '未安装'}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* WSL Distro Selection */}
            {codexModeConfig.isWindows && codexModeConfig.mode === 'wsl' && codexModeConfig.availableDistros.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">WSL 发行版</Label>
                <Select
                  value={codexModeConfig.wslDistro || '__default__'}
                  onValueChange={handleWslDistroChange}
                  disabled={savingConfig}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__default__">
                      <div className="text-muted-foreground">默认（自动选择）</div>
                    </SelectItem>
                    {codexModeConfig.availableDistros.map((distro: string) => (
                      <SelectItem key={distro} value={distro}>
                        {distro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Current Runtime Status */}
            <div className="rounded-md border p-2 bg-muted/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">当前运行环境:</span>
                <span className="font-medium">
                  {codexModeConfig.actualMode === 'wsl' ? (
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3 w-3" />
                      WSL
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Monitor className="h-3 w-3" />
                      {codexModeConfig.isWindows ? 'Windows 原生' : 'Linux 原生'}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Gemini Configuration */}
      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Gemini</h3>
        </div>

        {/* Status */}
        <div className="rounded-md border p-3 bg-background">
          <div className="flex items-center gap-2 text-sm">
            <div className={`h-2 w-2 rounded-full ${geminiAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{geminiAvailable ? '已安装' : '未安装'}</span>
            {geminiVersion && <span className="text-muted-foreground">• {geminiVersion}</span>}
          </div>
        </div>

        {/* WSL Mode Configuration */}
        {geminiWslModeConfig && (geminiWslModeConfig.nativeAvailable || geminiWslModeConfig.wslAvailable) && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                运行环境
              </Label>
              <Select
                value={geminiWslModeConfig.isWindows ? geminiWslModeConfig.mode : 'native'}
                onValueChange={(v) => handleGeminiRuntimeModeChange(v as GeminiRuntimeMode)}
                disabled={savingConfig}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {geminiWslModeConfig.isWindows && (
                    <SelectItem value="auto">
                      <div>
                        <div className="font-medium">自动检测</div>
                        <div className="text-xs text-muted-foreground">原生优先，WSL 后备</div>
                      </div>
                    </SelectItem>
                  )}
                  <SelectItem value="native" disabled={!geminiWslModeConfig.nativeAvailable}>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3 w-3" />
                      <div>
                        <div className="font-medium">{geminiWslModeConfig.isWindows ? 'Windows 原生' : 'Linux 原生'}</div>
                        <div className="text-xs text-muted-foreground">
                          {geminiWslModeConfig.nativeAvailable ? (geminiWslModeConfig.isWindows ? '使用 Windows 版 Gemini' : '使用本机 Gemini') : '未安装'}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  {geminiWslModeConfig.isWindows && (
                    <SelectItem value="wsl" disabled={!geminiWslModeConfig.wslAvailable}>
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3 w-3" />
                        <div>
                          <div className="font-medium">WSL</div>
                          <div className="text-xs text-muted-foreground">
                            {geminiWslModeConfig.wslAvailable ? '使用 WSL 中的 Gemini' : '未安装'}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* WSL Distro Selection */}
            {geminiWslModeConfig.isWindows && geminiWslModeConfig.mode === 'wsl' && geminiWslModeConfig.availableDistros.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">WSL 发行版</Label>
                <Select
                  value={geminiWslModeConfig.wslDistro || '__default__'}
                  onValueChange={handleGeminiWslDistroChange}
                  disabled={savingConfig}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__default__">
                      <div className="text-muted-foreground">默认（自动选择）</div>
                    </SelectItem>
                    {geminiWslModeConfig.availableDistros.map((distro: string) => (
                      <SelectItem key={distro} value={distro}>
                        {distro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Current Runtime Status */}
            <div className="rounded-md border p-2 bg-muted/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">当前运行环境:</span>
                <span className="font-medium">
                  {geminiWslModeConfig.wslEnabled ? (
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3 w-3" />
                      WSL
                      {geminiWslModeConfig.wslGeminiVersion && (
                        <span className="text-muted-foreground ml-1">({geminiWslModeConfig.wslGeminiVersion})</span>
                      )}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Monitor className="h-3 w-3" />
                      {geminiWslModeConfig.isWindows ? 'Windows 原生' : 'Linux 原生'}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {savingConfig && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>保存配置中...</span>
        </div>
      )}
    </div>
  );
};
