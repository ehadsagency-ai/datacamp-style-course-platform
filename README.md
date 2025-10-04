# 🚀 DevOps PSL MINES - Infrastructure Repository

**Type:** Infrastructure & Operations
**Status:** Active
**Environment:** Production-Grade Configuration

---

## 📋 Overview

This repository contains all DevOps infrastructure, automation, and operational tools for PSL MINES projects.

**Configured in:** `~/.claude/global_config.json` ✅
**Auto-loaded:** Environment variables load automatically when entering this directory ✅

---

## 📁 Repository Structure

```
DevOps/
├── infrastructure/          # Infrastructure as Code
├── kubernetes/             # K8s manifests and configs
├── terraform/              # Terraform modules
├── ansible/                # Ansible playbooks
├── docker/                 # Dockerfiles and compose
├── ci-cd/                  # CI/CD pipelines
├── monitoring/             # Monitoring and alerting
├── scripts/                # Automation scripts
├── docs/                   # Documentation
├── AWS/                    # AWS-specific configs
├── Jenkins/                # Jenkins pipelines
├── GitLab/                 # GitLab CI configs
├── Prometheus/             # Prometheus configs
├── Datadog/                # Datadog monitoring
└── .env                    # Auto-loaded variables ✅
```

---

## 🔧 Technologies Stack

### Container Orchestration
- **Kubernetes** - Container orchestration
- **Docker** - Containerization
- **Docker Compose** - Multi-container apps

### Infrastructure as Code
- **Terraform** - Infrastructure provisioning
- **Ansible** - Configuration management
- **Vagrant** - Development environments

### CI/CD
- **Jenkins** - Automation server
- **GitLab CI** - GitLab pipelines
- **GitHub Actions** - GitHub workflows

### Monitoring & Observability
- **Prometheus** - Metrics collection
- **Grafana** - Dashboards
- **Datadog** - APM and monitoring
- **Elasticsearch** - Log aggregation

### Cloud Platforms
- **AWS** - Amazon Web Services
- **Azure** - Microsoft Azure (if configured)
- **GCP** - Google Cloud Platform (if configured)

### Databases
- **MongoDB** - NoSQL database
- **Neo4j** - Graph database
- **SQL** - Relational databases

### Programming & Scripting
- **Python** - Automation scripts
- **Bash** - Shell scripts
- **FastAPI** - API development

---

## 🚀 Quick Start

### Environment Variables

All environment variables are **automatically loaded** when you enter this directory:

```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/DevOps

# Variables are now loaded!
echo $PROJECT_NAME          # devops_psl_mines
echo $KUBECONFIG           # ~/.kube/config
echo $TERRAFORM_DIR        # Path to terraform directory
```

### Key Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `PROJECT_NAME` | devops_psl_mines | Project identifier |
| `ENVIRONMENT` | development | Current environment |
| `KUBECONFIG` | ~/.kube/config | Kubernetes config |
| `TF_VAR_project_name` | psl-mines-devops | Terraform project |
| `AWS_REGION` | eu-west-1 | Default AWS region |
| `DOCKER_BUILDKIT` | 1 | Enable BuildKit |

**See `.env` for complete list** of variables.

---

## 📚 Usage Examples

### Kubernetes

```bash
# Set namespace
export KUBE_NAMESPACE=production

# Get pods
kubectl get pods -n $KUBE_NAMESPACE

# Apply manifests
kubectl apply -f kubernetes/deployments/
```

### Terraform

```bash
cd terraform/

# Initialize
terraform init

# Plan
terraform plan

# Apply
terraform apply
```

### Ansible

```bash
cd ansible/

# Run playbook
ansible-playbook playbooks/setup.yml

# Check inventory
ansible-inventory --list
```

### Docker

```bash
cd docker/

# Build with BuildKit
docker build -t myapp:latest .

# Compose up
docker-compose up -d
```

---

## 🔐 Security

### Credentials Management

**Never commit secrets!**

Use the encrypted secrets manager:

```bash
# Store a secret
python3 ~/.claude/secrets_manager.py set AWS_ACCESS_KEY_ID

# Retrieve a secret
python3 ~/.claude/secrets_manager.py get AWS_ACCESS_KEY_ID

# List secrets
python3 ~/.claude/secrets_manager.py list
```

### Gitignore Protection

The following are automatically gitignored:
- `.env`
- `.env.local`
- `.env.production`
- `*_credentials*`
- `*.key`
- `*.pem`

---

## 🛠 Development Workflow

### 1. Navigate to DevOps Directory

