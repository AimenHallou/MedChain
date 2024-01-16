// src/config/settings.ts

import { Settings } from '../objects/settings';

const loadSettings = (): Settings => {
  const fileContents = localStorage.getItem('settings');
  let settings: Settings = { storageMode: 'database' };

  if (fileContents) {
    settings = JSON.parse(fileContents) as Settings;
  }

  return settings;
};

const saveSettings = (newSettings: Partial<Settings>): void => {
  const currentSettings = loadSettings();
  const updatedSettings = { ...currentSettings, ...newSettings };
  localStorage.setItem('settings', JSON.stringify(updatedSettings));
};

const getSetting = <K extends keyof Settings>(key: K): Settings[K] => {
  const settings = loadSettings();
  return settings[key];
};

export { loadSettings, saveSettings, getSetting };
