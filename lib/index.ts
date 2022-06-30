const maybeMockRestore = (a: any): void =>
  a.mockRestore && typeof a.mockRestore === "function"
    ? a.mockRestore()
    : undefined;

type JMPFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T] &
  string;
type JMPArgsType<T> = T extends (...args: infer A) => any ? A : never;
type JMPReturnType<T> = T extends (...args: any[]) => infer A ? A : never;

/**
 * Helper function for manually creating new spy mocks of functions not supported by this module.
 *
 * @param target Object containing the function that will be mocked.
 * @param property Name of the function that will be mocked.
 * @param impl Mock implementation of the target's function. The return type must match the target function's.
 */
export function spyOnImplementing<
  T extends {},
  M extends JMPFunctionPropertyNames<T>,
  F extends T[M],
  I extends (...args: any[]) => JMPReturnType<F>
>(
  target: T,
  property: M,
  impl: I
): jest.SpyInstance<Required<JMPReturnType<F>>, JMPArgsType<F>> {
  maybeMockRestore(target[property]);
  return jest.spyOn(target, property as any).mockImplementation(impl);
}

/**
 * Helper function to create a mock of the Node.js method
 * `process.exit(code: number)`.
 *
 * @param {Object} err Optional error to raise. If unspecified or falsy, calling `process.exit` will resume code
 * execution instead of raising an error.
 */
export const mockProcessExit = (err?: any) =>
  spyOnImplementing(
    process,
    "exit",
    (err
      ? () => {
          throw err;
        }
      : () => {}) as () => never
  );

/**
 * Helper function to create a mock of the Node.js method
 * `process.stdout.write(text: string, callback?: function): boolean`.
 */
export const mockProcessStdout = () =>
  spyOnImplementing(process.stdout, "write", () => true);

/**
 * Helper function to create a mock of the Node.js method
 * `process.stderr.write(text: string, callback?: function): boolean`.
 */
export const mockProcessStderr = () =>
  spyOnImplementing(process.stderr, "write", () => true);

/**
 * Helper function to create a mock of the Node.js method
 * `process.uptime()`.
 */
export const mockProcessUptime = (value?: number) =>
  spyOnImplementing(process, "uptime", () => value ?? 0);

/**
 * Helper function to create a mock of the Node.js method
 * `console.log(message: any)`.
 */
export const mockConsoleLog = () => spyOnImplementing(console, "log", () => {});

type JestCallableMocksObject = {
  [_: string]: () => jest.SpyInstance;
};

type JestMocksObject<T extends JestCallableMocksObject> = {
  [K in keyof T]: T[K] extends () => infer J ? J : never;
};

export interface MockedRunResult<R, M> {
  error?: any;
  result?: R;
  mocks: M;
}

/**
 * Helper function to run a synchronous function with provided mocks in place, as a virtual environment.
 *
 * Every provided mock will be automatically restored when this function returns.
 */
export function mockedRun<T extends JestCallableMocksObject, R>(callers: T) {
  return (f: () => R) => {
    const mocks: any = {
      mocks: {},
    };
    const mockers: { [_: string]: jest.SpyInstance } = Object.entries(callers)
      .map(([k, caller]) => ({ [k]: caller() }))
      .reduce((o, acc) => Object.assign(acc, o), {});

    try {
      mocks.result = f();
    } catch (error) {
      mocks.error = error;
    }

    Object.entries(mockers).map(([k, mocker]) => {
      mocks.mocks[k] = Object.assign({}, mocker);
      maybeMockRestore(mocker);
    });

    return mocks as MockedRunResult<R, JestMocksObject<T>>;
  };
}

/**
 * Helper function to run an asynchronous function with provided mocks in place, as a virtual environment.
 *
 * Every provided mock will be automatically restored when this function returns.
 */
export function asyncMockedRun<T extends JestCallableMocksObject, R>(
  callers: T
) {
  return async (f: () => Promise<R>) => {
    const mocks: any = {
      mocks: {},
    };
    const mockers: { [_: string]: jest.SpyInstance } = Object.entries(callers)
      .map(([k, caller]) => ({ [k]: caller() }))
      .reduce((o, acc) => Object.assign(acc, o), {});

    try {
      mocks.result = await f();
    } catch (error) {
      mocks.error = error;
    }

    Object.entries(mockers).map(([k, mocker]) => {
      mocks.mocks[k] = Object.assign({}, mocker);
      maybeMockRestore(mocker);
    });

    return mocks as MockedRunResult<R, JestMocksObject<T>>;
  };
}
