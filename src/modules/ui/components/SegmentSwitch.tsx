interface Props {
  value: 'arbeit' | 'familie';
  onChange: (val: 'arbeit' | 'familie') => void;
}

export default function SegmentSwitch({ value, onChange }: Props) {
  const btn = (active: boolean) => ({
    padding:'6px 10px',
    borderRadius:6,
    border: active ? '2px solid black':'1px solid #ccc',
    background: active ? '#eee':'#fff',
    display:'inline-flex',
    gap:6,
    alignItems:'center'
  } as const);

  return (
    <div style={{ display:'flex', gap:8 }}>
      <button onClick={()=>onChange('arbeit')} style={btn(value==='arbeit')}>
        <span>🗒️</span><span>Arbeit</span>
      </button>
      <button onClick={()=>onChange('familie')} style={btn(value==='familie')}>
        <span>🌳</span><span>Familie</span>
      </button>
    </div>
  );
}
