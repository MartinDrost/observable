import { Observer } from "./observer";

const observable_closed_msg = "The observable has been closed";

export class Observable<Type = any> {
  public isClosed: Boolean = false;
  private observers: Observer[] = [];

  /**
   * Push a new value to all observers
   * @param value
   */
  next(value: Type) {
    if (this.isClosed) {
      throw new Error(observable_closed_msg);
    }

    for (const observer of this.observers) {
      observer.callback(value);
    }
  }

  /**
   * Subscribe a callback to trigger on new values
   * @param callback
   */
  subscribe(callback: (value: Type) => void): Observer<Type> {
    if (this.isClosed) {
      throw new Error(observable_closed_msg);
    }

    const observer = new Observer(this, callback);
    this.observers.push(observer);

    return observer;
  }

  /**
   * Returns the next new value as a promise response
   */
  promise(): Promise<Type> {
    if (this.isClosed) {
      throw new Error(observable_closed_msg);
    }

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
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Closes the observable for any future calls
   * @param observer
   */
  close(): void {
    this.isClosed = true;
    this.observers = [];
  }
}
