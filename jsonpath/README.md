# JSONPath data processing

Code from the [JSONPath data processing][jsonpath] episode on 28 April 2020.

## Deploying the AWS Lambda function

```bash
sam build && sam deploy --guided
```

## State machine definitions

The following state machine definitions are provided in the order of their appearance in the episode:

* [simple-pass-state.asl.json](statemachine/simple-pass-state.asl.json) - The simplest example, a Pass State with no _InputPath_, _ResultPath_, or _OutputPath_ defined.
* [entire-input-to-lambda.asl.json](statemachine/entire-input-to-lambda.asl.json) - An example with an additional AWS Lambda Task State that accepts the entire state as its input payload. No _ResultPath_ or _OutputPath_ are defined.
* [lambda-with-result-path.asl.json](statemachine/lambda-with-result-path.asl.json) - An example that adds a non-destructive _ResultPath_ to the Lambda Task State.
* [lambda-with-result-path-and-input-parameter.asl.json](statemachine/lambda-with-result-path-and-input-parameter.asl.json) - An example that adds a named input parameter to correctly shape the data passed to the Lambda function.
* [lambda-with-result-and-output-paths.asl.json](statemachine/lambda-with-result-and-output-paths.asl.json) - An example that adds an _OutputPath_ to reduce the size of the execution state.
* [pass-state-manipulation.asl.json](statemachine/pass-state-manipulation.asl.json) - An example that uses data manipulation in a Pass State to reshape the execution state.
* [arrays.asl.json](statemachine/arrays.asl.json) - An example that shows how to filter for individual items or collections of items in an array in the execution state.

[jsonpath]: https://www.youtube.com/watch?v=QpZ6IdKvOdw

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
