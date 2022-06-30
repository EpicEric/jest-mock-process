# jest-mock-process [![npm version](https://badge.fury.io/js/jest-mock-process.svg)](https://www.npmjs.com/package/jest-mock-process) [![CircleCI](https://circleci.com/gh/EpicEric/jest-mock-process/tree/main.svg?style=svg)](https://circleci.com/gh/EpicEric/jest-mock-process/tree/main) [![Coverage Status](https://coveralls.io/repos/github/EpicEric/jest-mock-process/badge.svg?branch=main)](https://coveralls.io/github/EpicEric/jest-mock-process?branch=master)

Easily mock NodeJS process properties in Jest.

## Installation

```sh
npm install --save-dev jest-mock-process
```

## Usage

TypeScript example.

```typescript
import {
  mockProcessExit,
  mockProcessStdout,
  mockProcessStderr,
  mockProcessUptime,
  mockConsoleLog,
} from "jest-mock-process";

let mockExit = mockProcessExit();
process.exit(1);
expect(mockExit).toHaveBeenCalledWith(1);
mockExit = mockProcessExit(new Error("Mock"));
expect(() => process.exit(0)).toThrowError("Mock");

const mockStdout = mockProcessStdout();
process.stdout.write("Hello, world!");
expect(mockStdout).toHaveBeenCalledWith("Hello, world!");

const mockStderr = mockProcessStderr();
process.stderr.write("Error");
expect(mockStderr).toHaveBeenCalledWith("Error");

const mockUptime = mockProcessUptime(3.14159);
const uptimeValue = process.uptime();
expect(uptimeValue).toEqual(3.14159);

const mockLog = mockConsoleLog();
console.log("Browser log");
expect(mockLog).toHaveBeenCalledWith("Browser log");

mockExit.mockRestore();
mockStdout.mockRestore();
mockStderr.mockRestore();
mockLog.mockRestore();
```

### Advanced usage

- You can use `mockedRun` (or `asyncMockedRun`) to set-up a virtual environment that will automatically create and restore provided mocks:

```typescript
import { mockedRun, MockedRunResult } from "jest-mock-process";

const mockRun = mockedRun({
  stdout: mockProcessStdout,
  stderr: mockProcessStderr,
  exit: mockProcessExit,
  log: mockConsoleLog,
});
const mockEnvironment = mockRun(() => {
  process.stdout.write("stdout payload");
  process.stderr.write("stderr payload");
  process.exit(-1);
  console.log("log payload");
  return 10;
});
expect(mockEnvironment.result).toEqual(10);
expect(mockEnvironment.error).toBeUndefined();
expect(mockEnvironment.mocks.stdout).toHaveBeenCalledTimes(1);
expect(mockEnvironment.mocks.log).toHaveBeenCalledWith("log payload");
```

**NOTE: The above is a breaking change in version 2.0.0, as the provided mocks are now limited to the `mocks` object.**

- You can mock generic methods not supported by default in `jest-mock-process` with the `spyOnImplementing` function:

```typescript
import { spyOnImplementing } from "jest-mock-process";

const mockStdin = spyOnImplementing(process.stdin, "read", () => "");
process.stdin.read(1024);
expect(mockStdin).toHaveBeenCalledWith(1024);
```
