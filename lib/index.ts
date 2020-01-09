const maybeMockRestore = (a: any): void => a.mockRestore ? a.mockRestore() : undefined;

type FunctionPropertyNames<T> = {[K in keyof T]: T[K] extends (...args: any[]) => any ? K : never}[keyof T];

/**
 * Helper function for manually creating new spy mocks of functions not supported by this module.
 *
 * @param target Object containing the function that will be mocked.
 * @param property Name of the function that will be mocked.
 * @param impl Mock implementation of the. The return type must match the target function.
 */
export function spyOnImplementing<
    T extends object,
    M extends FunctionPropertyNames<T>,
    F extends T[M],
    I extends (...args: any[]) => ReturnType<F>,
>(target: T, property: M, impl: I): jest.SpyInstance<ReturnType<F>, ArgsType<F>> {
    maybeMockRestore(target[property]);
    return jest.spyOn(target, property).mockImplementation(impl);
}

/**
 * Helper function to create a mock of the Node.js method
 * `process.exit(code: number)`.
 *
 * @param {Object} err Optional error to raise. If unspecified or falsy, calling `process.exit` will resume code
 * execution instead of raising an error.
 */
export const mockProcessExit = (err?: any) => spyOnImplementing(
    process,
    'exit',
    (err ? (_?: number) => { throw err; } : ((_?: number) => {})) as () => never,
);

/**
 * Helper function to create a mock of the Node.js method
 * `process.stdout.write(text: string, callback?: function): boolean`.
 */
export const mockProcessStdout = () => spyOnImplementing(
    process.stdout,
    'write',
    (() => true),
);

/**
 * Helper function to create a mock of the Node.js method
 * `process.stderr.write(text: string, callback?: function): boolean`.
 */
export const mockProcessStderr = () => spyOnImplementing(
    process.stderr,
    'write',
    (() => true),
);

/**
 * Helper function to create a mock of the Node.js method
 * `console.log(message: any)`.
 */
export const mockConsoleLog = () => spyOnImplementing(
    console,
    'log',
    (() => {}),
);

export interface MockedRunMocks {
    [key: string]: jest.SpyInstance;
}

export interface MockedRunResult {
    error?: any;
    result?: any;
    mocks: MockedRunMocks;
    mockRestore: () => void;
}

/**
 * Helper function to run a synchronous function with provided mocks in place.
 */
export const mockedRun = (
    callers: {[K in keyof any]: () => jest.SpyInstance}
) => (f: () => any) => {
    const mocks = Object.entries(callers)
        .map<[string, jest.SpyInstance]>(([k, mocker]) => [k, mocker()])
        .reduce((o, [k, v]) => { o[k] = v; return o; }, {} as MockedRunMocks);

    const mockRestore = () => Object.values(mocks).map((mock) => maybeMockRestore(mock));
    const result: MockedRunResult = {mocks, mockRestore};
    try {
        result.result = f();
    } catch (error) {
        result.error = error;
    }

    return result;
};

/**
 * Helper function to run an asynchronous function with provided mocks in place.
 */
export const asyncMockedRun = (
    callers: {[K in keyof any]: () => jest.SpyInstance}
) => async (f: () => Promise<any>) => {
    const mocks = Object.entries(callers)
        .map<[string, jest.SpyInstance]>(([k, mocker]) => [k, mocker()])
        .reduce((o, [k, v]) => { o[k] = v; return o; }, {} as MockedRunMocks);

    const mockRestore = () => Object.values(mocks).map((mock) => maybeMockRestore(mock));
    const result: MockedRunResult = {mocks, mockRestore};
    try {
        result.result = await f();
    } catch (error) {
        result.error = error;
    }

    return result;
};
