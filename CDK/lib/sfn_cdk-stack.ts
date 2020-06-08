// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

export class SfnCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      const myTable = new ddb.Table(this, 'MyTable', {
        partitionKey: {name: "RequestId", type: ddb.AttributeType.STRING}
      })

      const submitLambda = new lambda.Function(this, 'SubmitLambda', {
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: 'index.main',
        code: lambda.Code.inline('def main(event, context):\n\treturn(event)')
      });

      const getStatusLambda = new lambda.Function(this, 'StatusLambda', {
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: 'index.main',
        code: lambda.Code.inline('def main(event, context):\n\treturn("SUCCEEDED")')
      });

      const submitJob = new sfn.Task(this, 'Submit Job', {
          task: new tasks.RunLambdaTask(submitLambda, {
            payload: sfn.TaskInput.fromDataAt('$'),
          }),
          // Put Lambda's result here in the execution's state object
          resultPath: '$.guid',
      });

      const getStatus = new sfn.Task(this, 'Get Job Status', {
        task: new tasks.RunLambdaTask(getStatusLambda, {
          payload: sfn.TaskInput.fromDataAt('$.guid'),
        }),
        resultPath: '$.status'
      });

      const waitX = new sfn.Wait(this, 'Wait X Seconds', {
          time: sfn.WaitTime.secondsPath('$.waitSeconds'),
      });

      const jobFailed = new sfn.Fail(this, 'Job Failed', {
          cause: 'Job Failed',
          error: 'DescribeJob returned FAILED',
      });

      const finalStatus = new sfn.Task(this, 'Get Final Job Status', {
          task: new tasks.RunLambdaTask(getStatusLambda, {
          }),
          // Use "guid" field as input, output of the Lambda becomes the
          // entire state machine output.
          inputPath: '$.guid',
          resultPath: '$.status.Payload'
      });
      
      const putItemInTable = new sfn.Task(this, 'Write to DDB', {
        task: tasks.CallDynamoDB.putItem({
          item: {
            // "PrimaryKey": new tasks.DynamoAttributeValue().withS('$.status.Payload')
            "RequestId": new DynamoDynamicAttributeValue().withDynamicS('$.guid.SdkHttpMetadata.HttpHeaders.x-amzn-RequestId'),
            "TraceId": new DynamoDynamicAttributeValue().withDynamicS('$.guid.SdkHttpMetadata.HttpHeaders.X-Amzn-Trace-Id'),
            "Status": new DynamoDynamicAttributeValue().withDynamicS('$.status.Payload')
          },
          tableName: myTable.tableName}),
          inputPath: '$',
          resultPath: "$.ddb"
      })
      
      putItemInTable.next(finalStatus);

      const definition = submitJob
          .next(waitX)
          .next(getStatus)
          .next(new sfn.Choice(this, 'Job Complete?')
              // Look at the "status" field
              .when(sfn.Condition.stringEquals('$.status.Payload', 'FAILED'), jobFailed)
              .when(sfn.Condition.stringEquals('$.status.Payload', 'SUCCEEDED'), putItemInTable)
              .otherwise(waitX));

      new sfn.StateMachine(this, 'StateMachine', {
          definition,
          timeout: cdk.Duration.minutes(5)
      });

  }
}

export class DynamoDynamicAttributeValue extends tasks.DynamoAttributeValue{
  private dynamicAttributeValue: any = {};

  /**
   * Sets an attribute of type String. For example:  "S": "Hello"
   */
  public withS(value: string) {
    this.dynamicAttributeValue.S = value;
    return this;
  }
  
  public withDynamicS(value: string) {
    this.dynamicAttributeValue.S = value;
    return this;
  }

  /**
   * Sets an attribute of type Number. For example:  "N": "123.45"
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public withN(value: string) {
    this.dynamicAttributeValue.N = value;
    return this;
  }

  /**
   * Sets an attribute of type Binary. For example:  "B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk"
   */
  public withB(value: string) {
    this.dynamicAttributeValue.B = value;
    return this;
  }

  /**
   * Sets an attribute of type String Set. For example:  "SS": ["Giraffe", "Hippo" ,"Zebra"]
   */
  public withSS(value: string[]) {
    this.dynamicAttributeValue.SS = value;
    return this;
  }

  /**
   * Sets an attribute of type Number Set. For example:  "NS": ["42.2", "-19", "7.5", "3.14"]
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public withNS(value: string[]) {
    this.dynamicAttributeValue.NS = value;
    return this;
  }

  /**
   * Sets an attribute of type Binary Set. For example:  "BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="]
   */
  public withBS(value: string[]) {
    this.dynamicAttributeValue.BS = value;
    return this;
  }

  /**
   * Sets an attribute of type Map. For example:  "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}}
   */
  public withM(value: any) {
    this.dynamicAttributeValue.M = "";
    return this;
  }

  /**
   * Sets an attribute of type List. For example:  "L": [ {"S": "Cookies"} , {"S": "Coffee"}, {"N", "3.14159"}]
   */
  public withL() {
    this.dynamicAttributeValue.L = "";
    return this;
  }

  /**
   * Sets an attribute of type Null. For example:  "NULL": true
   */
  public withNULL(value: boolean) {
    this.dynamicAttributeValue.NULL = value;
    return this;
  }

  /**
   * Sets an attribute of type Boolean. For example:  "BOOL": true
   */
  public withBOOL(value: boolean) {
    this.dynamicAttributeValue.BOOL = value;
    return this;
  }

  /**
   * Return the dynamicAttributeValue object
   */
  public toObject() {
    return {"S.$": this.dynamicAttributeValue.S};
  }
}