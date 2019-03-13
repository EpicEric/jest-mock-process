/**
 * Helper function to create a mock of the Node.js method
 * `process.exit(code: number)`.
 *
 * @param {Object} err Optional error to raise. If unspecified or falsy, calling `process.exit` will resume code
 * execution instead of raising an error.
 */
export function mockProcessExit(err?: any) {
    const processExit = process.exit as any;
    if (processExit.mockRestore) {
        processExit.mockRestore();
    }
    let spyImplementation: any;
    if (err) {
        spyImplementation = jest.spyOn(process, 'exit')
            .mockImplementation((_?: number) => {throw err});
    } else {
        spyImplementation = (jest.spyOn(process, 'exit') as any)
            .mockImplementation((_?: number) => {});
    }
    return spyImplementation as jest.SpyInstance<(
        code?: number
    ) => never>;
};

/**
 * Helper function to create a mock of the Node.js method
 * `process.stdout.write(text: string, callback?: function): boolean`.
 */
export function mockProcessStdout() {
    const processStdout = process.stdout.write as any;
    if (processStdout.mockRestore) {
        processStdout.mockRestore();
    }
    let spyImplementation: any;
    spyImplementation = jest.spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
    return spyImplementation as jest.SpyInstance<(
        buffer: Buffer | string,
        encoding?: string,
        cb?: Function
    ) => boolean>;
};

/**
 * Helper function to create a mock of the Node.js method
 * `process.stderr.write(text: string, callback?: function): boolean`.
 */
export function mockProcessStderr() {
    const processStderr = process.stderr.write as any;
    if (processStderr.mockRestore) {
        processStderr.mockRestore();
    }
    let spyImplementation: any;
    spyImplementation = jest.spyOn(process.stderr, 'write')
        .mockImplementation(() => true);
    return spyImplementation as jest.SpyInstance<(
        buffer: Buffer | string,
        encoding?: string,
        cb?: Function
    ) => boolean>;
};

/**
 * Helper function to create a mock of the Node.js method
 * `console.log(message: any)`.
 */
export function mockConsoleLog() {
    const consoleLog = console.log as any;
    if (consoleLog.mockRestore) {
        consoleLog.mockRestore();
    }
    let spyImplementation: any;
    spyImplementation = jest.spyOn(console, 'log')
        .mockImplementation(() => {});
    return spyImplementation as jest.SpyInstance<(
        message?: any,
        ...optionalParams: any[]
    ) => void>;
};
