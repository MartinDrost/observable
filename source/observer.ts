import { Observable } from "./observable";

export class Observer<Type = any> {
  constructor(
    private observable: Observable,
    public callback: (value: Type) => void
  ) {}

  /**
   * Unsubscribe the observable
   */
  unsubscribe() {
    this.observable.remove(this);
  }
}
