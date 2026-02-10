/*
 * Settings Page (FE-501) — Obsidian Forge Design
 * GitHub Token configuration, sync scheduler settings
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, Key, Clock, Save, Eye, EyeOff,
  RefreshCw, Shield, AlertCircle, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

export default function Settings() {
  const { t } = useTranslation();

  const CRON_PRESETS = [
    { label: t('settings.every1hour'), value: "0 * * * *" },
    { label: t('settings.every3hours'), value: "0 */3 * * *" },
    { label: t('settings.every6hours'), value: "0 */6 * * *" },
    { label: t('settings.every12hours'), value: "0 */12 * * *" },
    { label: t('settings.onceDaily'), value: "0 0 * * *" },
    { label: t('settings.custom'), value: "custom" },
  ];

  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [cronPreset, setCronPreset] = useState("0 */6 * * *");
  const [customCron, setCustomCron] = useState("");
  const [concurrency, setConcurrency] = useState("3");
  const [saving, setSaving] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<"unknown" | "valid" | "invalid">("unknown");

  useEffect(() => {
    api.get("/system/status").then((data: any) => {
      if (data.scheduler?.cron_expression) {
        const cron = data.scheduler.cron_expression;
        const preset = CRON_PRESETS.find(p => p.value === cron);
        if (preset) {
          setCronPreset(cron);
        } else {
          setCronPreset("custom");
          setCustomCron(cron);
        }
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settings: Record<string, any> = {};
      if (token.trim()) settings.github_token = token.trim();
      const cron = cronPreset === "custom" ? customCron : cronPreset;
      if (cron) settings.sync_cron = cron;
      settings.sync_concurrency = parseInt(concurrency) || 3;

      await api.put("/system/settings", settings);
      toast.success(t('settings.settingsSaved'));
      if (token.trim()) setTokenStatus("valid");
    } catch {
      toast.error(t('settings.settingsFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleTestToken = async () => {
    if (!token.trim()) {
      toast.error(t('settings.enterTokenFirst'));
      return;
    }
    try {
      await api.put("/system/settings", { github_token: token.trim() });
      setTokenStatus("valid");
      toast.success(t('settings.tokenValid'));
    } catch {
      setTokenStatus("invalid");
      toast.error(t('settings.tokenFailed'));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto">
      <div className="px-6 py-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">{t('settings.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('settings.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* GitHub Token Section */}
          <section className="rounded-xl border border-border/50 bg-card/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">{t('settings.githubToken')}</h2>
              {tokenStatus === "valid" && (
                <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 ml-auto">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> {t('settings.connected')}
                </Badge>
              )}
              {tokenStatus === "invalid" && (
                <Badge variant="outline" className="text-[9px] border-red-500/30 text-red-400 ml-auto">
                  <AlertCircle className="w-3 h-3 mr-1" /> {t('settings.invalid')}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {t('settings.tokenDesc')}
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setTokenStatus("unknown"); }}
                  placeholder={t('settings.tokenPlaceholder')}
                  className="bg-background/50 pr-20 font-mono text-xs"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleTestToken} className="bg-transparent border-border/60 gap-1.5 text-xs">
                <Shield className="w-3 h-3" /> {t('settings.testToken')}
              </Button>
            </div>
          </section>

          {/* Sync Schedule Section */}
          <section className="rounded-xl border border-border/50 bg-card/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">{t('settings.syncSchedule')}</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {t('settings.syncDesc')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">{t('settings.frequency')}</Label>
                <Select value={cronPreset} onValueChange={setCronPreset}>
                  <SelectTrigger className="bg-background/50 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRON_PRESETS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {cronPreset === "custom" && (
                  <Input
                    value={customCron}
                    onChange={(e) => setCustomCron(e.target.value)}
                    placeholder="0 */6 * * *"
                    className="bg-background/50 font-mono text-xs h-9"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t('settings.concurrency')}</Label>
                <Select value={concurrency} onValueChange={setConcurrency}>
                  <SelectTrigger className="bg-background/50 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n > 1 ? t('settings.sourcesAtATimePlural', { count: n }) : t('settings.sourcesAtATime', { count: n })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 gap-1.5"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('settings.saveSettings')}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
