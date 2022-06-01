import { asyncMockedRun, mockConsoleLog, mockedRun, MockedRunResult, mockProcessExit, mockProcessStderr,
    mockProcessStdout } from '../index';

describe('Mock Process Exit', () => {
    let mockExit: jest.SpyInstance<never>;

    beforeEach(() => {
        mockExit = mockProcessExit();
    });

    it('should exit with a zero code', () => {
        process.exit(0);
        expect(mockExit).toHaveBeenCalledTimes(1);
        expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should exit with a non-zero code', () => {
        process.exit(-2);
        expect(mockExit).toHaveBeenCalledTimes(1);
        expect(mockExit).toHaveBeenCalledWith(-2);
    });

    it('should be clearable', () => {
        expect(mockExit).toHaveBeenCalledTimes(0);
        process.exit(0);
        expect(mockExit).toHaveBeenCalledTimes(1);
        process.exit(0);
        expect(mockExit).toHaveBeenCalledTimes(2);
        mockExit.mockClear();
        expect(mockExit).toHaveBeenCalledTimes(0);
    });

    it('should allow an arbitrary error to be thrown on exit site', () => {
        const err = new Error('Mock');
        mockExit = mockProcessExit(err);
        expect(() => process.exit(0)).toThrowError(err);
    });

    it('should not throw a falsy arbitrary error', () => {
        const err = 0;
        mockExit = mockProcessExit(err);
        expect(() => process.exit(0)).not.toThrow();
    });

    afterAll(() => {
        mockExit.mockRestore();
    });
});

describe('Mock Process Stdout', () => {
    let mockStdout: jest.SpyInstance;

    beforeEach(() => {
        mockStdout = mockProcessStdout();
    });

    it('should receive a string', () => {
        process.stdout.write('Hello, world!');
        expect(mockStdout).toHaveBeenCalledTimes(1);
        expect(mockStdout).toHaveBeenCalledWith('Hello, world!');
        expect(mockStdout).toReturnWith(true);
    });

    it('should receive a buffer', () => {
        const buf = Buffer.from('Hello, world');
        process.stdout.write(buf);
        expect(mockStdout).toHaveBeenCalledTimes(1);
        expect(mockStdout).toHaveBeenCalledWith(buf);
        expect(mockStdout).toReturnWith(true);
    });

    it('should receive an encoding', () => {
        process.stdout.write('Hello, world!', 'utf-8');
        expect(mockStdout).toHaveBeenCalledTimes(1);
        expect(mockStdout).toHaveBeenCalledWith('Hello, world!', 'utf-8');
        expect(mockStdout).toReturnWith(true);
    });

    it('should receive a callback', () => {
        const cb = jest.fn();
        process.stdout.write('', cb);
        expect(mockStdout).toHaveBeenCalledTimes(1);
        expect(mockStdout).toHaveBeenCalledWith(expect.anything(), cb);
        expect(mockStdout).toReturnWith(true);
    });

    it('should be clearable', () => {
        expect(mockStdout).toHaveBeenCalledTimes(0);
        process.stdout.write('');
        expect(mockStdout).toHaveBeenCalledTimes(1);
        process.stdout.write('');
        expect(mockStdout).toHaveBeenCalledTimes(2);
        mockStdout.mockClear();
        expect(mockStdout).toHaveBeenCalledTimes(0);
    });

    afterAll(() => {
        mockStdout.mockRestore();
    });
});

