// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

package main

import (
	"encoding/json"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/eventbridge"
)

// Input is a basic EventBridge event without the Resources field
type Input struct {
	EventBusName string
	Source       string
	DetailType   string
	Time         time.Time
	Detail       interface{}
}

func handler(input Input) (eventbridge.PutEventsOutput, error) {
	sess := session.Must(session.NewSession())
	eb := eventbridge.New(sess)

	bytes, err := json.Marshal(input.Detail)
	if err != nil {
		return eventbridge.PutEventsOutput{}, err
	}

	detail := string(bytes)

	pere := &eventbridge.PutEventsRequestEntry{
		Detail:       aws.String(detail),
		DetailType:   aws.String(input.DetailType),
		EventBusName: aws.String(input.EventBusName),
		Source:       aws.String(input.Source),
		Time:         aws.Time(input.Time),
	}

	var entries []*eventbridge.PutEventsRequestEntry
	entries = append(entries, pere)

	output, err := eb.PutEvents(&eventbridge.PutEventsInput{
		Entries: entries,
	})

	if err != nil {
		return eventbridge.PutEventsOutput{}, err
	}

	return *output, nil
}

func main() {
	lambda.Start(handler)
}
