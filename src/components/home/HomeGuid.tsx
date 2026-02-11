import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, File as FileIcon, FolderOpen, Terminal, X } from "lucide-react";
import { homeDir } from "@tauri-apps/api/path";

import { api, type Project } from "@/lib/api";
import { useNavigation } from "@/contexts/NavigationContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toast, ToastContainer } from "@/components/ui/toast";
import { FloatingPromptInput, type ModelType } from "@/components/FloatingPromptInput";
import * as SessionHelpers from "@/lib/sessionHelpers";

type ImportSelection =
  | { kind: "folder"; path: string }
  | { kind: "files"; paths: string[] };

function dirnameFromPath(p: string): string {
  if (!p) return "";
  const normalized = p.replace(/\//g, "\\");
  const idx = normalized.lastIndexOf("\\");
  if (idx <= 0) return "";
  return normalized.slice(0, idx);
}

function basenameFromPath(p: string): string {
  if (!p) return "";
  return p.split(/[/\\]/).pop() || p;
}

export const HomeGuid: React.FC = () => {
  const { navigateTo } = useNavigation();

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);

  const [importSelection, setImportSelection] = useState<ImportSelection | null>(null);
  const [fallbackCwd, setFallbackCwd] = useState<string>("");

  const workingDirectory = useMemo(() => {
    if (!importSelection) return "";
    if (importSelection.kind === "folder") return importSelection.path;
    return dirnameFromPath(importSelection.paths[0] || "");
  }, [importSelection]);

  const effectiveCwd = workingDirectory || fallbackCwd;

  const projectDisplayName = useMemo(() => {
    if (!importSelection) return "导入文件/文件夹（可选）";
    return basenameFromPath(effectiveCwd);
  }, [effectiveCwd, importSelection]);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        setRecentLoading(true);
        const projects = await api.listProjects();
        const sorted = [...projects].sort((a, b) => b.created_at - a.created_at).slice(0, 8);
        if (alive) {
          setRecentProjects(sorted);
          setImportSelection(prev => prev ?? (sorted[0]?.path ? { kind: "folder", path: sorted[0].path } : null));
        }
      } catch (e) {
        console.warn("[HomeGuid] Failed to load recent projects:", e);
      } finally {
        if (alive) setRecentLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const dir = await homeDir();
        if (alive) setFallbackCwd(dir);
      } catch (e) {
        console.warn("[HomeGuid] Failed to resolve home dir:", e);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  const pickFolder = useCallback(async () => {
    const selected = await SessionHelpers.selectProjectPath();
    if (!selected) return;
    setImportSelection({ kind: "folder", path: selected });
  }, []);

  const pickFiles = useCallback(async () => {
    const selected = await SessionHelpers.selectImportFiles();
    if (!selected?.length) return;
    setImportSelection({ kind: "files", paths: selected });
  }, []);

  const clearImport = useCallback(() => setImportSelection(null), []);

  const handleSendFromHome = useCallback(
    (prompt: string, model: ModelType, maxThinkingTokens?: number) => {
      const cwd = effectiveCwd;
      if (!cwd) {
        setToast({ message: "正在初始化工作目录，请稍后重试", type: "info" });
        return;
      }

      navigateTo("claude-tab-manager", {
        initialProjectPath: cwd,
        initialPrompt: prompt,
        initialPromptModel: model,
        initialMaxThinkingTokens: maxThinkingTokens,
      });
    },
    [navigateTo, effectiveCwd]
  );

  return (
    <div className="flex-1 h-full overflow-hidden">
      <div className="container mx-auto px-6 py-10 h-full">
        <div className="relative mx-auto max-w-4xl h-full">
          {/* Background accents */}
          <div className="pointer-events-none absolute -inset-x-10 -top-10 -bottom-10 -z-10">
            <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-primary/16 to-transparent blur-3xl" />
            <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/10 to-transparent blur-3xl" />
          </div>

          <div className="mx-auto max-w-3xl h-full flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/40">
                <Terminal className="h-5 w-5 text-foreground/80" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">开始编码吧</h1>

              <p className="mt-2 text-sm text-muted-foreground">
                先选模型，直接开始对话（可选导入文件/文件夹）
              </p>

              <div className="mt-6 flex items-center justify-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-9 gap-2 rounded-md px-2 text-muted-foreground hover:text-foreground"
                    >
                      <span className={cn("max-w-[340px] truncate", !importSelection && "text-muted-foreground/70")}>
                        {projectDisplayName}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[360px]">
                    <DropdownMenuLabel>导入</DropdownMenuLabel>
                    <DropdownMenuItem onClick={pickFolder}>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      选择文件夹
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={pickFiles}>
                      <FileIcon className="mr-2 h-4 w-4" />
                      选择文件
                    </DropdownMenuItem>
                    {importSelection && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={clearImport}>
                          <X className="mr-2 h-4 w-4" />
                          清除选择
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>最近项目</DropdownMenuLabel>
                    {recentLoading && (
                      <div className="px-2 py-2 text-xs text-muted-foreground">加载中...</div>
                    )}
                    {!recentLoading && recentProjects.length === 0 && (
                      <div className="px-2 py-2 text-xs text-muted-foreground">暂无</div>
                    )}
                    {recentProjects.map((p) => (
                      <DropdownMenuItem
                        key={p.id}
                        onClick={() => setImportSelection({ kind: "folder", path: p.path })}
                        className="flex-col items-start gap-0.5"
                      >
                        <div className="text-sm font-medium">{basenameFromPath(p.path) || p.path}</div>
                        <div className="text-xs text-muted-foreground truncate w-full">{p.path}</div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
              className="pb-8"
            >
              <FloatingPromptInput
                isLoading={false}
                disabled={!effectiveCwd}
                projectPath={effectiveCwd}
                variant="card"
                onSend={handleSendFromHome}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <ToastContainer>
        {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      </ToastContainer>
    </div>
  );
};
