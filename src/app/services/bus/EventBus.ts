type Handler<T = any> = (payload: T) => void;

export class EventBus {
  private map = new Map<string, Set<Handler>>();

  on<T = any>(event: string, cb: Handler<T>) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    const set = this.map.get(event)!;
    set.add(cb as Handler);
    return () => set.delete(cb as Handler);
  }

  emit<T = any>(event: string, payload: T) {
    this.map.get(event)?.forEach(cb => cb(payload));
  }
}
