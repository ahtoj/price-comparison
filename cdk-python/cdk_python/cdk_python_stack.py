#!/usr/bin/python3
# @Date:    05.03.2023
# @Author:  Ahto Jalak
from aws_cdk import (
    # Duration,
    Stack,
    aws_ec2 as ec2,
    aws_iam as iam,
    aws_certificatemanager as acm,
)
from constructs import Construct

from cdk_python.ecs_stack import ContainerServiceStack
from cdk_python.website_stack import WebsiteStack


class CdkPythonStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, env_vars: dict, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.vpc_dev = ec2.Vpc.from_lookup(self, "myVpc", vpc_id=env_vars['vpc_name'])

        self.public_subnets = ec2.SubnetSelection(

            subnets=[
                ec2.Subnet.from_subnet_attributes(
                    self, "Publicnet_AZ1", availability_zone="eu-west-1a",
                    subnet_id=env_vars['subnet_name1'],
                    route_table_id=env_vars['route_name1'],
                ),
                ec2.Subnet.from_subnet_attributes(
                    self, "Publicnet_AZ2", availability_zone="eu-west-1b",
                    subnet_id=env_vars['subnet_name2'],
                    route_table_id=env_vars['route_name2'],
                ),
            ],
        )

        self.ecs_cluster = ContainerServiceStack(
            self, "sl-public3",
            vpc=self.vpc_dev,
            subnets=self.public_subnets,
            main_tag="latest-prod",
            key_pair="slkey",
            cert=acm.Certificate.from_certificate_arn(
                self, 'default-cert-eu', f'{env_vars["cert_arn_eu"]}'),
            env={
                'region': env_vars['region'],
                'account': env_vars['account'],
            },
            domain_name=env_vars['domain_name'],
        )

        self.website = WebsiteStack(
            self, "price-comparison-web",
            cert=acm.Certificate.from_certificate_arn(
                self, 'default-cert-us', f'{env_vars["cert_arn"]}'),
            env={
                'region': env_vars['region'],
                'account': env_vars['account'],
            },
            domain_name=env_vars['domain_name'],
        )
