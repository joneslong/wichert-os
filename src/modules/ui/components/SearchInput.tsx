import { useEffect, useRef, useState } from 'react';

type Props = {
  placeholder?: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
  defaultValue?: string;
};

export default function SearchInput({ placeholder="Suchen…", onDebouncedChange, delay=250, defaultValue="" }: Props){
  const [val, setVal] = useState(defaultValue);
  const t = useRef<number | null>(null);

  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => onDebouncedChange(val), delay);
    return () => { if (t.current) window.clearTimeout(t.current); };
  }, [val, delay, onDebouncedChange]);

  return (
    <input
      value={val}
      onChange={e=>setVal(e.target.value)}
      placeholder={placeholder}
      style={{padding:'8px 10px', border:'1px solid #ddd', borderRadius:8, minWidth:200}}
    />
  );
}
