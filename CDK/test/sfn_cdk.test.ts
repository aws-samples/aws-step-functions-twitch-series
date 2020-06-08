// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as SfnCdk from '../lib/sfn_cdk-stack';

test('SQS Queue Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new SfnCdk.SfnCdkStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::SQS::Queue",{
      VisibilityTimeout: 300
    }));
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SfnCdk.SfnCdkStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
});
