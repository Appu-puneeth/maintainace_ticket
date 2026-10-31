import React, { useState } from 'react';
import { Settings, X, Globe, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const SettingsModal = ({ isOpen, onClose, onRefresh }) => {
  const { apiUrl, updateApiUrl, isLiveApiConnected } = useAuth();
  const [urlInput, setUrlInput] = useState(apiUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateApiUrl(urlInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetSeed = () => {
    if (confirm('Reset all demo tickets, users and categories to initial default state?')) {
      api.resetData();
      if (onRefresh) onRefresh();
      alert('Local database reset successfully!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Settings className="w-5 h-5" />
            </span>
            <h3 className="text-base font-extrabold text-slate-900">CampusOS & API Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>CampusOS Base URL:</span>
            </label>
            <input
              type="text"
              placeholder="e.g. http://localhost:5000/api/v1 or {baseUrl}"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Leave blank to use integrated local mock backend. Enter your competition organizer URL if provided.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Connection Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full ${
                  isLiveApiConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {isLiveApiConnected ? 'Connected to Live Server' : 'Active Local Store'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetSeed}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors"
            >
              {savedSuccess ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

