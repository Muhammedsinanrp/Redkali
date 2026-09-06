'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Globe,
  ExternalLink,
  Maximize2,
  BookOpen,
  X,
  Copy,
  Check,
  Shield,
  Activity,
} from 'lucide-react';
import { useTranslation } from '@/i18n';

interface OsirisLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OsirisLauncherModal({ isOpen, onClose }: OsirisLauncherModalProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText('https://osirisai.live/');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleOpenPopout = () => {
    const width = Math.min(window.screen.availWidth - 40, 1440);
    const height = Math.min(window.screen.availHeight - 60, 920);
    const left = Math.max(0, Math.floor((window.screen.availWidth - width) / 2));
    const top = Math.max(0, Math.floor((window.screen.availHeight - height) / 2));

    window.open(
      'https://osirisai.live/',
      'osiris_workstation',
      `width=${width},height=${height},top=${top},left=${left},menubar=no,status=no,toolbar=no,location=yes,scrollbars=yes,resizable=yes`,
    );
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          key="osiris-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          key="osiris-modal"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-[680px] max-w-full bg-[var(--bg-primary,#06090e)]/95 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.18)] overflow-hidden z-10 flex flex-col font-mono"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Scanline effect */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-cyan-900/40 flex items-center justify-between bg-cyan-950/20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center">
                <Globe size={20} className="text-cyan-400" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-[0.25em] text-[var(--text-primary,#e2e8f0)] text-glow">
                    {t('osiris.title')}
                  </h2>
                  <span className="px-1.5 py-0.5 text-[9px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 tracking-wider">
                    {t('osiris.badge')}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted,#94a3b8)] tracking-widest mt-0.5">
                  {t('osiris.subtitle')}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 border border-[var(--border-primary,#1e293b)] hover:border-red-500/50 flex items-center justify-center text-[var(--text-muted,#94a3b8)] hover:text-red-400 transition-colors hover:bg-red-950/20"
              title="Close modal (Esc)"
            >
              <X size={15} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto styled-scrollbar">
            {/* Live Operational Status Banner */}
            <div className="bg-cyan-950/30 border border-cyan-500/30 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <div>
                  <div className="text-[11px] text-emerald-400 font-bold tracking-widest">
                    {t('osiris.status')}
                  </div>
                  <div className="text-[10px] text-cyan-200/70 tracking-wide font-sans mt-0.5">
                    Live flight radar, satellites, CCTV network feeds, and client-side recon tools.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] text-cyan-400/80 bg-black/40 px-2 py-1 border border-cyan-900/50 truncate max-w-[200px]">
                  osirisai.live
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="p-1 border border-cyan-900/50 hover:border-cyan-400 bg-black/40 text-cyan-400 hover:text-cyan-200 transition-colors"
                  title="Copy URL"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Feature Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-black/40 border border-[var(--border-primary,#1e293b)] hover:border-cyan-500/40 transition-colors flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Globe size={14} />
                  <span className="text-[11px] font-bold tracking-wider">3D Globe</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted,#94a3b8)] leading-relaxed font-sans">
                  Track 10K+ aircraft (commercial, military & private), 2,000+ satellites, and 1,400+ public worldwide CCTV feeds.
                </p>
              </div>

              <div className="p-3 bg-black/40 border border-[var(--border-primary,#1e293b)] hover:border-cyan-500/40 transition-colors flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Shield size={14} />
                  <span className="text-[11px] font-bold tracking-wider">Recon Tools</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted,#94a3b8)] leading-relaxed font-sans">
                  Execute Nmap TCP port scans, DNS lookups, WHOIS / RDAP queries, and SSL transparency certificate searches.
                </p>
              </div>

              <div className="p-3 bg-black/40 border border-[var(--border-primary,#1e293b)] hover:border-cyan-500/40 transition-colors flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Activity size={14} />
                  <span className="text-[11px] font-bold tracking-wider">20+ Live Feeds</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted,#94a3b8)] leading-relaxed font-sans">
                  Real-time earthquakes, NASA FIRMS thermal wildfire maps, maritime AIS vessels, severe weather, and threat intelligence.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://osirisai.live/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/15 border border-cyan-500/60 hover:bg-cyan-500/25 hover:border-cyan-400 transition-all text-cyan-300 hover:text-cyan-100 text-[11px] tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(6,182,212,0.2)] text-center group"
              >
                <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>{t('osiris.launchTab')}</span>
              </a>

              <button
                type="button"
                onClick={handleOpenPopout}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-black/50 border border-cyan-500/30 hover:border-cyan-400/70 hover:bg-cyan-950/30 transition-all text-cyan-400 hover:text-cyan-200 text-[11px] tracking-[0.2em] font-bold text-center"
              >
                <Maximize2 size={14} />
                <span>{t('osiris.launchPopout')}</span>
              </button>
            </div>

            {/* Secondary links & Info */}
            <div className="flex items-center justify-between pt-2 border-t border-cyan-900/30 text-[10px] text-[var(--text-muted,#94a3b8)]">
              <a
                href="https://osirisai.live/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors py-1"
              >
                <BookOpen size={12} />
                <span>{t('osiris.documentation')}</span>
              </a>

              <span className="text-[9px] opacity-60 tracking-wider">
                FREE & OPEN-SOURCE OSINT ECOSYSTEM
              </span>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3 border-t border-cyan-900/40 bg-black/60 flex items-center justify-between">
            <span className="text-[10px] text-cyan-500/60 tracking-widest">
              HTTPS://OSIRISAI.LIVE/
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-[var(--border-primary,#1e293b)] hover:border-cyan-500/40 text-[10px] text-[var(--text-muted,#94a3b8)] hover:text-[var(--text-primary,#e2e8f0)] tracking-widest transition-colors"
            >
              {t('osiris.close')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
