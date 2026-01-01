export const THEMES = ['taiwan', 'us_cn_trade', 'japan_risk', 'travel'] as const;
export type Theme = typeof THEMES[number];

export const THEME_LABELS: Record<Theme, string> = {
  taiwan: '台湾',
  us_cn_trade: '米中',
  japan_risk: '日本',
  travel: '渡航',
};

export const TRAVEL_SIGNAL_TYPES = [
  'embassy_consular',
  'advisory',
  'visa_entry',
  'aviation',
  'payments_finance',
  'insurance',
  'none',
] as const;
export type TravelSignalType = typeof TRAVEL_SIGNAL_TYPES[number];

export const TRAVEL_TYPE_LABELS: Record<TravelSignalType, string> = {
  embassy_consular: '大使館・領事館',
  advisory: '渡航勧告',
  visa_entry: 'ビザ・入国',
  aviation: '航空',
  payments_finance: '金融・決済',
  insurance: '保険',
  none: 'なし',
};

export const DEFAULT_MAX_RAW_PER_DAY = 200;
export const DEFAULT_MAX_DEEP_PER_RUN = 10;
export const DEFAULT_LLM_MODE = 'off';
export const DEFAULT_LLM_MODEL = 'gpt-4o-mini';
