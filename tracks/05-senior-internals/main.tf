# ==============================================================================
# ☁️ CLOUD SENIOR REFERENCE ARCHITECTURE: MULTI-AZ ENTERPRISE VPC & CLUSTER
# ==============================================================================
# Arquitectura de referencia en Terraform / OpenTofu implementando:
# 1. VPC aislada con subnets públicas, privadas (Apps) y aisladas (Databases).
# 2. NAT Gateways redundantes multi-AZ para alta disponibilidad (SLA 99.99%).
# 3. Remote State Backend con bloqueo distribuido (S3 + DynamoDB).
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Configuración del estado remoto seguro y concurrente
  backend "s3" {
    bucket         = "empresa-tfstate-production"
    key            = "platform/core-infrastructure.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "terraform-state-locks" # Previene ejecuciones simultáneas
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Repository  = "seniority-cloud"
      CostCenter  = "Engineering-Core"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "environment" {
  type    = string
  default = "production"
}

# 1. VPC Principal
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "vpc-${var.environment}-main"
  }
}

# 2. Internet Gateway para tráfico entrante público
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "igw-${var.environment}"
  }
}

# 3. Subnets Públicas (Multi-AZ para Balanceadores de Carga)
resource "aws_subnet" "public_az1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "subnet-public-${var.aws_region}a"
    Tier = "Public-Ingress"
  }
}

resource "aws_subnet" "public_az2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "subnet-public-${var.aws_region}b"
    Tier = "Public-Ingress"
  }
}

# 4. Subnets Privadas (Multi-AZ para Pods de Kubernetes y Microservicios)
resource "aws_subnet" "private_app_az1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "subnet-private-app-${var.aws_region}a"
    Tier = "Compute-Private"
  }
}

resource "aws_subnet" "private_app_az2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.20.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "subnet-private-app-${var.aws_region}b"
    Tier = "Compute-Private"
  }
}

# 5. Subnets Aisladas (Multi-AZ para PostgreSQL RDS y Redis)
resource "aws_subnet" "isolated_db_az1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.100.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "subnet-isolated-db-${var.aws_region}a"
    Tier = "Data-Isolated"
  }
}

resource "aws_subnet" "isolated_db_az2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.200.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "subnet-isolated-db-${var.aws_region}b"
    Tier = "Data-Isolated"
  }
}
