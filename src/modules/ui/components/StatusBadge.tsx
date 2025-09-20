import type { KontaktStatus } from '../../../shared/types';

export default function StatusBadge({ value }: { value?: KontaktStatus }) {
  const v = value ?? 'offen';
  const style: Record<KontaktStatus, React.CSSProperties> = {
    offen:    { background:'#fff3cd', border:'1px solid #ffe69c', color:'#664d03' },
    inArbeit: { background:'#cfe2ff', border:'1px solid #9ec5fe', color:'#052c65' },
    erledigt: { background:'#d1e7dd', border:'1px solid #a3cfbb', color:'#0f5132' },
  };
  return <span style={{padding:'3px 8px', borderRadius:999, fontSize:12, ...style[v]}}>{label(v)}</span>;
}

function label(s: KontaktStatus){ return s==='offen'?'Offen': s==='inArbeit'?'In Arbeit':'Erledigt'; }
