export class RethrownError extends Error {

  public previous?: Error;

  constructor(message?: string, previous?: Error) {
    super(message);
    this.previous = previous;
  }

  get root(): Error {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let err: RethrownError | Error = this;
    while ('previous' in err && err.previous) {
      err = err.previous;
    }
    return err;
  }

}
