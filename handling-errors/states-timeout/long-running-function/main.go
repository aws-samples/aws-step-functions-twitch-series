// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

package main

import (
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
)

func handler() error {

	s, err := time.ParseDuration(os.Getenv("MINIMUM_EXECUTION_SECONDS") + "s")
	if err != nil {
		return err
	}

	fmt.Printf("Sleeping for %v seconds\n", s)
	time.Sleep(s)

	return nil
}

func main() {
	lambda.Start(handler)
}
