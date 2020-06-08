import { Observer } from "./observer";

export class Observable<Type = any> {
  private observers: Observer[] = [];

  /**
   * Push a new value to all observers
   * @param value
   */
  next(value: Type) {
    for (const observer of this.observers) {
      observer.callback(value);
    }
  }

  /**
   * Subscribe a callback to trigger on new values
   * @param callback
   */
  subscribe(callback: (value: Type) => void): Observer<Type> {
    const observer = new Observer(this, callback);
    this.observers.push(observer);

    return observer;
  }

  /**
   * Await a single new value as a promise
   */
  await(): Promise<Type> {
    return new Promise<Type>((resolve) => {
      const observer = this.subscribe((value) => {
        this.remove(observer);
        resolve(value);
      });
    });
  }

  /**
   * Remove an observer from the observer list
   * @param observer
   */
  remove(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }
}