```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/DevOps
```

### 2. Environment Auto-Loads

All variables from `.env` are automatically exported.

### 3. Work on Infrastructure

```bash
# Kubernetes
cd kubernetes/
kubectl apply -f manifests/

# Terraform
cd terraform/
terraform plan

# Ansible
cd ansible/
ansible-playbook playbooks/deploy.yml
```

### 4. Validate Changes

```bash
# Validate global config
python3 ~/.claude/config_loader.py --validate

# Get DevOps project config
python3 ~/.claude/config_loader.py --project devops_psl_mines
```

---

## 📊 Monitoring

### Prometheus

```bash
# Access Prometheus
open $PROMETHEUS_URL

# Query metrics
curl $PROMETHEUS_URL/api/v1/query?query=up
```

### Grafana

```bash
# Access Grafana
open $GRAFANA_URL
```

### Datadog

```bash
# Datadog site
echo $DATADOG_SITE
```

---

## 🔄 CI/CD Pipelines

### Jenkins

```bash
# Access Jenkins
open $JENKINS_URL
```

### GitLab CI

```bash
# GitLab URL
echo $GITLAB_URL
```

---

## 📖 Documentation

### Internal Documentation

- **This README** - Overview and quick start
- `docs/` - Detailed documentation
- Each subdirectory has its own README

### External Resources

- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Terraform Docs](https://www.terraform.io/docs)
- [Ansible Docs](https://docs.ansible.com/)
- [Docker Docs](https://docs.docker.com/)

---

## 🧪 Testing

### Validate Environment

```bash
# Check all environment variables loaded
env | grep -E "(PROJECT_NAME|KUBECONFIG|TF_VAR|ANSIBLE)"

# Validate global configuration
python3 ~/.claude/config_loader.py --validate

# Run full test suite
~/.claude/test_environment.sh
```

---

## 🎯 Project Configuration

This project is configured in the global environment:

```json
{
  "projects": {
    "devops_psl_mines": {
      "path": "..../PSL_MINES/DevOps",
      "type": "infrastructure",
      "status": "active",
      "technologies": [
        "kubernetes",
        "terraform",
        "ansible",
        "docker",
        "jenkins",
        "gitlab",
        "prometheus",
        "datadog",
        "aws"
      ]
    }
  }
}
```

**View full config:**
```bash
python3 ~/.claude/config_loader.py --project devops_psl_mines | jq
```

---

## 🔧 Maintenance

### Update Environment Variables

```bash
# Edit .env
vim .env

# Reload environment
cd . # or: source ~/.claude/env_loader.sh
```

### Backup Configuration

```bash
# Create backup
claude-backup

# View backups
ls -lh ~/.config/backups/claude/
```

### Update Global Config

```bash
# Edit global config
vim ~/.claude/global_config.json

# Validate
python3 ~/.claude/config_loader.py --validate

# Reload
claude-reload
```

---

## 🆘 Troubleshooting

### Environment Variables Not Loading

```bash
# Check if .env exists
ls -la .env

# Reload environment
source ~/.claude/env_loader.sh

# Check logs
tail -20 ~/.config/logs/env_loader.log
```

### Validate Configuration

```bash
# Check project config
python3 ~/.claude/config_loader.py --project devops_psl_mines

# Validate environment
claude-validate

# Run tests
~/.claude/test_environment.sh
```

---

## 📞 Support

**Global Environment Documentation:**
- Complete guide: `~/.claude/PRODUCTION_ENVIRONMENT.md`
- Quick reference: `~/.claude/README.md`
- Status: `~/.claude/STATUS.txt`

**Check Status:**
```bash
claude-status
```

---

## 🎓 Learning Resources

### Courses Available in Repository

- **Kubernetes** - Container orchestration
- **Docker** - Containerization
- **Terraform** - Infrastructure as Code
- **Ansible** - Configuration management
- **AWS** - Cloud services
- **Jenkins** - CI/CD automation
- **GitLab** - DevOps platform
- **Monitoring** - Prometheus, Grafana, Datadog
- **Linux & Bash** - System administration
- **Python DevOps** - Automation scripting

---

## ✅ Status

- [x] Directory structure created
- [x] Configured in global environment
- [x] Auto-loading `.env` file
- [x] Documentation complete
- [x] Ready for production use

**Environment:** Production-Ready ✅
**Configuration:** Validated ✅
**Auto-Loading:** Active ✅

---

**Last Updated:** 2025-10-01
**Managed By:** Global Environment Configuration System
**Status:** 🟢 Active
