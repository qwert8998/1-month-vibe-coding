# Unit Test Guidelines (Copilot)

## Goal
Create fast, deterministic, isolated unit tests and run them reliably on every change.

## Required Rules
1. Use **xUnit** for tests.
2. Use **Moq** for mocking dependencies.
3. Follow **AAA** pattern in every test:
   - Arrange
   - Act
   - Assert
4. Test file name must be related to the file under test:
   - format: `<TargetFileName>_UTest.cs`
   - example: `UserController_UTest.cs`
5. Test naming convention:
   - `MethodName_WhenCondition_ExpectedResult`
6. Include positive and negative paths:
   - success
   - validation failures
   - dependency failure/false paths
7. Verify dependency interactions with `Verify(...)` where relevant.
8. Keep tests independent:
   - no shared mutable state
   - no real DB/network/file system access
9. Prefer explicit assertions:
   - assert response type
   - assert payload/message values
10. Keep test data deterministic (no random values unless fixed seed).
11. One behavioral assertion focus per test.

## API Controller Testing Rules
1. Instantiate controller directly with mocked services.
2. For `IActionResult`, assert concrete result types:
   - `OkResult`, `OkObjectResult`, `BadRequestObjectResult`, `NotFoundResult`, etc.
3. If response body is expected, assert exact value/shape.
4. Verify service call count:
   - `Times.Once` for expected calls
   - `Times.Never` for guarded/early-return paths

## Execution Rules
1. Run all tests:
   - `dotnet test`
2. Run a specific test class:
   - `dotnet test --filter FullyQualifiedName~UserControllerTest`
3. Treat any failing test as blocking.
4. Do not change production code only to satisfy weak tests.
5. If a test fails, fix root cause and rerun full suite.

## Quality Bar
- Tests must compile and pass locally.
- No flaky tests.
- No sleeps/time-based assertions unless strictly required.
- Keep tests readable and minimal.
