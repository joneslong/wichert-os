import { useState } from 'react';
import { useCrmStore } from '../store';
import type { Kontakt } from '../../../shared/types';

export default function AddContactInline(){
  const { add, filter, setSegment } = useCrmStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [firma, setFirma] = useState('');
  const [segment, setSeg] = useState<'arbeit'|'familie'>(filter.segment);
  const [kategorie, setKategorie] = useState<string>(segment === 'arbeit' ? 'leads' : 'freizeit');

  const catsArbeit   = ['leads','kontaktiert','prozess','retainer'];
  const catsFamilie  = ['freizeit','kindergarten','familie','freunde'];
  const cats = segment === 'arbeit' ? catsArbeit : catsFamilie;

  function onSave(){
    if (!name.trim()) return;
    const payload: Omit<Kontakt,'id'|'updatedAt'> = { name, firma: firma || undefined, segment, kategorie };
    add(payload);
    setSegment(segment); // sicherstellen, dass der neue Kontakt sichtbar ist
    setName(''); setFirma(''); setOpen(false);
  }

  return (
    <div style={{margin:'8px 0'}}>
      {!open ? (
        <button onClick={()=>setOpen(true)} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8}}>
          + Kontakt
        </button>
      ) : (
        <div style={{display:'grid', gap:8, border:'1px solid #eee', borderRadius:12, padding:12, background:'#fafafa'}}>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <input placeholder="Name *" value={name} onChange={e=>setName(e.target.value)}
                   style={{padding:'8px 10px', border:'1px solid #ddd', borderRadius:8, minWidth:200}}/>
            <input placeholder="Firma" value={firma} onChange={e=>setFirma(e.target.value)}
                   style={{padding:'8px 10px', border:'1px solid #ddd', borderRadius:8, minWidth:180}}/>
            <select value={segment} onChange={e=>{ const s = e.target.value as 'arbeit'|'familie'; setSeg(s); setKategorie(s==='arbeit'?'leads':'freizeit'); }}
                    style={{padding:'8px 10px', border:'1px solid #ddd', borderRadius:8}}>
              <option value="arbeit">Arbeit</option>
              <option value="familie">Familie</option>
            </select>
            <select value={kategorie} onChange={e=>setKategorie(e.target.value)}
                    style={{padding:'8px 10px', border:'1px solid #ddd', borderRadius:8}}>
              {cats.map(c => <option key={c} value={c}>{label(c)}</option>)}
            </select>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={onSave} style={{padding:'8px 12px', border:'1px solid #111', borderRadius:8, background:'#111', color:'#fff'}}>Speichern</button>
            <button onClick={()=>setOpen(false)} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8}}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}

function label(val: string) {
  const map: Record<string,string> = {
    leads: 'Leads',
    kontaktiert: 'Kontaktiert',
    prozess: 'Prozess',
    retainer: 'Retainer',
    freizeit: 'Freizeit',
    kindergarten: 'Kindergarten',
    familie: 'Familie',
    freunde: 'Freunde',
  };
  return map[val] ?? val;
}
