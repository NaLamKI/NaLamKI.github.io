---
sidebar_position: 4
---

# Building Your AI Project with the StarterKit

This guide will walk you through the process of using the NaLamKI StarterKit to build your own AI project that can be connected to the NaLamKI platform. The StarterKit provides a template and foundation for developing AI services that can process agricultural data and provide valuable insights to farmers.

## Prerequisites

Before you begin, ensure you have:
- Python 3.7 or higher installed
- Docker installed (version 20.10 or higher)
- Basic understanding of Python programming
- Familiarity with AI/ML concepts
- Git installed (for version control)

## Getting Started

1. **Clone the StarterKit Repository**
   ```bash
   git clone git@github.com:NaLamKI/StarterKit.git
   cd StarterKit
   ```

2. **Set Up Your Development Environment**
   ```bash
   python -m venv venv
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Your Service Files**
   ```bash
   # Rename the original service.py (tutorial example) for future reference
   mv src/service.py src/service-tutorial.py
   
   # Copy the template file to create your service implementation
   cp src/service-should.py src/service.py
   ```
   
   The StarterKit includes two important files in the `src` directory:
   - `service.py`: This is the original file that contains the tutorial example (green color detection). You can rename it to `service-tutorial.py` for future reference. For more details about this tutorial example, see [StarterKit Tutorial](../getting-started/starterkit.md).
   - `service-should.py`: This file contains a clean template for your service implementation. You should copy this file to `service.py` and use it as the starting point for your development.

## Understanding the Project Structure

The StarterKit provides a basic structure for your AI service:

```
StarterKit/
├── config/             # Configuration files for dashboard and service catalog
├── src/                # Source code - This is where you'll develop your service
│   ├── service.py      # Main service class - Your primary development file
│   ├── service-should.py # Template file for your service implementation
│   ├── service-tutorial.py # Tutorial example (green color detection)
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

## Container Environment and Data Flow

When your service is deployed and run in a container on the NaLamKI platform, the following happens:

1. **Action Folder Creation**: The SDK automatically creates an `action` folder in the container when the service is called by the NaLamKI platform.

2. **Input Data Handling**: 
   - The SDK downloads the appropriate input data from S3 storage to the `action/input` folder
   - Your service will read input files from this location

3. **Output Data Handling**:
   - Your service will write results to the `action/output` folder
   - The SDK will upload these results back to S3 storage

4. **Local Testing**:
   - When using the `test.py` script in the `test/` directory, these folders are already available in `test/action`
   - This allows you to test your service without connecting to the NaLamKI platform

## Creating Your AI Service

The main focus of your development will be in the `src` directory, specifically the `src/service.py` file. This is where you'll implement your AI service.

### 1. Service Class Definition

First, you need to define your service class that inherits from the NaLamKIService base class:

```python
import io
import json
import os
import dataclasses
from nalamkisdk.model.action.action import *
from nalamkisdk.service import NaLamKIService
from nalamkisdk.model.output_data import *
from nalamkisdk.model.encoder import *

class YourAIService(NaLamKIService):
    def __init__(self):
        super().__init__()
```

### 2. Model Initialization

The `init_model` method is responsible for creating and initializing your AI model:

```python
def init_model(self):
    # Initialize your AI model here
    # This could involve loading pre-trained weights, setting up model parameters, etc.
    return your_model()
```

This method is called once when the service is initialized, and the model is stored as `self.model` for use in the `process_data` method.

### 3. Data Processing

The `process_data` method is the main entry point for processing data. It's called each time the service is invoked with new input data. This method can be broken down into several steps:

#### 3.1 Reading Input Data

```python
def process_data(self):
    # Load input data from the action/input folder
    input_files = self.load_inputData()
    
    # input_files is a list of file paths to the input data
    # These files are located in the action/input directory
```

The `load_inputData` method is provided by the NaLamKIService base class and returns a list of file paths to the input data.

#### 3.2 Processing Data with Your Model

```python
# Process each input file with your AI model
results = []
for input_file in input_files:
    # Process the file with your model
    result = self.model.process(input_file)
    results.append(result)
```

This section iterates through each input file and processes it with your model. The `process` method of your model should be implemented to handle the specific type of input data your service is designed to work with.

#### 3.3 Creating Output Data

