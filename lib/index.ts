/**
 * Helper function to create a mock of the Node.js method
 * `process.exit(code: number)`.
 */
export function mockProcessExit() {
    const processExit = process.exit as any;
    if (processExit.mockRestore) {
        processExit.mockRestore();
    }
    const spyInstance = jest.spyOn(process, 'exit');
    const spyImplementation = spyInstance.mockImplementation((_?: number) => {});
    return {
        ...spyImplementation,
        mockRestore: spyInstance.mockRestore
    } as jest.SpyInstance<(code?: number) => never>;
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
    const spyInstance = jest.spyOn(process.stdout, 'write');
    const spyImplementation = spyInstance.mockImplementation(() => true);
    return {
        ...spyImplementation,
        mockRestore: spyInstance.mockRestore
    } as jest.SpyInstance<(...args: any[]) => boolean>;
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
    const spyInstance = jest.spyOn(process.stderr, 'write');
    const spyImplementation = spyInstance.mockImplementation(() => true);
    return {
        ...spyImplementation,
        mockRestore: spyInstance.mockRestore
    } as jest.SpyInstance<(...args: any[]) => boolean>;
};
