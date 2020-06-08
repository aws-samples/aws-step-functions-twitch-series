# States timeout

A workflow that triggers the _States.Timeout_ error.

## Deployment instructions

```bash
sam build && sam deploy --guided
```

It is safe to accept all defaults. The state machine will deploy into your AWS account in the region you specify.

### Parameters

* _TimeoutSeconds_ - the limit in seconds before the Task State of your state machine times out
* _MinimumExecutionSeconds_ - the minimum length of time in seconds for your Task State to execute

**Note:** To force a _States.Timeout_ error you need to specify a value for _MinimumExecutionSeconds_ greater than the value you specify for _TimeoutSeconds_.

---
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
