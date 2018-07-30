# jest-mock-process

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

mockExit.mockRestore();
mockStdout.mockRestore();
mockStderr.mockRestore();
```

### TypeScript

```typescript
import { mockProcessExit, mockProcessStdout, mockProcessStderr } from 'jest-mock-process';

const mockExit = mockProcessExit();
process.exit(1);
expect(mockExit).toHaveBeenCalledWith(1);

const mockStdout = mockProcessStdout();
process.stdout.write('Hello, world!');
expect(mockStdout).toHaveBeenCalledWith('Hello, world!');

const mockStderr = mockProcessStderr();
process.stderr.write('Error');
expect(mockStderr).toHaveBeenCalledWith('Error');

mockExit.mockRestore();
mockStdout.mockRestore();
mockStderr.mockRestore();
```
