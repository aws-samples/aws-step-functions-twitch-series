# Nested workflows

Code from the [Nested workflows][nested-workflows] episode on 19 May 2020.

## State machine definitions

The following state machine definitions are provided in the order of their appearance in the episode:

* [parent-workflow](parent-workflow.asl.json) - An AWS Step Functions Standard Workflow that invokes and orchestrates nested workflows.
* [failing-child-workflow](failing-workflow.asl.json) - An AWS Step Functions Express Workflow that always fails.
* [succeeding-child-workflow](succeeding-workflow.asl.json) - An AWS Step Functions Standard Workflow that always succeeds.

[nested-workflows]: https://youtu.be/FmLdqQMQHFs

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
