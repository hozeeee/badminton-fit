import type { Backup, Checkin, Enrollment, Plan } from '../types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mergeBackups, validateBackup } from '../utils/backup'

export let storageWarning = ''
const memory = new Map<string, string>()
const storage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key) }
    catch { storageWarning = '浏览器禁止本地存储，当前数据仅在本次会话有效，请及时导出。'; return memory.get(key) || null }
  },
  setItem: (key: string, value: string) => {
    memory.set(key, value)
    try { localStorage.setItem(key, value) }
    catch { storageWarning = '本地存储不可写或空间不足，请立即导出备份；刷新可能丢失变更。' }
  },
  removeItem: (key: string) => {
    memory.delete(key); try { localStorage.removeItem(key) }
    catch { /* 内存存储仍可用。 */ }
  },
}
interface State {
  plans: Plan[]
  enrollment: Enrollment | null
  checkins: Checkin[]
  theme: 'system' | 'light' | 'dark'
  setTheme: (theme: State['theme']) => void
  savePlan: (plan: Plan) => void
  enroll: (enrollment: Enrollment | null) => void
  saveCheckin: (checkin: Checkin) => void
  importData: (data: unknown, merge: boolean) => void
  clear: () => void
}
export const useStore = create<State>()(persist((set, get) => ({
  plans: [],
  enrollment: null,
  checkins: [],
  theme: 'system',
  setTheme: theme => set({ theme }),
  savePlan: (plan) => {
    validateBackup({ ...exportData(), plans: [...get().plans.filter(p => p.id !== plan.id), plan] })
    set({ plans: [...get().plans.filter(p => p.id !== plan.id), plan] })
  },
  enroll: enrollment => set({ enrollment }),
  saveCheckin: (checkin) => {
    const checkins = [...get().checkins.filter(c => !(c.date === checkin.date && c.planId === checkin.planId)), checkin]
    validateBackup({ ...exportData(), checkins })
    set({ checkins })
  },
  importData: (value, merge) => {
    const data = validateBackup(value)
    const result = merge ? mergeBackups(exportData(), data) : data
    set({ plans: result.plans, checkins: result.checkins, enrollment: result.enrollment })
  },
  clear: () => set({ plans: [], enrollment: null, checkins: [] }),
}), {
  name: 'badminton-fit',
  version: 1,
  storage: createJSONStorage(() => storage),
  partialize: state => ({ plans: state.plans, enrollment: state.enrollment, checkins: state.checkins, theme: state.theme }),
  merge: (persisted, current) => {
    // 首次访问没有存储时 zustand 也会以 undefined 调用 merge，此时不应提示不兼容。
    if (persisted == null)
      return current
    try {
      const p = persisted as Partial<State>
      const data = validateBackup({ version: 1, plans: p.plans, enrollment: p.enrollment, checkins: p.checkins })
      return { ...current, ...data, theme: ['system', 'light', 'dark'].includes(p.theme || '') ? p.theme! : 'system' }
    }
    catch { storageWarning = '本地数据版本或格式不兼容，未加载；可通过 JSON 备份恢复。'; return current }
  },
  migrate: () => { storageWarning = '旧版数据需要通过备份导入迁移。'; return { plans: [], enrollment: null, checkins: [], theme: 'system' } },
}))
export function exportData(): Backup {
  const { plans, enrollment, checkins } = useStore.getState()
  return { version: 1, plans, enrollment, checkins }
}
