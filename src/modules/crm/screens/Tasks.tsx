import { useMemo } from 'react';
import { useCrmStore } from '../store';

export default function TasksScreen(){
  const { contacts } = useCrmStore();
  const items = useMemo(()=> {
    const out: {id:string; title:string; contact:string; category?:string; dueAt?:string}[] = [];
    for (const c of contacts) for (const t of (c.tasks ?? [])) out.push({ id:t.id, title:t.title, contact:c.name, category:t.category, dueAt:t.dueAt });
    return out;
  }, [contacts]);

  return (
    <div style={{display:'grid', gap:12}}>
      <h2>Aufgaben</h2>
      <div style={{opacity:.7}}>{items.length} Aufgaben gesamt</div>
      <div style={{display:'grid', gap:8}}>
        {items.map(it=>(
          <div key={it.id} style={{border:'1px solid #eee', borderRadius:8, padding:10}}>
            <div style={{fontWeight:600}}>{it.title}</div>
            <div style={{opacity:.7, fontSize:12}}>
              {it.contact}
              {it.category ? ` · ${label(it.category)}` : ''}
              {it.dueAt ? ` · fällig ${new Date(it.dueAt).toLocaleDateString()}` : ''}
            </div>
          </div>
        ))}
        {!items.length && <div style={{opacity:.6}}>Keine Aufgaben vorhanden.</div>}
      </div>
    </div>
  );
}

function label(cat:string){
  const map:Record<string,string>={
    gartenarbeit:'Gartenarbeit', it_support:'IT Support', copywriting:'Copywriting',
    anruf:'Anruf', email:'E-Mail', warte_auf_antwort:'Warte auf Antwort'
  };
  return map[cat] ?? cat;
}
