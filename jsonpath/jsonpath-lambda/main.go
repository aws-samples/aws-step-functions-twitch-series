// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

// Input type is input
type Input struct {
	Name string `json:"name"`
}

// Output is output
type Output struct {
	Message string
}

func handler(input Input) (Output, error) {
	fmt.Printf("Received input: %v\n", input)
	return Output{
		Message: "Hello, " + input.Name + "!",
	}, nil
}

func main() {
	lambda.Start(handler)
}
