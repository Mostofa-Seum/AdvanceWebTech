'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { BellIcon } from '@heroicons/react/24/outline'

/**
 * Bell dropdown showing in-app notifications for the logged-in company or
 * employee. `role` selects the API prefix and `idKey` selects which ID from
 * the stored user object to pass as the query param.
 *
 *   <NotificationsBell role="company" idKey="companyId" />
 *   <NotificationsBell role="employee" idKey="employeeId" />
 */
export default function NotificationsBell({
  role,
  idKey,
}: {
  role: 'company' | 'employee'
  idKey: 'companyId' | 'employeeId'
}) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return
    try {
      const user = JSON.parse(stored)
      const id = user?.company?.[idKey] ?? user?.employee?.[idKey]
      const token = localStorage.getItem('token')
      if (!id) return
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get(`http://localhost:3000/${role}/notifications?${role === 'company' ? 'companyId' : 'employeeId'}=${id}`)
        .then((res) => setItems(res.data))
        .catch(() => {})
    } catch {}
  }, [role, idKey, open])

  const unread = items.filter((n) => !n.isRead).length

  const markAllRead = async () => {
    const stored = localStorage.getItem('user')
    if (!stored) return
    try {
      const user = JSON.parse(stored)
      const id = user?.company?.[idKey] ?? user?.employee?.[idKey]
      await axios.patch(`http://localhost:3000/${role}/notifications/read-all?${role === 'company' ? 'companyId' : 'employeeId'}=${id}`)
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {}
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-brand-black hover:text-brand-red hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-brand-black"
      >
        <BellIcon className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-red border-2 border-white" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border-2 border-brand-black shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] z-50 max-h-[480px] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-brand-black bg-brand-black text-white">
            <span className="text-xs font-black uppercase tracking-widest">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-bold uppercase tracking-widest text-brand-red hover:text-white transition-colors">
                Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold uppercase tracking-widest text-gray-500">No notifications</div>
          ) : (
            items.map((n) => (
              <div key={n.notificationId} className={`px-4 py-3 border-b border-gray-200 ${n.isRead ? 'bg-white' : 'bg-brand-red/5'}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-wider text-brand-black">{n.title}</p>
                  {!n.isRead && <span className="w-2 h-2 bg-brand-red flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-gray-700 mt-1">{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
