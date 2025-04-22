---
sidebar_position: 1
---

# Starter Kit Tutorial

This guide will walk you through setting up the NaLamKI SDK and running the example service. By the end, you'll have a working example that you can use as a foundation for building your own AI services for the NaLamKI platform.

## Installation

### Prerequisites

Before installing the SDK, make sure you have the following software installed on your system:

- **Operating System**: Windows, macOS, or Linux
- **Python**: Version 3.7 or higher
- **Docker**: Version 20.10 or higher
- **Git**: For cloning repositories (optional but recommended)

### Step 1: Install Python

If you don't have Python installed, download and install it from the 
[official Python website](https://www.python.org/downloads/)

Verify the installation:
```bash
python --version
# Output should be Python 3.7.x or higher
```

### Step 2: Install Docker

Download and install Docker from the 
[official Docker website](https://www.docker.com/get-started)

Verify the installation:
```bash
docker --version
# Output should be Docker version 20.10.x or higher
```

### Step 3: Install the NaLamKI SDK

Install the SDK using `pip`:
```bash
pip install git+https://github.com/NaLamKI/SDK
```

Verify the installation:
```bash
pip show nalamkisdk
# Should display information about the installed SDK
```

## System Requirements

Ensure your system meets the following requirements to avoid any installation or runtime issues:

- **Operating System**: Windows 10 or higher, macOS Catalina or higher, or a recent Linux distribution
- **Python**: Version 3.7 or higher
- **Docker**: Version 20.10 or higher
- **Disk Space**: At least 20 GB of free space for installations and Docker containers
- **Memory**: Minimum 4 GB RAM (8 GB recommended)
- **Internet Connection**: Required for downloading packages and dependencies and deployment of services

## Running the Example Service

### Step 1: Clone the Starter Kit Repository

The Starter Kit provides a template for setting up your AI service. Clone the repository to your local machine:

```bash
git clone git@github.com:NaLamKI/StarterKit.git
cd StarterKit
```

### Step 2: Set Up a Virtual Environment

It's recommended to use a virtual environment to manage dependencies:

```bash
python -m venv venv
# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies

Install the required packages using `pip`:
```bash
pip install -r src/requirements.txt
```

### Step 4: Run the Example Service

Execute the example script to ensure everything is set up correctly:

```bash
python test/test.py
```

This will run the example service that detects green colors in images. The test data must be located in `test/action/input`, and all results are saved into `test/action/output`.

To visualize the results, execute:
```bash
python src/visualize_outputs.py
```

## What's Happening?

The example service demonstrates a simple AI model that detects green colors in images. When you run the test script:

1. The service loads images from the `test/action/input` directory
2. It processes each image to detect green colors
3. It saves the results to the `test/action/output` directory
4. The visualization script displays the results

This is a basic example to get you started. In a real-world scenario, you would replace the green color detection with your own AI model for agricultural applications.

## Project Structure

The StarterKit has the following structure:

```
StarterKit/
├── src/                # Source code - This is where you'll develop your service
│   ├── service.py      # Main service class - Your primary development file
│   ├── requirements.txt # Project dependencies
│   └── visualize_outputs.py # Visualization utilities
├── test/               # Test implementation (for testing purposes only)
│   ├── service.py      # Test service implementation
│   ├── test.py         # Test runner
│   └── action/
│       ├── input/      # Test input data
│       └── output/     # Test output data
└── Dockerfile          # Container configuration
```

## Next Steps

Now that you have a working example, you can:

1. **Learn About Data Structures**
   - Understand how to format your service outputs
   - See how data is visualized in the dashboard
   - [Learn about Data Structures and Visualization](../development/data-structures-visualization.md)

2. **Build Your Own Service**
   - Create a new service based on the example
   - Implement your own AI model
   - [Learn how to build your service](../development/building-with-starterkit.md)

## Resources

- [NaLamKI SDK Documentation](../architecture/sdk/overview.md)
- [Data Structures and Visualization](../development/data-structures-visualization.md)
- [Building Your AI Project](../development/building-with-starterkit.md)
- [Deployment Guide](../development/deployment/overview.md)

