# FAQ

## General

### What is the NaLamKI project?
The NaLamKI project is a research initiative aimed at establishing an international standard for AI services in agriculture. It focuses on enhancing agricultural efficiency and sustainability through innovative technologies by connecting farmers with AI service providers.

### Who is the NaLamKI SDK intended for?
The SDK is designed for AI developers, researchers, and agricultural technology companies looking to supply advanced AI solutions to the NaLamKI ecosystem.

## Messaging Queues

### What are messaging queues and why are they important in NaLamKI SDK?
Messaging queues are systems that enable asynchronous communication between different services or components. In the NaLamKI SDK, they facilitate the interaction between AI services and the platform by managing service requests from farmers, ensuring reliable and scalable communication.
## What are the key components of messaging queues
- **Queue**: The storage mechanism where messages are held until they are processed.
- **Producer**: The service or component that sends messages to the queue.
- **Consumer**: The service or component that retrieves and processes messages from the queue.
### How do producers and consumers interact with the messaging queues in NaLamKI SDK?
- **Producers**: The platform (triggered by a user) sends messages (service requests) to their designated queues.
- **Consumers**: Workers (service instances) listen to these queues, retrieve messages, process the tasks, and send back status updates and results.

### How does NaLamKI utilize messaging queues?
In the NaLamKI SDK, messaging queues facilitate the interaction between AI services and the platform by managing service requests from farmers. Here's how they fit into the workflow:
1. **Service Registration**: Services are assigned unique queues identified by UUIDs.
2. **Service Requests**: Farmers' requests are sent as messages to these queues.
3. **Job Processing**: Workers consume messages from queues, process tasks, and send back status updates and results.

### What messaging queue technology does NaLamKI SDK use?
The NaLamKI SDK primarily utilizes [RabbitMQ](https://www.rabbitmq.com/) for managing messaging queues due to its reliability, scalability, and comprehensive feature set.

## S3 Storage

### What is the role of S3 storage in the NaLamKI SDK?
S3 storage serves as the centralized repository where the SDK downloads input data for analysis and uploads the results after processing. It ensures that data is securely stored and easily accessible for both input and output operations.

### How is data secured in S3 storage?
Data in S3 storage is secured through:
- **Authentication Tokens**: Each service request includes an authentication token (JWT) to securely access the provided S3 URLs.
- **Encryption**: All data transmitted to and from S3 is encrypted to protect sensitive information.
- **Access Controls**: Only authorized entities can access specific S3 buckets and objects based on predefined permissions.

### Can I use my own S3 storage with the NaLamKI SDK?
Yes, the NaLamKI SDK is designed to be flexible. You can configure it to interact with your own S3-compatible storage solutions by providing the appropriate URLs and authentication credentials during the service registration process.

## Service Registration and Authentication

### How does service registration work in NaLamKI SDK?
 In the future, Service developers register their AI services by sending an API call to the Service Catalog (eventually through a Developer Portal). Currently, this process is handled by the NaLamKI team per request The NaLamKI team assigns a unique UUID to the service, generates the necessary message queues, and provides a JWT/certificate for authentication. This JWT/certificate must be embedded in the service to authenticate and access the queues.

### What happens if a service does not provide a valid JWT/certificate?
Without a valid JWT/certificate, the service will not be able to authenticate with the messaging queues, effectively preventing it from receiving and processing any service requests. This ensures that only authorized services can interact with the NaLamKI platform.

## Job Execution and Monitoring

### How are service requests processed in NaLamKI SDK?
When a farmer initiates a service request, the Digital Twin sends a message containing commissioning information to the service's message queue. A worker retrieves and acknowledges the message, begins processing, and sends regular heartbeat signals to update the farmer on the progress. Upon completion, the worker sends a final confirmation with the results.

### What information is included in the heartbeat signals?
Heartbeat signals include:
- **Completion Percentage**: Indicates the progress of the task.
- **Current Processing Step**: Shows the current stage of the task.
- **Estimated Remaining Time**: Provides an estimate of how long the process will take.
- **Detailed Error Messages**: Offers comprehensive error information in case of failures.

## Troubleshooting

### The patform any heartbeat updates. What could be the issue?
Possible causes include:
- **Authentication Failure**: Ensure that the JWT/certificate is correctly embedded and valid.
- **Queue Misconfiguration**: Verify that the service is listening to the correct message queue.
- **Network Issues**: Check for any network connectivity problems between the service and the platform.
- **Service Errors**: Inspect logs for any errors that might have occurred during processing.

### How can I verify that my service is correctly registered?
You can verify service registration by:
- **Checking the Service Catalog**: Ensure that your service appears with the correct UUID and message queues.
- **Testing Authentication**: Attempt to authenticate with the message queue using the provided JWT/certificate.
- **Monitoring Logs**: Look for successful registration messages and absence of authentication errors in your service logs.
