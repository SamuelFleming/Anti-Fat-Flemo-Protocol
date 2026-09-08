export type DailyOrWeeklyStatus = 'on-track' | 'partial' | 'off-track' | 'mixed' | 'awaiting-data'

const STATUS_LABEL: Record<DailyOrWeeklyStatus, string> = {
  'on-track': 'On track',
  partial: 'Partial',
  'off-track': 'Off track',
  mixed: 'Mixed',
  'awaiting-data': 'Awaiting data',
}

const DAILY_STATUS_NOTE: Record<DailyOrWeeklyStatus, string> = {
  'on-track': 'Calories and Move are both tracking close to target.',
  partial: 'One of Calories or Move is off target today.',
  'off-track': 'Both Calories and Move are meaningfully off target today.',
  mixed: 'Some days this week were on track, others were not.',
  'awaiting-data': 'Log a meal or Move to see today\u2019s status.',
}

export function statusLabel(status: DailyOrWeeklyStatus | null): string {
  return status ? STATUS_LABEL[status] : 'Awaiting data'
}

export function statusNote(status: DailyOrWeeklyStatus | null): string {
  return status ? DAILY_STATUS_NOTE[status] : DAILY_STATUS_NOTE['awaiting-data']
}
