
import * as React from 'react'
export function Tabs({children}:{children:React.ReactNode}){ return <div>{children}</div>}
export function TabsList({children}:{children:React.ReactNode}){ return <div className='inline-flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl'>{children}</div>}
export function TabsTrigger({children}:{children:React.ReactNode}){ return <button className='px-3 py-1 rounded-xl hover:bg-white/70 dark:hover:bg-neutral-700'>{children}</button>}
export function TabsContent({children}:{children:React.ReactNode}){ return <div className='mt-3'>{children}</div>}
