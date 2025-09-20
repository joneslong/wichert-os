import * as React from "react"
import { Modal } from "./modal"
import { Input } from "./input"
import { Button } from "./button"

export type ContactModalValue = {
  id: string
  name: string
  email?: string
  phone?: string
  projectId: string
  group?: string
}

export function ContactModal({
  open, onClose, value, onSave, projects
}: {
  open: boolean
  onClose: () => void
  value: ContactModalValue | null
  onSave: (v: ContactModalValue) => void
  projects: { id: string; name: string }[]
}) {
  const [draft, setDraft] = React.useState<ContactModalValue | null>(value)
  React.useEffect(() => setDraft(value), [value])
  if (!draft) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Kontakt bearbeiten"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
          <Button onClick={() => { onSave(draft); onClose() }}>Speichern</Button>
        </div>
      }
    >
      <div className="space-y-3 text-sm">
        <div>
          <label className="block text-xs opacity-70 mb-1">Name</label>
          <Input value={draft.name} onChange={(e)=>setDraft({...draft, name: e.target.value})}/>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs opacity-70 mb-1">E-Mail</label>
            <Input value={draft.email||""} onChange={(e)=>setDraft({...draft, email: e.target.value||undefined})}/>
          </div>
          <div>
            <label className="block text-xs opacity-70 mb-1">Telefon</label>
            <Input value={draft.phone||""} onChange={(e)=>setDraft({...draft, phone: e.target.value||undefined})}/>
          </div>
        </div>
        <div>
          <label className="block text-xs opacity-70 mb-1">Projekt</label>
          <select
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1"
            value={draft.projectId}
            onChange={(e)=>setDraft({...draft, projectId: e.target.value})}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs opacity-70 mb-1">Gruppe (optional)</label>
          <Input value={draft.group||""} onChange={(e)=>setDraft({...draft, group: e.target.value||undefined})}/>
        </div>
      </div>
    </Modal>
  )
}
