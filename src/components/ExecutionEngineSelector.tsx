/**
 * ExecutionEngineSelector Component
 *
 * Allows users to switch between Claude Code, Codex, and Gemini CLI execution engines
 * with a simple bottom sheet interface.
 */

import React, { useState } from 'react';
import { Zap, Check, Sparkles, ChevronUp, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEngineStatus } from '@/hooks/useEngineStatus';
import { cn } from '@/lib/utils';
import type { CodexExecutionMode } from '@/types/codex';

// ============================================================================
// Type Definitions
// ============================================================================

export type ExecutionEngine = 'claude' | 'codex' | 'gemini';
export type CodexRuntimeMode = 'auto' | 'native' | 'wsl';
export type ClaudeRuntimeMode = 'auto' | 'native' | 'wsl';
export type GeminiRuntimeMode = 'auto' | 'native' | 'wsl';

export interface ExecutionEngineConfig {
  engine: ExecutionEngine;
  // Codex-specific config
  codexMode?: CodexExecutionMode;
  codexModel?: string;
  codexApiKey?: string;
  /** Codex reasoning effort level: low, medium, high, xhigh */
  codexReasoningLevel?: 'low' | 'medium' | 'high' | 'xhigh';
  // Gemini-specific config
  geminiModel?: string;
  geminiApprovalMode?: 'auto_edit' | 'yolo' | 'default';
}

interface ExecutionEngineSelectorProps {
  value: ExecutionEngineConfig;
  onChange: (config: ExecutionEngineConfig) => void;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export const ExecutionEngineSelector: React.FC<ExecutionEngineSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [showPopover, setShowPopover] = useState(false);

  // 使用全局缓存的引擎状态
  const {
    codexAvailable,
    geminiInstalled: geminiAvailable,
  } = useEngineStatus();

  const handleEngineChange = (engine: ExecutionEngine) => {
    if (engine === 'codex' && !codexAvailable) {
      alert('Codex CLI 未安装或不可用。请先安装 Codex CLI。');
      return;
    }

    if (engine === 'gemini' && !geminiAvailable) {
      alert('Gemini CLI 未安装或不可用。请运行 npm install -g @google/gemini-cli 安装。');
      return;
    }

    onChange({
      ...value,
      engine,
    });
    setShowPopover(false);
  };

  const handleCodexModeChange = (mode: CodexExecutionMode) => {
    onChange({
      ...value,
      codexMode: mode,
    });
  };

  const handleGeminiApprovalModeChange = (mode: 'auto_edit' | 'yolo' | 'default') => {
    onChange({
      ...value,
      geminiApprovalMode: mode,
    });
  };

  // Get display name for current engine
  const getEngineDisplayName = () => {
    switch (value.engine) {
      case 'claude':
        return 'Claude Code';
      case 'codex':
        return 'Codex';
      case 'gemini':
        return 'Gemini';
      default:
        return 'Claude Code';
    }
  };

