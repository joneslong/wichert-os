// src/modules/ui/components/CategoryDropdown.tsx
type Props = {
  value: string;
  options: string[];
  onChange: (val: string) => void;
};

export default function CategoryDropdown({ value, options, onChange }: Props){
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <select
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      onClick={stop}
      onMouseDown={stop}
      style={{ padding:'4px 8px', border:'1px solid #ddd', borderRadius:8 }}
    >
      {options.map(opt => <option key={opt} value={opt}>{label(opt)}</option>)}
    </select>
  );
}

function label(val: string) {
  const map: Record<string,string> = {
    leads:'Leads', kontaktiert:'Kontaktiert', prozess:'Prozess', retainer:'Retainer',
    freizeit:'Freizeit', kindergarten:'Kindergarten', familie:'Familie', freunde:'Freunde',
    handwerker:'Handwerker', aerzte:'Ärzte', allgemein:'Allgemein',
  };
  return map[val] ?? val;
}
