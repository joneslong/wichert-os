import React, { useState } from 'react';
import { useCrmStore } from '../store';
import type { TaskCategory } from '../../../shared/types';

type Props = { id: string; onClose: () => void };

export default function ContactDrawer({ id, onClose }: Props) {
  const { contacts, update, addNote, addTask, addPipeline } = useCrmStore();
  const k = contacts.find(c => c.id === id);

  // Local form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCat, setTaskCat] = useState<TaskCategory | ''>('');
  const [pLabel, setPLabel] = useState('Erstkontakt');
  const [pNote, setPNote] = useState('');
  const [pWhen, setPWhen] = useState<string>(''); // datetime-local

  if (!k) return null;

  // ---- Handlers
  const closeOnEsc: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Escape') onClose();
  };

  const addNoteNow = () => {
    if (!noteTitle.trim() && !noteBody.trim()) return;
    addNote(k.id, { title: noteTitle || 'Notiz', content: noteBody });
    setNoteTitle(''); setNoteBody('');
  };

  const addTaskNow = () => {
    if (!taskTitle.trim()) return;
    addTask(k.id, { title: taskTitle, category: taskCat || undefined });
    setTaskTitle(''); setTaskCat('');
  };

  const addPipelineNow = () => {
    const iso = pWhen ? new Date(pWhen).toISOString() : new Date().toISOString();
    addPipeline(k.id, { label: pLabel, date: iso, note: pNote || undefined });
    setPNote(''); setPWhen('');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={styles.backdrop}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Kontakt bearbeiten"
        tabIndex={-1}
        onKeyDown={closeOnEsc}
        onClick={(e) => e.stopPropagation()}
        style={styles.panel}
      >
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              {k.name}{k.firma ? ` – ${k.firma}` : ''}
            </div>
            <div style={{ opacity: .65, fontSize: 12 }}>{k.segment === 'arbeit' ? '🗒️ Arbeit' : '🌳 Familie'}</div>
          </div>
          <button onClick={onClose} style={styles.btnGhost}>Schließen (Esc)</button>
        </div>

        {/* Details */}
        <section style={styles.section}>
          <h4 style={styles.h4}>Details</h4>
          <div style={styles.grid2}>
            <label style={styles.label}>Telefon
              <input value={k.telefon ?? ''} onChange={e => update(k.id, { telefon: e.target.value || undefined })} style={styles.input} />
            </label>
            <label style={styles.label}>E-Mail
              <input value={k.email ?? ''} onChange={e => update(k.id, { email: e.target.value || undefined })} style={styles.input} />
            </label>
            <label style={styles.label}>Adresse
              <input value={k.adresse ?? ''} onChange={e => update(k.id, { adresse: e.target.value || undefined })} style={styles.input} />
            </label>
            <label style={styles.label}>Website
              <input value={k.website ?? ''} onChange={e => update(k.id, { website: e.target.value || undefined })} style={styles.input} />
            </label>
          </div>
        </section>

        {/* Pipeline */}
        <section style={styles.section}>
          <h4 style={styles.h4}>Pipeline</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
            <select value={pLabel} onChange={e => setPLabel(e.target.value)} style={styles.input}>
              <option>Erstkontakt</option>
              <option>FollowUp1</option>
              <option>FollowUp2</option>
              <option>Custom</option>
            </select>
            {pLabel === 'Custom' && (
              <input placeholder="Eigenes Label…" onChange={e => setPLabel(e.target.value)} style={styles.input} />
            )}
            <input type="datetime-local" value={pWhen} onChange={e => setPWhen(e.target.value)} style={styles.input} />
            <input placeholder="Notiz (optional)" value={pNote} onChange={e => setPNote(e.target.value)} style={styles.input} />
            <button onClick={addPipelineNow} style={styles.btnPrimary}>+ Schritt</button>
          </div>

          <ol style={{ margin: '8px 0 0 18px', padding: 0, display: 'grid', gap: 6 }}>
            {(k.pipeline ?? []).map(s => (
              <li key={s.id}>
                <b>{s.label}</b> – {new Date(s.date).toLocaleString()} {s.note ? `– ${s.note}` : ''}
              </li>
            ))}
            {(!k.pipeline || !k.pipeline.length) && <div style={{ opacity: .6 }}>Noch keine Pipeline-Schritte.</div>}
          </ol>
        </section>

        {/* Notizen */}
        <section style={styles.section}>
          <h4 style={styles.h4}>Notizen</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <input placeholder="Titel" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} style={styles.input} />
            <button onClick={addNoteNow} style={styles.btnPrimary}>+ Notiz</button>
          </div>
          <textarea placeholder="Inhalt…" value={noteBody} onChange={e => setNoteBody(e.target.value)} rows={4} style={{ ...styles.input, resize: 'vertical' }} />
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            {(k.notes ?? []).map(n => (
              <NoteItem key={n.id} contactId={k.id} noteId={n.id} />
            ))}
            {(!k.notes || !k.notes.length) && <div style={{ opacity: .6 }}>Noch keine Notizen.</div>}
          </div>
        </section>

        {/* Aufgaben */}
        <section style={styles.section}>
          <h4 style={styles.h4}>Aufgaben</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <input placeholder="Neue Aufgabe…" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} style={styles.input} />
            <select value={taskCat} onChange={e => setTaskCat(e.target.value as TaskCategory)} style={styles.input}>
              <option value="">Kategorie…</option>
              <option value="gartenarbeit">Gartenarbeit</option>
              <option value="it_support">IT Support</option>
              <option value="copywriting">Copywriting</option>
              <option value="anruf">Anruf</option>
              <option value="email">E-Mail</option>
              <option value="warte_auf_antwort">Warte auf Antwort</option>
            </select>
            <button onClick={addTaskNow} style={styles.btnPrimary}>+ Aufgabe</button>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {(k.tasks ?? []).map(t => (
              <li key={t.id}>
                {t.title}
                {t.category ? ` · ${taskLabel(t.category)}` : ''}
                {t.dueAt ? ` – fällig ${new Date(t.dueAt).toLocaleDateString()}` : ''}
              </li>
            ))}
            {(!k.tasks || !k.tasks.length) && <div style={{ opacity: .6 }}>Noch keine Aufgaben.</div>}
          </ul>
        </section>
      </div>
    </>
  );
}

