# Handling errors

Code from the [Handling errors][handling-errors] episode on 12 May 2020.

## State machine definitions

The following state machine definitions are provided in the order of their appearance in the episode:

* [states-timeout](states-timeout) - A workflow that triggers the _States.Timeout_ error.
* [simple-retrier](simple-retrier/) - A workflow that includes a simple retrier to retry failures with exponential backoff.
* [complex-retrier](complex-retrier/) - A workflow that deomnstrates complex retries with multiple errors in the same state.

[handling-errors]: https://youtu.be/PyClhjMVGY8

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
