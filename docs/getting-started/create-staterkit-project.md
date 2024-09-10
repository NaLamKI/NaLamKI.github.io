# Starter Kit
This guide will help you set up and run the service locally. It also explains how to create a new custom Service.

### Prerequisites
Clone the repository and navigate to the project folder:
```sh
git clone git@github.com:Bonn-Consulting-UG/NaLamKI-Example-Services.git
cd NaLamKI-Example-Services
```

If you don't have access to the repository, please contact the [NaLamKI team](mailto:peter.kloke@hhi.fraunhofer.de). 
If you encounter any issues, please refer to the GitHub documentation on [how to clone a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

Download all necessary requirements via:
  ```sh
  pip install -r requirements.txt
  ```
### Test Example
To run a minimal example, execute:
```sh
python test/test.py
```
This initializes a service defined in `test/service.py` and runs the service locally. 

In this example a dummy model is used which detects green colors. The code demonstrates how the data is loaded, processed by the model and saved.
The test data must be located in `test/action/input` and 
all results are saved into `test/action/output`. 

Results can be visualized executing:
```sh
python test/visualize_outputs.py
```

## Build your own service
To implement you own Service, you have to create a class which inherits from `NaLamKIService` as follows:
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

### Initilizing the Model
In the `init_model` method have to initialise and return your model. 
The model can then be accessed via `self.model` anywhere in the class.
<!-- Where to place model checkpoints? -->

### Processing the Data
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


<!-- TODO:
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

