#!/usr/bin/python3
# @Time     : 05.03.2023
# @Author   : Ahto Jalak
import aws_cdk as cdk
from aws_cdk import (
    Duration,
    RemovalPolicy,
    Stack,
    aws_autoscaling as autoscaling,
    aws_apigatewayv2 as apigwv2,
    aws_apigatewayv2_integrations as apigwv2integrations,
    aws_ec2 as ec2,
    aws_elasticloadbalancingv2 as elbv2,
    aws_ecs as ecs,
    aws_ecr as ecr,
    aws_iam as iam,
    aws_certificatemanager as acm,
    aws_logs as logs,
    aws_route53 as route53,
    aws_route53_targets as route53targets,
    aws_servicediscovery as sd,
)
from constructs import Construct


class ContainerServiceStack(Stack):

    def __init__(self, scope: Construct, id: str, vpc: object, subnets: ec2.SubnetSelection,
                 cert: acm.Certificate, key_pair: str, main_tag: str, domain_name: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        hosted_zone = route53.HostedZone.from_lookup(self, f"{id}-zone", domain_name=domain_name)
        dn = apigwv2.DomainName(
            self, f"{id}-dn-root",
            domain_name=f"api.{domain_name}",
            certificate=cert,
        )

        # ECS cluster
        cluster = ecs.Cluster(
            self, id,
            cluster_name=id,
            vpc=vpc,
            enable_fargate_capacity_providers=True,
            container_insights=False,
        )

        # Role for task definition
        task_role = iam.Role(
            self, f"{id}-task-execution-role",
            assumed_by=iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
        )
        task_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AmazonECSTaskExecutionRolePolicy"),
        )

        # Logging
        service_log_group = logs.LogGroup(
            self, f"{id}-log-group1",
            log_group_name=f"{id}-service-log1",
            removal_policy=RemovalPolicy.RETAIN,
        )

        service_log_driver = ecs.AwsLogDriver(log_group=service_log_group, stream_prefix=f"{id}-log-stream")

        # Security group for ECS service
        service_sg = ec2.SecurityGroup(
            self, f"{id}-sg",
            allow_all_outbound=True,
            security_group_name=f"{id}-sg",
            vpc=vpc,
            disable_inline_rules=True,
        )
        service_sg.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(22), "allow ssh access from the world")
        service_sg.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(8080), "allow ssh access from the world")

        # BACKEND
        # Task definition for container
        task_definition = ecs.FargateTaskDefinition(
            self, f"{id}-public-api",
            task_role=task_role,
            family=f"{id}_public-api",
        )

        container = task_definition.add_container(
            f"{id}_task_container2",
            image=ecs.ContainerImage.from_ecr_repository(
                repository=ecr.Repository.from_repository_name(
                    self, f"{id}-task-repo",
                    repository_name="sl-public-api",
                ),
                tag=main_tag,
            ),
            logging=service_log_driver,
            memory_limit_mib=512,
            cpu=256,
            environment={},
            linux_parameters=ecs.LinuxParameters(
                self, f"{id}-task-linux-parameters",
                init_process_enabled=True,
            ),
        )

        port_mapping = ecs.PortMapping(
            container_port=8080,
            host_port=8080,
            protocol=ecs.Protocol.TCP,
        )
        container.add_port_mappings(port_mapping)
        # container.add_mount_points(
        #     ecs.MountPoint(container_path="/sldisk", source_volume=f"{id}_efs-ec2", read_only=False)
        # )

        # sg.connections.allow_from(port_range=ec2.Port.tcp(80))

        # ECS service
        ecs_service = ecs.FargateService(
            self, f"{id}-public-api-service",
            service_name=f"{id}-public-api-service",
            cluster=cluster,
            task_definition=task_definition,
            desired_count=1,
            vpc_subnets=subnets,
            assign_public_ip=True,
            security_groups=[service_sg],
            # deployment_alarms=ecs.DeploymentAlarmConfig(
            #    alarm_names=[elb_alarm.alarm_name],
            #    behavior=ecs.AlarmBehavior.ROLLBACK_ON_ALARM
            # ),
        )

        ecs_service.connections.allow_from_any_ipv4(
            ec2.Port.tcp(8080), "public api inbound"
        )

        # Setup AutoScaling policy
        scaling = ecs_service.auto_scale_task_count(max_capacity=1)
        scaling.scale_on_cpu_utilization(
            f"{id}-cpu-scaling",
            target_utilization_percent=50,
            scale_in_cooldown=Duration.seconds(60),
            scale_out_cooldown=Duration.seconds(60),
        )

        # API gateway
        api = apigwv2.HttpApi(
            self, f"{id}-http-proxy-private-api",
            default_integration=apigwv2integrations.HttpUrlIntegration(
                f"{id}-public-api-integration-default", f"http://fg.{domain_name}:8080/"),
            # https://${dn.domainName}/foo goes to prodApi $default stage
            # default_domain_mapping=apigwv2.DomainMappingOptions(domain_name=dn, mapping_key="foo"),
            default_domain_mapping=apigwv2.DomainMappingOptions(domain_name=dn),
            cors_preflight=apigwv2.CorsPreflightOptions(
                allow_headers=["*"],
                allow_methods=[
                    apigwv2.CorsHttpMethod.GET,
                    apigwv2.CorsHttpMethod.POST,
                    apigwv2.CorsHttpMethod.HEAD,
                    apigwv2.CorsHttpMethod.OPTIONS,
                ],
                allow_origins=["*"],
            ),
        )

        result = route53.ARecord(
            self, f"{id}-a-record",
            zone=hosted_zone,
            record_name=f"api.{domain_name}",
            target=route53.RecordTarget.from_alias(
                route53targets.ApiGatewayv2DomainProperties(
                    dn.regional_domain_name, dn.regional_hosted_zone_id)
            )
        )
