# jest-mock-process [![npm version](https://badge.fury.io/js/jest-mock-process.svg)](https://www.npmjs.com/package/jest-mock-process) [![CircleCI](https://circleci.com/gh/EpicEric/jest-mock-process/tree/master.svg?style=svg)](https://circleci.com/gh/EpicEric/jest-mock-process/tree/master) [![Coverage Status](https://coveralls.io/repos/github/EpicEric/jest-mock-process/badge.svg?branch=master)](https://coveralls.io/github/EpicEric/jest-mock-process?branch=master)

Easily mock NodeJS process properties in Jest.

## Installation

```sh
npm install --save-dev jest-mock-process
```

## Usage

### JavaScript

```javascript
var mockProcess = require('jest-mock-process');

var mockExit = mockProcess.mockProcessExit();
process.exit(1);
expect(mockExit).toHaveBeenCalledWith(1);

var mockStdout = mockProcess.mockProcessStdout();
process.stdout.write('Hello, world!');
expect(mockStdout).toHaveBeenCalledWith('Hello, world!');

var mockStderr = mockProcess.mockProcessStderr();
process.stderr.write('Error');
expect(mockStderr).toHaveBeenCalledWith('Error');

var mockLog = mockProcess.mockConsoleLog();
console.log('Browser log');
expect(mockLog).toHaveBeenCalledWith('Browser log');

mockExit.mockRestore();
mockStdout.mockRestore();
mockStderr.mockRestore();
mockLog.mockRestore();
```

### TypeScript

```typescript
import { mockProcessExit, mockProcessStdout, mockProcessStderr, mockConsoleLog } from 'jest-mock-process';

const mockExit = mockProcessExit();
process.exit(1);
expect(mockExit).toHaveBeenCalledWith(1);

const mockStdout = mockProcessStdout();
process.stdout.write('Hello, world!');
expect(mockStdout).toHaveBeenCalledWith('Hello, world!');

const mockStderr = mockProcessStderr();
process.stderr.write('Error');
expect(mockStderr).toHaveBeenCalledWith('Error');

const mockLog = mockConsoleLog();
console.log('Browser log');
expect(mockLog).toHaveBeenCalledWith('Browser log');

mockExit.mockRestore();
mockStdout.mockRestore();
mockStderr.mockRestore();
mockLog.mockRestore();
```