/** Einzelne Notiz inkl. Bearbeiten */
function NoteItem({ contactId, noteId }: { contactId: string; noteId: string }) {
  const { contacts, update } = useCrmStore();
  const k = contacts.find(c => c.id === contactId);
  const n = k?.notes?.find(x => x.id === noteId);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(n?.title ?? '');
  const [content, setContent] = useState(n?.content ?? '');

  if (!k || !n) return null;

  const save = () => {
    const nextNotes = (k.notes ?? []).map(x => x.id === n.id ? { ...x, title, content } : x);
    update(k.id, { notes: nextNotes });
    setEditing(false);
  };

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
      {!editing ? (
        <>
          <div style={{ fontWeight: 600 }}>{n.title}</div>
          <div style={{ opacity: .7, fontSize: 12 }}>{new Date(n.createdAt).toLocaleString()}</div>
          <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{n.content}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setEditing(true)} style={{ ...styles.btnGhost, padding: '6px 10px' }}>Bearbeiten</button>
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} style={styles.input} />
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} style={{ ...styles.input, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} style={styles.btnPrimary}>Speichern</button>
            <button onClick={() => { setTitle(n.title); setContent(n.content ?? ''); setEditing(false); }} style={styles.btnGhost}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Helpers

function taskLabel(cat: TaskCategory) {
  const map: Record<TaskCategory, string> = {
    gartenarbeit: 'Gartenarbeit',
    it_support: 'IT Support',
    copywriting: 'Copywriting',
    anruf: 'Anruf',
    email: 'E-Mail',
    warte_auf_antwort: 'Warte auf Antwort',
  };
  return map[cat] ?? cat;
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed', inset: 0 as any, background: 'rgba(0,0,0,.25)', zIndex: 49
  },
  panel: {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: '720px',
    background: '#fff', borderLeft: '1px solid #eee',
    boxShadow: '-8px 0 16px rgba(0,0,0,.08)',
    padding: '16px', overflow: 'auto', zIndex: 50
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12
  },
  section: { marginTop: 12, marginBottom: 16 },
  h4: { margin: '0 0 8px 0' },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8
  },
  label: { display: 'grid', gap: 4, fontSize: 12 },
  input: {
    padding: '8px 10px', border: '1px solid #ddd', borderRadius: 8, minWidth: 160
  },
  btnPrimary: {
    padding: '8px 12px', border: '1px solid #111', borderRadius: 8, background: '#111', color: '#fff', cursor: 'pointer'
  },
  btnGhost: {
    padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, background: '#f7f7f7', cursor: 'pointer'
  }
};
