// API Configuration
// WARNING: These keys are exposed in the browser and can be accessed by anyone
// For production, consider using Lovable Cloud for secure backend API calls

export const config = {
  // AI API Keys
  geminiApiKey: "AIzaSyBXSgxumHxfX1UqfXSARoeV_ZeJGd7VOWY",
  searpApiKey: "777efdd7b8ed7201f33c5d87b4326203566645fcabb4a5e220804b1958ad9baa",
  groqCloudApiKey: "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",
  
  // Environment Settings
  mode: "development",
  apiBaseUrl: "http://localhost:3001",
  analyticsId: "",
  
  // Feature Flags
  enableAiAnalysis: true,
  enableRealTimeUpdates: true,
  enableExportFeatures: true,
  
  // AI Configuration
  maxOpportunitiesPerSearch: 10,
  aiResponseTimeout: 30000,
  cacheDuration: 3600000,
  mockApi: true,
} as const;

export type Config = typeof config;