```python
# Format the results using SDK dataclasses
# This ensures the output is in the correct format for the platform
output = GeoOutputData(
    type="FeatureCollection",
    features=[
        {
            "geometry": {
                "type": "Point",
                "coordinates": [result.longitude, result.latitude]
            },
            "properties": {
                # Add your model's output data here
                "result_value": result.value
            }
        }
        for result in results
    ]
)
```

This section formats the results from your model into the appropriate output format. The NaLamKI platform expects outputs to be in GeoJSON format, which is a standard format for encoding geographic data structures.

> **Note:** For a comprehensive explanation of the data structures used in NaLamKI and how they map to visualizations in the dashboard, see [Data Structures and Visualization](./data-structures-visualization.md).

The `GeoOutputData` class is provided by the SDK and helps ensure your output is correctly formatted. It includes:
- A `type` field specifying the GeoJSON type (e.g., "FeatureCollection")
- A `features` list containing the individual features

Each feature includes:
- A `geometry` object describing the spatial information (e.g., a point with coordinates)
- A `properties` object containing the attributes of the feature

#### 3.4 Saving Output Data

```python
# Save the results to the action/output folder
output_json = json.dumps(dataclasses.asdict(output), 
                       cls=NaLamKIDataEncoder)
output_file = io.StringIO(output_json)
output_file.name = 'results.json'
self.save_data([output_file])
```

This section serializes the output data to JSON and saves it to the output directory. The `NaLamKIDataEncoder` class is provided by the SDK and handles the serialization of the output data.

The `save_data` method is provided by the NaLamKIService base class and saves the output files to the `action/output` directory.

## Testing Your Service

To test your service implementation:

1. **Prepare Test Data**
   - Place test data in the `test/action/input` directory

2. **Run the Test**
   ```bash
   python test/test.py
   ```

   This will run your service implementation from the `src` directory using the test data.

## Example Implementation

The StarterKit includes an example service that detects green colors in images. This example demonstrates:

1. How to load input data
2. How to process the data with a model
3. How to save the results in the correct format

You can find this example in the `src/service-tutorial.py` file (renamed from the original `service.py`). For a detailed walkthrough of this example, see [StarterKit Tutorial](../getting-started/starterkit.md). The `service-should.py` file contains a template that you can use as a starting point for your own implementation.

## Best Practices

1. **Data Processing**
   - Always validate input data
   - Implement proper error handling
   - Use appropriate data structures
   - Follow GeoJSON standards

2. **Model Integration**
   - Keep model initialization separate from processing
   - Implement proper model versioning
   - Handle model loading errors gracefully
   - Optimize for performance

3. **Output Generation**
   - Follow NaLamKI output standards
   - Include all required metadata
   - Implement proper error reporting
   - Use appropriate visualization formats

## Common Use Cases

1. **Image Processing**
   - Crop detection
   - Disease identification
   - Yield estimation
   - Growth monitoring

2. **Sensor Data Analysis**
   - Soil moisture analysis
   - Weather data processing
   - Environmental monitoring
   - Irrigation optimization

3. **Time Series Analysis**
   - Growth pattern analysis
   - Yield prediction
   - Disease progression tracking
   - Weather impact assessment

## Troubleshooting

Common issues and solutions:

1. **Model Loading Issues**
   - Check model file paths
   - Verify model format compatibility
   - Ensure all dependencies are installed
   - Check memory requirements

2. **Data Processing Errors**
   - Validate input data format
   - Check file permissions
   - Verify data preprocessing steps
   - Monitor memory usage

3. **Output Generation Problems**
   - Verify GeoJSON format
   - Check coordinate systems
   - Validate metadata
   - Ensure proper file permissions

## Next Steps

1. **Deployment Preparation**
   - Test with various input data
   - Optimize performance
   - Document your service
   - Prepare deployment package

2. **Platform Integration**
   - Register your service
   - Set up authentication
   - Configure message queues
   - Test platform integration

3. **Documentation**
   - Document your model
   - Create usage examples
   - Provide troubleshooting guides
   - Include performance metrics

## Resources

- [NaLamKI SDK Documentation](../architecture/sdk/overview.md)
- [Data Structures and Visualization](./data-structures-visualization.md)
- [Platform Architecture](../architecture/overview.md) 