const fs = require("fs");

const courses =
  '["0-1 - Bootcamp Overview + Tools Installation Checklist","1-2 - Introduction to DevOps","2-0 - Module Intro + Checklist","3-1 - Introduction to Operating Systems","4-2 - Introduction to Virtualization & Virtual Machines","5-3 - Setup a Linux Virtual Machine","6-4 - Linux File System","7-5 - Introduction to Command Line Interface (CLI - Part 1)","8-6 - Basic Linux Commands (CLI - Part 2)","9-7 - Package Manager - Installing Software on Linux","10-8 - Working with Vim Editor","11-9 - Linux Accounts & Groups (Users & Permissions Part 1)","12-10 - File Ownership & Permissions (Users & Permissions - Part 2)","13-11 - Basic Linux Commands - Pipes & Redirects (CLI - Part 3)","14-12 - Introduction to Shell Scripting Part 1","15-13 - Shell Scripting Part 2 - Concepts & Syntax","16-14 - Shell Scripting Part 3 - Concepts & Syntax","17-15 - Environment Variables","18-16 - Networking","19-17 - SSH - Secure Shell","20-0 - Module Intro + Checklist","21-1 - Introduction to Version Control and Git","22-2 - Basic Concepts of Git","23-3 - Setup Git Repository Remote and Local","24-4 - Working with Git","25-5 - Initialize a Git project locally","26-6 - Concept of Branches","27-7 - Merge Requests","28-8 - Deleting Branches","29-9 - Rebase","30-10 - Resolving Merge Conflicts","31-11 - Gitignore","32-12 - Git stash","33-13 - Going back in history","34-14 - Undoing commits","35-15 - Merging branches","36-16 - Git for Devops","37-1 - Databases in development process","38-2 - Database Types","39-0 - Module Intro + Checklist","40-1 - Introduction to Build Tools","41-2 - Install Build Tools","42-3 - Installation Help for Windows User - Part 1","43-4 - Installation Help for Windows User - Part 2","44-5 - Installation Help for MacOS-Unix User","45-6 - Build an Artifact","46-7 - Build Tools for Development","47-8 - Run the Application","48-9 - Build JS Applications","49-10 - Common Concepts and Differences of Build Tools","50-11 - Publish an Artifact","51-12 - Build Tools & Docker","52-13 - Build Tools for DevOps","53-0 - Module Intro + Checklist","54-1 - Intro to Cloud & IaaS","55-2 - Setup Server on DigitalOcean","56-3 - Deploy and run application artifact on Droplet","57-4 - Create and configure a Linux user on a cloud server","58-0 - Module Intro + Checklist","59-1 - Intro to Artifact Repository Manager","60-2 - Install and Run Nexus on a cloud server","61-3 - Introduction to Nexus","62-4 - Repository Types","63-5 - Publish Artifact to Repository","64-6 - Nexus REST API","65-7 - Blob Store","66-8 - Component vs Asset","67-9 - Cleanup Policies and Scheduled Tasks","68-0 - Module Intro + Checklist","69-1 - What is a Container","70-2 - Container vs Image","71-3 - Docker vs. Virtual Machine","72-4 - Docker Architecture and components","73-5 - Main Docker Commands","74-6 - Debug Commands","75-7 - Docker Demo - Project Overview","76-8 - Developing with Docker","77-9 - Docker Compose - Run multiple Docker containers","78-10 - Dockerfile - Build your own Docker Image","79-11 - Private Docker Repository","80-12 - Deploy docker application on a server","81-13 - Docker Volumes - Persisting Data","82-14 - Docker Volumes Demo","83-15 - Create Docker Hosted Repository on Nexus","84-16 - Deploy Nexus as Docker Container","85-0 - Module Intro + Checklist","86-1 - Intro to Build Automation","87-2 - Install Jenkins","88-3 - Introduction to Jenkins UI","89-4 - Install Build Tools in Jenkins","90-5 - Jenkins Basics Demo - Freestyle Job","91-6 - Docker in Jenkins","92-7 - Freestyle to Pipeline Job","93-8 - Intro to Pipeline Job","94-9 - Jenkinsfile Syntax","95-10 - Create complete Pipeline","96-11 - Intro to Multibranch Pipeline","97-12 - Jenkins Jobs Overview","98-13 - Credentials in Jenkins","99-14 - Jenkins Shared Library","100-15 - Webhooks - Trigger Pipeline Jobs automatically","101-16 - Dynamically Increment Application version in Jenkins Pipeline - Part 1","102-17 - Dynamically Increment Application version in Jenkins Pipeline - Part 2","103-0 - Module Intro + Checklist","104-1 - Introduction to AWS","105-2 - Create an AWS account","106-3 - IAM - Manage Users, Roles and Permissions","107-4 - Regions & Availability Zones","108-5 - VPC - Manage Private Network on AWS","109-6 - CIDR Blocks explained","110-7 - Introduction to EC2 Virtual Cloud Server","111-8 - Deploy to EC2 server from Jenkins Pipeline - CI/CD Part 1","112-9 - Deploy to EC2 server from Jenkins Pipeline - CI/CD Part 2","113-10 - Deploy to EC2 server from Jenkins Pipeline - CI/CD Part 3","114-11 - Introduction to AWS CLI","115-12 - AWS & Terraform Preview","116-13 - Container Services on AWS Preview","117-0 - Module Intro + Checklist","118-1 - Intro to Kubernetes","119-2 - Main Kubernetes Components","120-3 - Kubernetes Architecture","121-4 - Minikube and kubectl - Local Kubernetes Cluster","122-5 - Main kubectl commands","123-6 - YAML Configuration File","124-7 - Complete Demo Project - Deploying Application in Kubernetes Cluster","125-8 - Namespaces - Organizing Components","126-9 - Services - Connecting to Applications inside cluster","127-10 - Ingress - Connecting to Applications outside cluster","128-11 - Volumes - Persisting Application Data","129-12 - ConfigMap & Secret Volume Types","130-13 - StatefulSet - Deploying Stateful Applications","131-14 - Managed Kubernetes Services Explained","132-15 - Helm - Package Manager for Kubernetes","133-16 - Helm Demo - Managed K8s cluster","134-17 - Deploying Images in Kubernetes from private Docker repository","135-18 - Kubernetes Operators for Managing Complex Applications","136-19 - Helm and Operator Demo","137-20 - Secure your cluster - Authorization with RBAC","138-21 - Microservices in Kubernetes","139-22 - Demo project: Deploy Microservices Application","140-23 - Production & Security Best Practices","141-24 - Demo project: Create Helm Chart for Microservices","142-25 - Demo project: Deploy Microservices with Helmfile","143-0 - Module Intro + Checklist","144-1 - Container Services on AWS","145-2 - Create EKS cluster with AWS Management Console","146-3 - Configure Autoscaling in EKS cluster","147-4 - Create Fargate Profile for EKS Cluster","148-5 - Create EKS cluster with eksctl command line tool","149-6 - Deploy to EKS Cluster from Jenkins Pipeline","150-7 - BONUS: Deploy to LKE Cluster from Jenkins Pipeline","151-8 - Jenkins Credentials Note on Best Practices","152-9 - Complete CI/CD Pipeline with EKS and DockerHub","153-10 - Complete CI/CD Pipeline with EKS and ECR","154-0 - Module Intro + Checklist","155-1 - Introduction to Terraform","156-2 - Install Terraform & Setup Terraform Project","157-3 - Providers in Terraform","158-4 - Resources & Data Sources","159-5 - Change & Destroy Terraform Resources","160-6 - Terraform commands","161-7 - Terraform State","162-8 - Output Values","163-9 - Variables in Terraform","164-10 - Environment Variables in Terraform","165-11 - Create Git Repository for local Terraform Project","166-12 - Automate Provisioning EC2 with Terraform - Part 1","167-13 - Automate Provisioning EC2 with Terraform - Part 2","168-14 - Automate Provisioning EC2 with Terraform - Part 3","169-15 - Provisioners in Terraform","170-16 - Modules in Terraform - Part 1","171-17 - Modules in Terraform - Part 2","172-18 - Modules in Terraform - Part 3","173-19 - Automate Provisioning EKS cluster with Terraform - Part 1","174-20 - Automate Provisioning EKS cluster with Terraform - Part 2","175-21 - Automate Provisioning EKS cluster with Terraform - Part 3","176-22 - Complete CI/CD with Terraform - Part 1","177-23 - Complete CI/CD with Terraform - Part 2","178-24 - Complete CI/CD with Terraform - Part 3","179-25 - Remote State in Terraform","180-0 - Module Intro + Checklist","181-1 - Introduction to Python","182-2 - Installation and Local Setup","183-3 - Our first Python Program","184-4 - Python IDE vs Simple File Editor","185-5 - Strings and Number Data Types","186-6 - Variables","187-7 - Functions","188-8 - Accepting User Input","189-9 - Conditionals (if / else) and Boolean Data Type","190-10 - Error Handling with Try-Except","191-11 - While Loops","192-12 - Lists and For Loops","193-13 - Comments","194-14 - Sets","195-15 - Built-In Functions","196-16 - Dictionary Data Type","197-17 - Modules","198-18 - Project: Countdown App","199-19 - Packages, PyPI and pip","200-20 - Project: Automation with Python (Spreadsheet)","201-21 - OOP: Classes and Objects","202-22 - Project: API Request to GitLab","203-0 - Module Intro + Checklist","204-1 - Introduction to Boto Library (AWS SDK for Python)","205-2 - Install Boto3 and connect to AWS","206-3 - Getting familiar with Boto","207-4 - Terraform vs Python - understand when to use which tool","208-5 - Health Check: EC2 Status Checks","209-6 - Write a Scheduled Task in Python","210-7 - Configure Server: Add Environment Tags to EC2 Instances","211-8 - EKS cluster information","212-9 - Backup EC2 Volumes: Automate creating Snapshots","213-10 - Automate cleanup of old Snapshots","214-11 - Automate restoring EC2 Volume from the Backup","215-12 - Handling Errors","216-13 - Website Monitoring 1: Scheduled Task to Monitor Application Health","217-14 - Website Monitoring 2: Automated Email Notification","218-15 - Website Monitoring 3: Restart Application and Reboot Server","219-0 - Module Intro + Checklist","220-1 - Introduction to Ansible","221-2 - Install Ansible","222-3 - Setup Managed Server to Configure with Ansible","223-4 - Ansible Inventory and Ansible ad-hoc commands","224-5 - Configure AWS EC2 server with Ansible","225-6 - Managing Host Key Checking and SSH keys","226-7 - Introduction to Playbooks","227-8 - Ansible Modules","228-9 - Collections in Ansible","229-10 - Project: Deploy Nodejs application - Part 1","230-11 - Project: Deploy Nodejs application - Part 2","231-12 - Project: Deploy Nodejs application - Part 3","232-13 - Ansible Variables - make your Playbook customizable","233-14 - Project Deploy Nexus - Part 1","234-15 - Project Deploy Nexus - Part 2","235-16 - Ansible Configuration - Default Inventory File","236-17 - Project: Run Docker applications - Part 1","237-18 - Project: Run Docker applications - Part 2","238-19 - Project: Terraform & Ansible","239-20 - Dynamic Inventory for EC2 Servers","240-21 - Project: Deploying Application in K8s","241-22 - Project: Run Ansible from Jenkins Pipeline - Part 1","242-23 - Project: Run Ansible from Jenkins Pipeline - Part 2","243-24 - Project: Run Ansible from Jenkins Pipeline - Part 3","244-25 - Ansible Roles - Make your Ansible content more reusable and modular","245-0 - Module Intro + Checklist","246-1 - Introduction to Monitoring with Prometheus | 20:55","247-2 - Install Prometheus Stack in Kubernetes | 20:57","248-3 - Data Visualization with Prometheus UI | 11:11","249-4 - Introduction to Grafana | 23:25","250-5 - Alert Rules in Prometheus | 20:22","251-6 - Create own Alert Rules - Part 1 | 9:31","252-7 - Create own Alert Rules - Part 2 | 20:45","253-8 - Create own Alert Rules - Part 3 | 5:39","254-9 - Introduction to Alertmanager | 8:34","255-10 - Configure Alertmanager with Email Receiver | 22:06","256-11 - Trigger Alerts for Email Receiver | 6:06","257-12 - Monitor Third-Party Applications | 2:46","258-13 - Deploy Redis Exporter | 14:32","259-14 - Alert Rules & Grafana Dashboard for Redis | 13:15","260-15 - Collect & Expose Metrics with Prometheus Client Library (Monitor own App - Part 1) | 22:12","261-16 - Scrape Own Application Metrics & Configure Own Grafana Dashboard (Monitor own App - Part 2) | 15:56","262-Congratulations & Wrap Up"]';

console.log("Hello");