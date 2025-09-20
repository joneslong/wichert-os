import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable, { Column } from '../../ui/components/DataTable';
import SegmentSwitch from '../../ui/components/SegmentSwitch';
import CategoryChips from '../../ui/components/CategoryChips';
import SearchInput from '../../ui/components/SearchInput';
import AddContactInline from '../components/AddContactInline';
import StatusBadge from '../../ui/components/StatusBadge';
import StatusDropdown from '../../ui/components/StatusDropdown';
import CategoryDropdown from '../../ui/components/CategoryDropdown';
import ContactDrawer from '../components/ContactDrawer';
import { useCrmStore } from '../store';
import type { Kontakt } from '../../../shared/types';

export default function Contacts(){
  const {
    load, filtered, filter,
    setSegment, toggleCategory, setQuery, updateStatus, update, countsByCategory
  } = useCrmStore();

  const [openId, setOpenId] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => { load(); }, [load]);

  const baseCats = filter.segment === 'arbeit'
    ? ['leads','kontaktiert','prozess','retainer']
    : ['freizeit','kindergarten','familie','freunde','handwerker','aerzte','allgemein'];

  const counts = useMemo(() => countsByCategory(filter.segment), [countsByCategory, filter.segment]);
  const rows = filtered();

  const cols: Column<Kontakt>[] = [
    { key:'name', header:'Name', sortable:true, render: r => (
      <div style={{display:'grid'}}>
        <div style={{fontWeight:600}}>{r.name}</div>
        {r.firma && <div style={{opacity:.7, fontSize:12}}>{r.firma}</div>}
      </div>
    )},
    { key:'status', header:'Status', sortable:true, render: r => (
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <StatusBadge value={r.status}/>
        <StatusDropdown value={r.status} onChange={s=>updateStatus(r.id, s)}/>
      </div>
    )},
    { key:'kategorie', header:'Kategorie', sortable:true, render:(r)=> (
      <CategoryDropdown
        value={r.kategorie}
        options={baseCats}
        onChange={(val)=>update(r.id, { kategorie: val })}
      />
    )},
    { key:'telefon', header:'Telefon', sortable:false, render:(r)=> r.telefon ?? '—' },
    { key:'email', header:'E-Mail', sortable:false, render:(r)=> r.email ?? '—' },
    { key:'website', header:'Website', sortable:true, render:(r)=> r.website ? <a href={ensureHttp(r.website)} target="_blank">{r.website}</a> : '—' },
    { key:'updatedAt', header:'Aktualisiert', sortable:true, render:(r)=> new Date(r.updatedAt).toLocaleString() },
  ];

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
        <h2 style={{display:'flex', alignItems:'center', gap:8, margin:0}}>
          {filter.segment === 'arbeit' ? '🗒️' : '🌳'} Kontakte
        </h2>
        <button onClick={()=>nav('/crm/tasks')} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#f7f7f7'}}>
          Aufgaben
        </button>
      </div>

      {/* Kopfzeile: links Segment, rechts Suche + Add */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
        <SegmentSwitch value={filter.segment} onChange={setSegment} />
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <SearchInput onDebouncedChange={setQuery} />
          <AddContactInline />
        </div>
      </div>

      {/* Chips UNTER der Kopfzeile, mit Zählern */}
      <div style={{transform:'scale(0.95)', transformOrigin:'left top'}}>
        <CategoryChips
          categories={baseCats}
          selected={filter.categories}
          onToggle={toggleCategory}
          counts={counts}
        />
      </div>

      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r)=>r.id}
        pageSize={15}
        onRowClick={(r)=>setOpenId(r.id)}
      />

      {openId && <ContactDrawer id={openId} onClose={()=>setOpenId(null)} />}
    </div>
  );
}

function ensureHttp(url: string){ return /^https?:\/\//i.test(url) ? url : `https://${url}`; }
