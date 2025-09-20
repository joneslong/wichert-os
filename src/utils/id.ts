export const uid = () => Math.random().toString(36).slice(2);
export const todayISO = () => new Date().toISOString().split("T")[0];
