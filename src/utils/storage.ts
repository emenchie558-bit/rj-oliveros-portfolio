import { PortfolioData } from '../types/portfolio';
import { defaultPortfolioData } from '../data/defaultPortfolio';

const STORAGE_KEY = 'reiner_portfolio_data_v1';

export function getPortfolioData(): PortfolioData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultPortfolioData;
    const parsed = JSON.parse(saved);
    return {
      ...defaultPortfolioData,
      ...parsed,
      personalDetails: { ...defaultPortfolioData.personalDetails, ...(parsed.personalDetails || {}) },
      socialLinks: { ...defaultPortfolioData.socialLinks, ...(parsed.socialLinks || {}) }
    };
  } catch (e) {
    console.error('Error loading portfolio data from localStorage:', e);
    return defaultPortfolioData;
  }
}

export function savePortfolioData(data: PortfolioData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving portfolio data:', e);
    return false;
  }
}

export function resetPortfolioData(): PortfolioData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing portfolio storage:', e);
  }
  return defaultPortfolioData;
}

export function exportPortfolioJSON(data: PortfolioData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reiner_oliveros_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
