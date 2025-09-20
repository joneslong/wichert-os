import React, { useState } from 'react';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
};

/**
 * Interaktive Elemente, die keinen Row-Click auslösen sollen.
 */
const INTERACTIVE = new Set(['SELECT','INPUT','TEXTAREA','BUTTON','A','LABEL']);

function isInteractive(e: React.MouseEvent) {
  const target = e.target as HTMLElement | null;
  if (!target) return false;
  let el: HTMLElement | null = target;
  for (let i=0; i<5 && el; i++, el = el.parentElement) {
    if (INTERACTIVE.has(el.tagName)) return true;
    if (el.getAttribute('role') === 'button' || el.getAttribute('contenteditable') === 'true') return true;
  }
  return false;
}

export default function DataTable<T>({ columns, rows, rowKey, pageSize = 10, onRowClick }: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const start = page * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f7f7f7' }}>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #ddd' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map(r => (
            <tr
              key={rowKey(r)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              onClick={(e)=> {
                if (isInteractive(e)) return;
                onRowClick?.(r);
              }}
            >
              {columns.map(col => (
                <td key={String(col.key)} style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
                  {col.render ? col.render(r) : String((r as any)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {!pageRows.length && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 12, textAlign: 'center', opacity: .6 }}>
                Keine Daten vorhanden
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {rows.length > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px' }}>
          <button disabled={page === 0} onClick={()=>setPage(p => Math.max(0, p-1))}>◀</button>
          <span>Seite {page+1} / {Math.ceil(rows.length / pageSize)}</span>
          <button disabled={start + pageSize >= rows.length} onClick={()=>setPage(p => p+1)}>▶</button>
        </div>
      )}
    </div>
  );
}
