import { mockProcessExit, mockProcessStdout, mockProcessStderr } from '../index';

describe('Mock Process Exit', () => {
    let mockExit: jest.SpyInstance<(_: number) => never>;

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

    afterAll(() => {
        mockExit.mockRestore();
    });
});

describe('Mock Process Stdout', () => {
    let mockStdout: jest.SpyInstance<(..._: any[]) => boolean>;

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

    afterAll(() => {
        mockStdout.mockRestore();
    });
});

describe('Mock Process Stderr', () => {
    let mockStderr: jest.SpyInstance<(..._: any[]) => boolean>;

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

    afterAll(() => {
        mockStderr.mockRestore();
    });
});
