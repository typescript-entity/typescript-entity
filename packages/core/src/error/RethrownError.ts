export class RethrownError extends Error {

  public readonly previous?: Error;

  public constructor(message?: string, previous?: Error) {
    super(message);
    this.previous = previous;
  }

  public get root(): Error {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let err: RethrownError | Error = this;
    while ('previous' in err && err.previous) {
      err = err.previous;
    }
    return err;
  }

}
