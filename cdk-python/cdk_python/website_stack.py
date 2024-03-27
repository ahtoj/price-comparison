#!/usr/bin/python3
# @Date:    11.06.2023
# @Author:  Ahto Jalak
from aws_cdk import (
    Duration,
    RemovalPolicy,
    aws_s3 as s3,
    aws_iam as iam,
    aws_certificatemanager as acm,
    aws_route53 as route53,
    aws_route53_targets as r53_targers,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as cf_origins, Stack,
)
from constructs import Construct


class WebsiteStack(Stack):

    def __init__(self, scope: Construct, id: str, cert: acm.Certificate,
                 domain_name: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        domain_names = [
            f"www.{domain_name}",
            domain_name
        ]

        oin = cloudfront.OriginAccessIdentity(self, f'{id}-cf-origin-access-identity')
        bucket = s3.Bucket(
            self, f"{id}-web-bucket",
            bucket_name=f"{id}-web",
            public_read_access=False,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.RETAIN,
            access_control=s3.BucketAccessControl.PRIVATE,
            object_ownership=s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            encryption=s3.BucketEncryption.S3_MANAGED,
        )
        bucket_images = s3.Bucket(
            self, f"{id}-web-bucket2",
            bucket_name=f"{id}-images",
            public_read_access=False,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.RETAIN,
            access_control=s3.BucketAccessControl.PRIVATE,
            object_ownership=s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            encryption=s3.BucketEncryption.S3_MANAGED,
        )

        bucket.grant_read(oin)
        bucket_images.grant_read(oin)

        zone = route53.HostedZone.from_lookup(
            self, f'{id}-hosted-zone',
            domain_name=domain_name,
        )

        rewrite = cloudfront.Function(
            self, f'{id}-rewrite-function',
            code=cloudfront.FunctionCode.from_file(file_path='functions/url-rewrite.js'),
        )

        my_response_headers_policy = cloudfront.ResponseHeadersPolicy(
            self, f"{id}-response-headers-policy",
            comment="Security headers response header policy",
            security_headers_behavior=cloudfront.ResponseSecurityHeadersBehavior(
                content_security_policy=cloudfront.ResponseHeadersContentSecurityPolicy(
                    content_security_policy="default-src * gap:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data: blob: android-webview-video-poster:; style-src * 'unsafe-inline';",
                    override=True),
                content_type_options=cloudfront.ResponseHeadersContentTypeOptions(
                    override=True),
                frame_options=cloudfront.ResponseHeadersFrameOptions(
                    frame_option=cloudfront.HeadersFrameOption.DENY,
                    override=True),
                referrer_policy=cloudfront.ResponseHeadersReferrerPolicy(
                    referrer_policy=cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
                    override=True),
                strict_transport_security=cloudfront.ResponseHeadersStrictTransportSecurity(
                    access_control_max_age=Duration.days(2 * 365),
                    include_subdomains=True,
                    override=True,
                    preload=True),
                xss_protection=cloudfront.ResponseHeadersXSSProtection(
                    protection=True,
                    mode_block=True,
                    override=True)
            ),
            remove_headers=["Server"],
            server_timing_sampling_rate=50
        )

        distribution = cloudfront.Distribution(
            self, f"{id}-website-dist",
            default_root_object='index.html',
            default_behavior=cloudfront.BehaviorOptions(
                compress=True,
                origin=cf_origins.S3Origin(
                    bucket=bucket, origin_access_identity=oin),
                function_associations=[cloudfront.FunctionAssociation(
                    event_type=cloudfront.FunctionEventType.VIEWER_REQUEST,
                    function=rewrite)],
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                origin_request_policy=cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                response_headers_policy=my_response_headers_policy,
                allowed_methods=cloudfront.AllowedMethods.ALLOW_ALL,
                cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,

            ),
            additional_behaviors={
                "/images/*": cloudfront.BehaviorOptions(
                    compress=True,
                    origin=cf_origins.S3Origin(
                        bucket=bucket_images, origin_access_identity=oin),
                    viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    origin_request_policy=cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                    response_headers_policy=my_response_headers_policy,
                    allowed_methods=cloudfront.AllowedMethods.ALLOW_ALL,
                    cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,
                ),
            },
            domain_names=domain_names,
            price_class=cloudfront.PriceClass.PRICE_CLASS_100,
            certificate=cert,
        )

        for domain_name in domain_names:
            record = route53.ARecord(
                self, f"{id}-record-{domain_name}",
                zone=zone,
                target=route53.RecordTarget.from_alias(r53_targers.CloudFrontTarget(distribution)),
                record_name=domain_name,
            )