  // Get icon for engine
  const getEngineIcon = (engine: ExecutionEngine) => {
    switch (engine) {
      case 'gemini':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  return (
    <Popover
      open={showPopover}
      onOpenChange={setShowPopover}
      trigger={
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 justify-between border-border/50 bg-background/50 hover:bg-accent/50", className)}
        >
          <div className="flex items-center gap-2">
            {getEngineIcon(value.engine)}
            <span>{getEngineDisplayName()}</span>
            {value.engine === 'codex' && value.codexMode && (
              <span className="text-xs text-muted-foreground">
                ({value.codexMode === 'read-only' ? '只读' : value.codexMode === 'full-auto' ? '编辑' : '完全访问'})
              </span>
            )}
            {value.engine === 'gemini' && value.geminiApprovalMode && (
              <span className="text-xs text-muted-foreground">
                ({value.geminiApprovalMode === 'yolo' ? 'YOLO' : value.geminiApprovalMode === 'auto_edit' ? '自动编辑' : '默认'})
              </span>
            )}
          </div>
          <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      }
      content={
        <div className="w-[380px]">
          <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border/30">
            选择模型（点击星标设为新会话默认）
          </div>

          <div className="space-y-0.5 p-1">
            {/* Claude Code */}
            <button
              onClick={() => handleEngineChange('claude')}
              className={cn(
                "w-full flex items-start gap-2.5 p-2.5 rounded-md transition-all text-left group",
                "hover:bg-accent",
                value.engine === 'claude' && "bg-accent"
              )}
            >
              <div className="mt-0.5">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm">Claude Code</span>
                  {value.engine === 'claude' && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  官方 Claude CLI 工具，支持思考模式和计划模式
                </div>
              </div>
            </button>

            {/* Codex */}
            <button
              onClick={() => handleEngineChange('codex')}
              disabled={!codexAvailable}
              className={cn(
                "w-full flex items-start gap-2.5 p-2.5 rounded-md transition-all text-left group",
                "hover:bg-accent",
                value.engine === 'codex' && "bg-accent",
                !codexAvailable && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="mt-0.5">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm">Codex</span>
                  {value.engine === 'codex' && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {codexAvailable ? 'OpenAI Codex CLI，支持多种推理级别' : '未安装 - 请先安装 Codex CLI'}
                </div>
              </div>
            </button>

            {/* Gemini */}
            <button
              onClick={() => handleEngineChange('gemini')}
              disabled={!geminiAvailable}
              className={cn(
                "w-full flex items-start gap-2.5 p-2.5 rounded-md transition-all text-left group",
                "hover:bg-accent",
                value.engine === 'gemini' && "bg-accent",
                !geminiAvailable && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="mt-0.5">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm">Gemini</span>
                  {value.engine === 'gemini' && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {geminiAvailable ? 'Google Gemini CLI，支持多种审批模式' : '未安装 - 运行 npm install -g @google/gemini-cli'}
                </div>
              </div>
            </button>
          </div>

          {/* Additional settings for selected engine */}
          {value.engine === 'codex' && (
            <div className="space-y-2 pt-2 mt-1 border-t border-border/30 px-2">
              <Label className="text-xs font-medium text-muted-foreground">执行模式</Label>
              <Select
                value={value.codexMode || 'read-only'}
                onValueChange={(v) => handleCodexModeChange(v as CodexExecutionMode)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read-only">
                    <div className="py-1">
                      <div className="font-medium">只读模式</div>
                      <div className="text-xs text-muted-foreground">安全模式，只能读取文件</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="full-auto">
                    <div className="py-1">
                      <div className="font-medium">编辑模式</div>
                      <div className="text-xs text-muted-foreground">允许编辑文件</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="danger-full-access">
                    <div className="py-1">
                      <div className="font-medium text-destructive">完全访问模式</div>
                      <div className="text-xs text-muted-foreground">⚠️ 允许网络访问</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {value.engine === 'gemini' && (
            <div className="space-y-2 pt-2 mt-1 border-t border-border/30 px-2">
              <Label className="text-xs font-medium text-muted-foreground">审批模式</Label>
              <Select
                value={value.geminiApprovalMode || 'auto_edit'}
                onValueChange={(v) => handleGeminiApprovalModeChange(v as 'auto_edit' | 'yolo' | 'default')}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <div className="py-1">
                      <div className="font-medium">默认</div>
                      <div className="text-xs text-muted-foreground">每次操作需确认</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="auto_edit">
                    <div className="py-1">
                      <div className="font-medium">自动编辑</div>
                      <div className="text-xs text-muted-foreground">自动批准文件编辑</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="yolo">
                    <div className="py-1">
                      <div className="font-medium text-destructive">YOLO 模式</div>
                      <div className="text-xs text-muted-foreground">⚠️ 自动批准所有操作</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Link to settings */}
          <div className="pt-1.5 mt-1 border-t border-border/30">
            <button
              onClick={() => {
                setShowPopover(false);
                window.dispatchEvent(new CustomEvent('navigate-to-settings', { detail: { tab: 'engines' } }));
              }}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <SettingsIcon className="h-3.5 w-3.5" />
              <span>更多配置（安装状态、运行环境等）</span>
            </button>
          </div>
        </div>
      }
      align="start"
      side="top"
      className="p-0"
    />
  );
};

export default ExecutionEngineSelector;
