import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemeAccent = 'indigo' | 'emerald' | 'violet' | 'ocean' | 'amber' | 'rose' | 'cyber';

export interface ThemeOption {
  id: string;
  name: string;
  mode: ThemeMode;
  accent: ThemeAccent;
  label: string;
  primaryColor: string;
  accentColor: string;
  bgPreview: string;
  description: string;
}

export const THEME_PRESETS: ThemeOption[] = [
  {
    id: 'modern_indigo',
    name: 'Modern Indigo',
    mode: 'light',
    accent: 'indigo',
    label: 'Modern Indigo (Light)',
    primaryColor: '#4f46e5',
    accentColor: '#818cf8',
    bgPreview: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    description: 'Clean modern corporate look with deep indigo accents and crisp typography.',
  },
  {
    id: 'obsidian_dark',
    name: 'Obsidian Dark',
    mode: 'dark',
    accent: 'cyber',
    label: 'Obsidian Dark (Cyber Slate)',
    primaryColor: '#06b6d4',
    accentColor: '#38bdf8',
    bgPreview: 'bg-slate-900 border-cyan-500 text-cyan-400',
    description: 'Ultra-sleek dark theme with deep midnight surfaces and glowing cyan accents.',
  },
  {
    id: 'royal_violet',
    name: 'Royal Purple',
    mode: 'light',
    accent: 'violet',
    label: 'Royal Purple (Executive)',
    primaryColor: '#7c3aed',
    accentColor: '#a78bfa',
    bgPreview: 'bg-purple-50 border-purple-200 text-purple-700',
    description: 'Sophisticated luxury violet palette with crisp contrast and modern cards.',
  },
  {
    id: 'emerald_pro',
    name: 'Emerald Mint',
    mode: 'light',
    accent: 'emerald',
    label: 'Emerald Mint (Fintech)',
    primaryColor: '#059669',
    accentColor: '#34d399',
    bgPreview: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    description: 'Fresh mint and forest emerald tones designed for high productivity.',
  },
  {
    id: 'ocean_azure',
    name: 'Ocean Azure',
    mode: 'light',
    accent: 'ocean',
    label: 'Ocean Azure (Sky Tech)',
    primaryColor: '#0284c7',
    accentColor: '#38bdf8',
    bgPreview: 'bg-sky-50 border-sky-200 text-sky-700',
    description: 'Dynamic cloud azure and ocean cyan engineered for modern dashboards.',
  },
  {
    id: 'sunset_amber',
    name: 'Sunset Amber',
    mode: 'light',
    accent: 'amber',
    label: 'Sunset Amber (Warm Gold)',
    primaryColor: '#d97706',
    accentColor: '#fbbf24',
    bgPreview: 'bg-amber-50 border-amber-200 text-amber-700',
    description: 'Warm gold and copper tones offering an elegant, high-focus editorial aesthetic.',
  },
  {
    id: 'dark_violet',
    name: 'Midnight Violet',
    mode: 'dark',
    accent: 'violet',
    label: 'Midnight Violet (Dark)',
    primaryColor: '#8b5cf6',
    accentColor: '#c084fc',
    bgPreview: 'bg-slate-950 border-violet-500 text-violet-400',
    description: 'Deep nocturnal dark mode with vibrant ultraviolet accents.',
  },
  {
    id: 'dark_emerald',
    name: 'Matrix Emerald',
    mode: 'dark',
    accent: 'emerald',
    label: 'Matrix Emerald (Dark)',
    primaryColor: '#10b981',
    accentColor: '#6ee7b7',
    bgPreview: 'bg-slate-950 border-emerald-500 text-emerald-400',
    description: 'High-contrast nocturnal theme with vivid emerald signals.',
  },
];

interface ThemeContextType {
  mode: ThemeMode;
  accent: ThemeAccent;
  activePresetId: string;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
  toggleMode: () => void;
  selectPreset: (presetId: string) => void;
  presets: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Read saved theme or default to a fresh modern theme
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('opmt_theme_mode');
    if (saved === 'dark' || saved === 'light') return saved;
    // If user clicked thame change karo, let's provide a refreshed experience
    const oldTheme = localStorage.getItem('app_theme');
    if (oldTheme === 'dark') return 'dark';
    return 'dark'; // New changed theme default: Obsidian Dark!
  });

  const [accent, setAccentState] = useState<ThemeAccent>(() => {
    const saved = localStorage.getItem('opmt_theme_accent') as ThemeAccent;
    if (saved) return saved;
    return 'cyber'; // Default to sleek cyber / cyan
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    return localStorage.getItem('opmt_theme_preset') || 'obsidian_dark';
  });

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('opmt_theme_mode', mode);
    localStorage.setItem('app_theme', mode);
    localStorage.setItem('opmt_theme_accent', accent);
    localStorage.setItem('opmt_theme_preset', activePresetId);

    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-accent', accent);
    root.setAttribute('data-theme-preset', activePresetId);
    root.setAttribute('data-theme-mode', mode);
  }, [mode, accent, activePresetId]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    // Find matching preset
    const matching = THEME_PRESETS.find((p) => p.mode === newMode && p.accent === accent);
    if (matching) {
      setActivePresetId(matching.id);
    }
  };

  const setAccent = (newAccent: ThemeAccent) => {
    setAccentState(newAccent);
    const matching = THEME_PRESETS.find((p) => p.mode === mode && p.accent === newAccent);
    if (matching) {
      setActivePresetId(matching.id);
    }
  };

  const toggleMode = () => {
    const newMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  };

  const selectPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setModeState(preset.mode);
      setAccentState(preset.accent);
      setActivePresetId(preset.id);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        accent,
        activePresetId,
        setMode,
        setAccent,
        toggleMode,
        selectPreset,
        presets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
