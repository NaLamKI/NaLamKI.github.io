# Starter Kit

This guide will teach you how to run a simple example service locally. Once you have completed this tutorial you can go ahead and create an own custom service for the plattform following a [more elaborate example](./own-service.md).

## Prerequisites

### Clone repository

Clone the [repository](https://github.com/NaLamKI/StarterKit/tree/main) of the example service. We recommend using SSH for cloning the repository - for further details you can access the documentation [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

You can clone the repository using this command, when you have set-up your SSH-keys:
```sh
git clone git@github.com:NaLamKI/StarterKit.git
```

### Create virtual environment

Since we will be working with Python code it is recommended creating a virtual environment, we prefer using [conda](https://docs.conda.io/projects/conda/en/4.6.0/user-guide/tasks/manage-environments.html). 

Once the virtual environment is created and activated, install the necessary requirements. You find the requirements file in the source folder:
```sh
  cd src 
  pip install -r requirements.txt
```

Note! If you want to reinstalle an updated version of the requirements, f.e. when you want to use a new version of the SDK's please use this command. 
```sh
pip install --force-reinstall --no-cache-dir -r src/requirements.txt
```

## Test Example
To run the example, execute:
```sh
python test/test.py
```
This initializes a service defined in `test/service.py` and runs the service locally. 

In this example a dummy model is used which detects green colors. The code demonstrates how the data is loaded, processed by the model and saved.
The test data must be located in `test/action/input` and 
all results are saved into `test/action/output`. 

Results can be visualized executing:
```sh
python src/visualize_outputs.py
```

Well Done! You have run a first service that could be deployed on our platform, though we know that this dummy model can barely serve any agricultural practises. Before building a service together that can functions as a fruit detection in an apple plantation for predicing the outcome of the yield, we need to get more familiar with the data structures that we will create while building digital services for NaLamKI. So, follow us in the [next section](data-structures.md).

