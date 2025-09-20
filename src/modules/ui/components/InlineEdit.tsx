import { useState } from 'react';

type Props = {
  value?: string;
  placeholder?: string;
  onSave: (val: string) => void;
};

export default function InlineEdit({ value='', placeholder='', onSave }: Props){
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? '');

  function commit(){
    setEditing(false);
    if ((value ?? '') !== val) onSave(val);
  }

  return (
    // ...innerhalb des return
<div
  onClick={(e)=>{ if(!editing){ e.stopPropagation(); setEditing(true); } }}
  style={{minWidth:120}}
>
  {editing ? (
    <input
      autoFocus
      value={val}
      placeholder={placeholder}
      onClick={(e)=>e.stopPropagation()}   // ← NEU
      onChange={e=>setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e=>{ if(e.key==='Enter') commit(); if(e.key==='Escape'){ setVal(value ?? ''); setEditing(false); } }}
      style={{padding:'6px 8px', border:'1px solid #ddd', borderRadius:6, width:'100%'}}
    />
  ) : (
    <span style={{cursor:'text', opacity: (value ? 1 : .6)}}>{value || placeholder || '—'}</span>
  )}
</div>

  );
}
