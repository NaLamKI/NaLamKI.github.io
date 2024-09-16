# Build your own service

***Note!*** *This is a first version of a documentation for building an own service for the Nalamki plattform. We are currently working on a revised and more detailed version of this tutorial, which will be published by the end of september or beginning of october.*

To implement your own Service, you have to create a class which inherits from `NaLamKIService` as follows:
```python
from sdk.service import NaLamKIService


class ExampleService(NaLamKIService):
    def __init__(self):
        super().__init__()

    def init_model(self):
        return ...

    def process_data(self):
        ...
```
Here two key methods need to be defined.

## Initializing the Model
In the `init_model` method have to initialise and return your model. 
The model can then be accessed via `self.model` anywhere in the class.
<!-- Where to place model checkpoints? -->

## Processing the Data
The `process_data` method is responsible for loading the input files, applying the model and saving the results.

**Load Inputs:**\
Loading the input files can be done via: 
```
  input_files = self.load_inputData()
```
This will return a list of all items contained inside the input folder, defined by `os.path.join(self.action_path, input)`.
For local testing this output directory is set to the folder `test/action/input`.

**Save Results:**\
The output files need to follow the NaLamKI standard for Output Files. 
This is important, to visualize the Data in the digital farm and use the output data interoperable between different Services.
For this you can use the dataclass "GeoOutputData" to create the conform output. 

To save the results, serialize the GeoOutputData object to a JSON string and create an in-memory file, as follows:
```python
from sdk.model.output_data import *

# Create GeoOutputData
output = GeoOutputData(...)

# Dump GeoOutputData to JSON
output_json = json.dumps(dataclasses.asdict(output), cls=NaLamKIDataEncoder)

# Create an in-memory file from JSON String
output_file = io.StringIO(output_json)
output_file.name = 'results.json'
```
Last, store all output files in a list and call: 
```python
self.save_data([output_file])
```
This will save all output files in the directory defined by `os.path.join(self.action_path, output)`.
For local testing the output directory is set to the folder `test/action/output`.

Note that you can save files of any format during the `process_data` method into `os.path.join(self.action_path, output)` independently of the self.save_data method. 


To get started you can modify the code in `test/service.py`.

## Deployment of your service on the webpage

The Nalamki developers are currently working towards a beta version of the plattform to be tested soon! With the Beta version, a tutorial on how to deploy your written service on the plattform will be published as well in our [Deployment Section](/docs/deployment/overview.md).

<!-- TODO-1:
### Deploy Docker Image

HHI registry: http://default-route-openshift-image-registry.apps.k8s.nt.ag/nalamki-hhi-common

### get api key from [registry](https://console-openshift-console.apps.k8s.nt.ag/)

1. login with your user name
2. click on Username -> Copy login command -> login -> Display token
3. copy API token

### login over CLI
```
docker login http://default-route-openshift-image-registry.apps.k8s.nt.ag/nalamki-hhi-common
```

### build your Docker or rename your previous build

#### build
```
docker build -t <registry without http>/<container name>:<version> .
```
e.g.
```
docker build -t default-route-openshift-image-registry.apps.k8s.nt.ag/nalamki-hhi-common/yellow-rust-example:1.0.0 .
```

#### rename
```
docker tag <container name>:<version> <regitry without http>/<container name>:<version>
```
e.g.
```
docker tag yellow-rust-example:1.0.0 default-route-openshift-image-registry.apps.k8s.nt.ag/nalamki-hhi-common/yellow-rust-example:1.0.0
```

### push your Docker to the registry

```
docker push <registry>/<container name>:<version>
```
e.g.
```
docker push default-route-openshift-image-registry.apps.k8s.nt.ag/nalamki-hhi-common/yellow-rust-example:1.0.0
```

### logout
```
docker logout default-route-openshift-image-registry.apps.k8s.nt.ag
```


## FAQ

### Build Partition has not enough space
Docker Desktop:

- open Docker Desktop -> top left are the settings -> Disk image location

[Ubuntu/Linux](https://forums.docker.com/t/how-do-i-change-the-docker-image-installation-directory/1169)
-->


