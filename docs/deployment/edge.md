# Edge
You can use any device connected to the internet and equipped with sufficient computational power to run your service on the NaLamKI platform.

For this, you need to first setup the project according to the [Getting Started](/docs/category/getting-started-1) guide.
Next, you need to build the Docker image:

```bash
docker build -t <container name>:<version> .
```

Now you can run the Docker image:

```bash
docker run -it <container name>:<version>
```

If you don't encounter any errors, you can run a action on the NaLamKI platform. The console should then display the process of the action. If nothing is displayed after a few seconds, delete the action on the platform and run the action again. Repeat this process a couple of times if necessary. When the process is finished, refresh the NaLamKI page, at this point the action schould display a green checkmark and say "Abgeschlossen" (completed). Now you can either download the results (blue file icon) or view the results in the Ergebnismonitor.