describe('Mock Process Stderr', () => {
    let mockStderr: jest.SpyInstance;

    beforeEach(() => {
        mockStderr = mockProcessStderr();
    });

    it('should receive a string', () => {
        process.stderr.write('Hello, world!');
        expect(mockStderr).toHaveBeenCalledTimes(1);
        expect(mockStderr).toHaveBeenCalledWith('Hello, world!');
        expect(mockStderr).toReturnWith(true);
    });

    it('should receive a buffer', () => {
        const buf = Buffer.from('Hello, world');
        process.stderr.write(buf);
        expect(mockStderr).toHaveBeenCalledTimes(1);
        expect(mockStderr).toHaveBeenCalledWith(buf);
        expect(mockStderr).toReturnWith(true);
    });

    it('should receive an encoding', () => {
        process.stderr.write('Hello, world!', 'utf-8');
        expect(mockStderr).toHaveBeenCalledTimes(1);
        expect(mockStderr).toHaveBeenCalledWith('Hello, world!', 'utf-8');
        expect(mockStderr).toReturnWith(true);
    });

    it('should receive a callback', () => {
        const cb = jest.fn();
        process.stderr.write('', cb);
        expect(mockStderr).toHaveBeenCalledTimes(1);
        expect(mockStderr).toHaveBeenCalledWith(expect.anything(), cb);
        expect(mockStderr).toReturnWith(true);
    });

    it('should be clearable', () => {
        expect(mockStderr).toHaveBeenCalledTimes(0);
        process.stderr.write('');
        expect(mockStderr).toHaveBeenCalledTimes(1);
        process.stderr.write('');
        expect(mockStderr).toHaveBeenCalledTimes(2);
        mockStderr.mockClear();
        expect(mockStderr).toHaveBeenCalledTimes(0);
    });

    afterAll(() => {
        mockStderr.mockRestore();
    });
});

describe('Mock Console Log', () => {
    let mockLog: jest.SpyInstance;

    beforeEach(() => {
        mockLog = mockConsoleLog();
    });

    it('should receive a string', () => {
        console.log('Hello, world!');
        expect(mockLog).toHaveBeenCalledTimes(1);
        expect(mockLog).toHaveBeenCalledWith('Hello, world!');
    });

    it('should receive an object', () => {
        const obj = {array: [] as any[], null: null as any};
        console.log(obj);
        expect(mockLog).toHaveBeenCalledTimes(1);
        expect(mockLog).toHaveBeenCalledWith(obj);
    });

    it('should be clearable', () => {
        expect(mockLog).toHaveBeenCalledTimes(0);
        console.log('');
        expect(mockLog).toHaveBeenCalledTimes(1);
        console.log('');
        expect(mockLog).toHaveBeenCalledTimes(2);
        mockLog.mockClear();
        expect(mockLog).toHaveBeenCalledTimes(0);
    });

    afterAll(() => {
        mockLog.mockRestore();
    });
});

describe('mockedRun', () => {
    const mockRun: (_: () => any) => MockedRunResult = mockedRun({
        stdout: mockProcessStdout,
        stderr: mockProcessStderr,
        exit: mockProcessExit,
        log: mockConsoleLog,
    });
    let mocks: MockedRunResult;

    it('should call every mock once', () => {
        mocks = mockRun(() => {
            process.stdout.write('stdout payload');
            process.stderr.write('stderr payload');
            process.exit(-1);
            console.log('log payload');
        });
        expect(mocks.stdout).toHaveBeenCalledTimes(1);
        expect(mocks.stderr).toHaveBeenCalledTimes(1);
        expect(mocks.exit).toHaveBeenCalledTimes(1);
        expect(mocks.log).toHaveBeenCalledTimes(1);
    });

    it('should receive the correct arguments', () => {
        mocks = mockRun(() => {
            process.stdout.write('stdout payload');
            process.stderr.write('stderr payload');
            process.exit(-1);
            console.log('log payload');
        });
        expect(mocks.stdout).toHaveBeenCalledWith('stdout payload');
        expect(mocks.stderr).toHaveBeenCalledWith('stderr payload');
        expect(mocks.exit).toHaveBeenCalledWith(-1);
        expect(mocks.log).toHaveBeenCalledWith('log payload');
    });

    it('should receive the correct return value', () => {
        mocks = mockRun(() => {
            return 'return string';
        });
        expect(mocks.result).toEqual('return string');
        expect(mocks.error).toBeUndefined();
    });

    it('should receive the correct thrown value', () => {
        const expectedError = new Error('Mock error');
        mocks = mockRun(() => {
            throw expectedError;
        });
        expect(mocks.result).toBeUndefined();
        expect(mocks.error).toBe(expectedError);
    });

    it('should accept mocked process.exit raising an error', () => {
        const expectedError = new Error('Mock process exit');
        const mockRunWithProcessExit = mockedRun({
            stdout: mockProcessStdout,
            stderr: mockProcessStderr,
            exit: () => mockProcessExit(expectedError),
            log: mockConsoleLog,
        });
        mocks = mockRunWithProcessExit(() => {
            process.stdout.write('stdout payload');
            process.stderr.write('stderr payload');
            process.exit(-1);
            console.log('log payload');
        });
        expect(mocks.stdout).toHaveBeenCalledTimes(1);
        expect(mocks.stderr).toHaveBeenCalledTimes(1);
        expect(mocks.exit).toHaveBeenCalledTimes(1);
        expect(mocks.log).not.toHaveBeenCalled();
        expect(mocks.result).toBeUndefined();
        expect(mocks.error).toBe(expectedError);
    });
});

