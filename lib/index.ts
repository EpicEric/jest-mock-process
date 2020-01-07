const maybeMockRestore = (a: any): void => a.mockRestore ? a.mockRestore() : undefined;

export function spyOnImplementing<
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

/**
 * Helper function to run a function with certain mocks in place.
 */
export const mockedRun = (callers: { [K in keyof any]: () => jest.SpyInstance}) => (f: () => void) => {
    const mocks = Object.entries(callers)
        .map(([k, mocker]) => [k, mocker()])
        .reduce((o: any, [k, v]: any) => { o[k] = v; return o; }, {});

    f();

    return mocks as Record<keyof typeof callers, jest.SpyInstance>;
};
