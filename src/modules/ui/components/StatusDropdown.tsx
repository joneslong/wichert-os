// src/modules/ui/components/StatusDropdown.tsx
import type { KontaktStatus } from '../../../shared/types';

type Props = { value?: KontaktStatus; onChange: (s: KontaktStatus) => void };

export default function StatusDropdown({ value='offen', onChange }: Props) {
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <select
      value={value}
      onChange={(e)=>onChange(e.target.value as KontaktStatus)}
      onClick={stop}
      onMouseDown={stop}
      style={{ padding:'4px 8px', border:'1px solid #ddd', borderRadius:8 }}
    >
      <option value="offen">Offen</option>
      <option value="inArbeit">In Arbeit</option>
      <option value="erledigt">Erledigt</option>
    </select>
  );
}
