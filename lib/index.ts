/**
 * Helper function to create a mock of the Node.js method
 * `process.exit(code: number)`.
 */
export function mockProcessExit() {
    const processExit = process.exit as any;
    if (processExit.mockRestore) {
        processExit.mockRestore();
    }
    const spyImplementation = jest.spyOn(process, 'exit')
        .mockImplementation((_?: number) => {}) as any;
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
    const spyImplementation = jest.spyOn(process.stdout, 'write')
        .mockImplementation(() => true) as any;
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
    const spyImplementation = jest.spyOn(process.stderr, 'write')
        .mockImplementation(() => true) as any;
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
    const spyImplementation = jest.spyOn(console, 'log')
        .mockImplementation(() => true) as any;
    return spyImplementation as jest.SpyInstance<(
        message?: any,
        ...optionalParams: any[]
    ) => void>;
};
