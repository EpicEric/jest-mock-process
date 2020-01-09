const maybeMockRestore = (a: any): void => a.mockRestore ? a.mockRestore() : undefined;

function spyOnImplementing<
    T extends object,
    M extends keyof T,
    F extends T[M] extends (...args: any[]) => any ? T[M] : never,
>(target: T, property: M, impl: F): jest.SpyInstance<ReturnType<F>, ArgsType<F>> {
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
    (err ? (_?: number) => { throw err; } : ((_?: number) => {})) as typeof process.exit
);

/**
 * Helper function to create a mock of the Node.js method
 * `process.stdout.write(text: string, callback?: function): boolean`.
 */
export const mockProcessStdout = () => spyOnImplementing(
    process.stdout,
    'write',
    (() => true) as typeof process.stdout.write,
);

/**
 * Helper function to create a mock of the Node.js method
 * `process.stderr.write(text: string, callback?: function): boolean`.
 */
export const mockProcessStderr = () => spyOnImplementing(
    process.stderr,
    'write',
    (() => true) as typeof process.stderr.write,
);

/**
 * Helper function to create a mock of the Node.js method
 * `console.log(message: any)`.
 */
export const mockConsoleLog = () => spyOnImplementing(
    console,
    'log',
    (() => {}) as typeof console.log,
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
