interface Props {
  categories: string[];
  selected: string[];
  onToggle: (cat: string) => void;
  counts?: Record<string, number>;
}

export default function CategoryChips({ categories, selected, onToggle, counts }: Props) {
  return (
    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
      {categories.map(cat => {
        const active = selected.includes(cat);
        const count = counts?.[cat] ?? 0;
        return (
          <span
            key={cat}
            onClick={()=>onToggle(cat)}
            style={{
              padding:'4px 10px',
              borderRadius:12,
              border: active ? '1px solid #111' : '1px solid #ccc',
              background: active ? '#111' : '#fff',
              color: active ? '#fff' : '#111',
              cursor:'pointer',
              userSelect:'none',
              display:'inline-flex',
              alignItems:'center',
              gap:6
            }}
            title={cat}
          >
            {label(cat)}
            <small style={{opacity: active ? .9 : .6}}>({count})</small>
          </span>
        );
      })}
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
  return map[val] ?? (val.charAt(0).toUpperCase() + val.slice(1));
}
