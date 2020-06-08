// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

package main

import (
	"fmt"
	"sync"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

// Input is provided by the invoking workflow
type Input struct {
	Bucket string
	Prefix string
}

// Output is returned to the workflow
type Output struct {
	Ops int `json:"operations_performed"`
}

func handler(input Input) (Output, error) {

	sess := session.Must(session.NewSession())
	svc := s3.New(sess)

	i := &s3.ListObjectsV2Input{
		Bucket: aws.String(input.Bucket),
		Prefix: aws.String(input.Prefix),
	}

	result, err := svc.ListObjectsV2(i)
	if err != nil {
		return Output{}, err
	}

	// Do something with native concurrency
	var wg sync.WaitGroup

	for _, obj := range result.Contents {
		if *obj.Key == "100.yaml" {
			wg.Add(1)
			go func() {
				fmt.Println("Processed one object")
				time.Sleep(10 * time.Second)
				wg.Done()
			}()
		}
	}

	wg.Wait()

	ops := len(result.Contents)

	return Output{
		Ops: ops,
	}, nil
}

func main() {
	lambda.Start(handler)
}
