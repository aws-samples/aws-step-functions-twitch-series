// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

package main

import (
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
)

func handler() error {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	ri := r.Int()

	if ri%2 == 1 {
		fmt.Printf("Task failed with odd number: %b\n", ri)
		return errors.New("This task has failed")
	}

	fmt.Printf("Task succeed with even number: %b\n", ri)
	return nil
}

func main() {
	lambda.Start(handler)
}