describe('asyncMockedRun', () => {
    const mockRun: (_: () => any) => Promise<MockedRunResult> = asyncMockedRun({
        stdout: mockProcessStdout,
        stderr: mockProcessStderr,
        exit: mockProcessExit,
        log: mockConsoleLog,
    });
    let mocks: MockedRunResult;

    it('should call every mock once', async () => {
        mocks = await mockRun(() => {
            return new Promise<void>((resolve) => {
                process.stdout.write('stdout payload');
                process.stderr.write('stderr payload');
                process.exit(-1);
                console.log('log payload');
                resolve();
            });
        });
        expect(mocks.stdout).toHaveBeenCalledTimes(1);
        expect(mocks.stderr).toHaveBeenCalledTimes(1);
        expect(mocks.exit).toHaveBeenCalledTimes(1);
        expect(mocks.log).toHaveBeenCalledTimes(1);
    });

    it('should receive the correct arguments', async () => {
        mocks = await mockRun(() => {
            return new Promise<void>((resolve) => {
                process.stdout.write('stdout payload');
                process.stderr.write('stderr payload');
                process.exit(-1);
                console.log('log payload');
                resolve();
            });
        });
        expect(mocks.stdout).toHaveBeenCalledWith('stdout payload');
        expect(mocks.stderr).toHaveBeenCalledWith('stderr payload');
        expect(mocks.exit).toHaveBeenCalledWith(-1);
        expect(mocks.log).toHaveBeenCalledWith('log payload');
    });

    it('should receive the correct return value', async () => {
        mocks = await mockRun(() => {
            return new Promise((resolve) => {
                resolve('return string');
            });
        });
        expect(mocks.result).toEqual('return string');
        expect(mocks.error).toBeUndefined();
    });

    it('should receive the correct thrown value', async () => {
        const expectedError = new Error('Mock error');
        mocks = await mockRun(() => {
            return new Promise((_, reject) => {
                reject(expectedError);
            });
        });
        expect(mocks.result).toBeUndefined();
        expect(mocks.error).toBe(expectedError);
    });

    it('should accept mocked process.exit raising an error', async () => {
        const expectedError = new Error('Mock process exit');
        const mockRunWithProcessExit = asyncMockedRun({
            stdout: mockProcessStdout,
            stderr: mockProcessStderr,
            exit: () => mockProcessExit(expectedError),
            log: mockConsoleLog,
        });
        mocks = await mockRunWithProcessExit(() => {
            return new Promise<void>((resolve) => {
                process.stdout.write('stdout payload');
                process.stderr.write('stderr payload');
                process.exit(-1);
                console.log('log payload');
                resolve();
            });
        });
        expect(mocks.stdout).toHaveBeenCalledTimes(1);
        expect(mocks.stderr).toHaveBeenCalledTimes(1);
        expect(mocks.exit).toHaveBeenCalledTimes(1);
        expect(mocks.log).not.toHaveBeenCalled();
        expect(mocks.result).toBeUndefined();
        expect(mocks.error).toBe(expectedError);
    });
});
