#!/bin/bash

#https://raw.githubusercontent.com/doctorray117/minecraft-ondemand/main/minecraft-ecsfargate-watchdog/watchdog.sh
#Example: ./watchdog.sh sl-public3 sl-public3-public-api-service fg ZZZZ189029LA8W851XXXX

CLUSTER=$1
SERVICE=$2
SERVERNAME=$3
DNSZONE=$4

## Required Environment Variables
[ -n "$CLUSTER" ] || { echo "CLUSTER env variable must be set to the name of the ECS cluster" ; exit 1; }
[ -n "$SERVICE" ] || { echo "SERVICE env variable must be set to the name of the service in the $CLUSTER cluster" ; exit 1; }
[ -n "$SERVERNAME" ] || { echo "SERVERNAME env variable must be set to the full A record in Route53 we are updating" ; exit 1; }
[ -n "$DNSZONE" ] || { echo "DNSZONE env variable must be set to the Route53 Hosted Zone ID" ; exit 1; }

## get task id from the Fargate metadata
TASK=$(aws ecs list-tasks --cluster $CLUSTER | jq -r '.taskArns[0]' | awk -F/ '{ print $NF }')
echo I believe our task id is $TASK

## get eni from from ECS
ENI=$(aws ecs describe-tasks --cluster $CLUSTER --tasks $TASK --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value | [0]" --output text)
echo I believe our eni is $ENI

PRIVATEIP=$(aws ecs describe-tasks --cluster $CLUSTER --tasks $TASK --query "tasks[0].attachments[0].details[?name=='privateIPv4Address'].value | [0]" --output text)
echo I believe our private IP address is $PRIVATEIP

## get public ip address from EC2
PUBLICIP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
echo "I believe our public IP address is $PUBLICIP"

## update public dns record
echo "Updating DNS record for $SERVERNAME to $PUBLICIP"
aws route53 change-resource-record-sets --hosted-zone-id "$DNSZONE" --change-batch "file://change-resource-record-sets.json"
