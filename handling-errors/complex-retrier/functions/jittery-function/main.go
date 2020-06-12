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

	if ri%2 == 0 {
		fmt.Printf("Task failed with even number: %v\n", ri)
		return errors.New("Even number")
	}

	if ri%3 == 0 {
		fmt.Printf("Task failed with number divisible by three: %v\n", ri)
		return fmt.Errorf("Three: %v: %w", ri, errors.New("Multiple of three"))
	}

	fmt.Printf("Task succeeded with odd number not divisible by three: %v\n", ri)
	return nil
}

func main() {
	lambda.Start(handler)
}
