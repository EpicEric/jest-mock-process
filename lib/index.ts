const maybeMockRestore = (a: any): void =>
    a.mockRestore && typeof a.mockRestore === 'function' ? a.mockRestore() : undefined;

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

export interface MockedRunResult {
    error?: any;
    result?: any;
    [_: string]: jest.SpyInstance;
}

/**
 * Helper function to run a synchronous function with provided mocks in place, as a virtual environment.
 *
 * Every provided mock will be automatically restored when this function returns.
 */
export const mockedRun = (
    callers: {[_: string]: () => jest.SpyInstance}
) => (f: () => any) => {
    const mocks: MockedRunResult = {};
    const mockers: {[_: string]: jest.SpyInstance} = Object.entries(callers)
        .map(([k, caller]) => ({[k]: caller()})).reduce((o, acc) => Object.assign(acc, o), {});

    try {
        mocks.result = f();
    } catch (error) {
        mocks.error = error;
    }

    Object.entries(mockers).map(([k, mocker]) => {
        mocks[k] = Object.assign({}, mocker);
        maybeMockRestore(mocker);
    });

    return mocks;
};

/**
 * Helper function to run an asynchronous function with provided mocks in place, as a virtual environment.
 *
 * Every provided mock will be automatically restored when this function returns.
 */
export const asyncMockedRun = (
    callers: {[_: string]: () => jest.SpyInstance}
) => async (f: () => Promise<any>) => {
    const mocks: MockedRunResult = {};
    const mockers: {[_: string]: jest.SpyInstance} = Object.entries(callers)
        .map(([k, caller]) => ({[k]: caller()})).reduce((o, acc) => Object.assign(acc, o), {});

    try {
        mocks.result = await f();
    } catch (error) {
        mocks.error = error;
    }

    Object.entries(mockers).map(([k, mocker]) => {
        mocks[k] = Object.assign({}, mocker);
        maybeMockRestore(mocker);
    });

    return mocks;
};
