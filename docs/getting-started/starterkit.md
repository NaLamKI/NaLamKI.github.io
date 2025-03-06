# Starter Kit

# Installation

To begin using the NaLamKI SDK, ensure your system meets the necessary requirements and follow the installation steps below.

## Prerequisites

Before installing the SDK, make sure you have the following software installed on your system:

- **Operating System**: Windows, macOS, or Linux
- **Python**: Version 3.7 or higher
- **Docker**: Version 20.10 or higher
- **Git**: For cloning repositories (optional but recommended)

## Step 1: Install Python

If you don't have Python installed, download and install it from the 
[official Python website](https://www.python.org/downloads/)

Verify the installation:
```bash
python --version
# Output should be Python 3.7.x or higher
```

## Step 2: Install Docker

Download and install Docker from the 
[official Docker website](https://www.docker.com/get-started)

Verify the installation:
```bash
docker --version
# Output should be Docker version 20.10.x or higher
```

## Step 3: Install the NaLamKI SDK

Install the SDK using `pip`:
```bash
pip install git+https://github.com/NaLamKI/SDK

```

Verify the installation:
```bash
pip show nalamkisdk
# Should display information about the installed SDK
```

# System Requirements

Ensure your system meets the following requirements to avoid any installation or runtime issues:

- **Operating System**: Windows 10 or higher, macOS Catalina or higher, or a recent Linux distribution
- **Python**: Version 3.7 or higher
- **Docker**: Version 20.10 or higher
- **Disk Space**: At least 20 GB of free space for installations and Docker containers
- **Memory**: Minimum 4 GB RAM (8 GB recommended)
- **Internet Connection**: Required for downloading packages and dependencies and deployment of services

# Quick Start Guide

Follow these steps to set up the environment, run an example model locally, and deploy the service using Docker.

## Step 1: Clone the Starter Kit Repository

The Starter Kit provides a template for setting up your AI service. Clone the repository to your local machine:

```bash
git clone git@github.com:NaLamKI/StarterKit.git
cd StarterKit
```

## Step 2: Set Up a Virtual Environment

It's recommended to use a virtual environment to manage dependencies:

```bash
python -m venv venv
# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```
#### Step 3: Install Dependencies

Install the required packages using `pip`:
```bash
pip install -r src/requirements.txt
```

#### Step 4: Run the Example Service Locally

Execute the example script to ensure everything is set up correctly:

```bash
python test/test.py
```

This initializes a service defined in `test/service.py` and runs the service locally.

In this example, a dummy model is used that detects green colors. The code demonstrates how the data is loaded, processed by the model, and saved. The test data must be located in `test/action/input`, and all results are saved into `test/action/output`.

To visualize the results, execute:
```
python src/visualize_outputs.py
```

Well done! You have successfully run your first service that could be deployed on our platform, though we know that this dummy model can barely serve any agricultural practices. Before building a service together that functions as a fruit detection model in an apple plantation for predicting the yield outcome, we need to become more familiar with the data structures we will create while developing digital services for NaLamKI.

Follow us in the [[Data Structure|next section]] or see how to [[Build your own service|build your own service]].

