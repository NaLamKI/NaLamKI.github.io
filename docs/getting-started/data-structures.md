# Data Structure

When you want to develop some service for the NaLamKI platform that works with data collected from agricultural machines to improve the outcome of agricultural practices, you have to follow certain data structures. This section will help create the classes in a proper manner.

We have one first example service that you can find as as a [starter kit](starterkit.md). In this example you learn how to to write a main-function for your service, how the necessary class [MyService](https://github.com/NaLamKI/StarterKit/blob/main/src/service.py) is initialized by calling a model and how it processes data. 

When you visualize your results, the location where the picture has been taken is depicted on the map as follows: ![map](./img/Screenshot%20from%202024-09-16%2016-19-05.png) 

For structuring the geo-coordinates regarding the NaLamKI requirements we use the Geo-JSON format. This is the first data structure you will learn in this tutorial. More are to come later ;)


## Geographical Data

For the NaLamKI platform we structure geographical data (longitute and latitude) using [Geo-JSON format](http://geojson.org). You choose from a feature collection how your geographical data will be depicted: Point, LineString, Polygon, MultiPoint, MultiLineString, and MultiPolygon. In our [starter kit example](starterkit.md) we load one image that matches one point on the map, therefore we choose the feature type "Point". Working with Geo-JSON's let's us visualize the necessary features automatically on the map on the platform.


```json 
{ 
    "type": "FeatureCollection",
    "features": [
        { 
        "geometry": {
            "type": "Point",
            "coordinates": [
                13.82027178604052, 
                52.606383808027587
            ]
        }
        }
    ]
}
```

## Other Data Structures

We are currently working on providing you with the documenation on the **dataset data structure**, which contains the remaining information that shall be depicted on the platform. Therefor, we will publish further documentation on working with timestamps, how you can process different file formats (images, videos, sensor data), and how you store the important agricultural information for processing it digitally.

Since NaLamKI is working a lot with artificial intelligence based models, we will also provide you with some explanation on how to develop services with **annotated data and annotations**. 


<!--- START COMMENT: will be uncommented in the next publication iteration, TODO: rewrite and update
## Dataset Datastructure
A Dataset contains the Information "behind" to the Geo Point. A GEO Point can have multiple Datasets. Every Dataset needs a Type that can be referenced later in the Template. The Type is not standardized you can select a Type that describes your data best. Dataset can contain multiple Items. 

Items can have a timestam e.g. for Timeseries and values. Values contain the Alpha numerical information. Every value need a name and an actual value. Additionaly a unit can be defined. 

If you are working with images every Item can contain images e.g. that are analyzed to get the Values. You can work with the imagename given by NaLamKI. Every image on the plattform gets a unique UUID as name and can be identified from the plattform by it's name. No URL,... are required. Images can also contain Bounding Boxes. 

Graphical Visualizations in NaLamKI are generated based on the Datasets. How the values are translated into Plots is described in the [Dashboard Template](##Dashboard-Template-Structure).

```json 
//...
{
    "id": "", 
    "type": "TIMESERIES", 
    "name": "AppleCount",
    "items": [
        {
            "timestamp": "2024-01-01T00:00:00.000", 
            "values": [
                {
                    "type": "Fruchtanzahl", // Müssen wir standardisieren vorerst gleiche wie Name und frei Wählbar
                    "name": "Fruchtanzahl",
                    "value": 27,
                    "unit": "stk"
                },
                // ...
            ],
            "images": [
                {
                    "name": "Detailaufnahme Westen",
                    "type": "DROHNENBILD-10m",  //Input Data Type erstmal nach besten Wissen und Gewissen später standardisiert.
                    "image": "xxx.jpg",
                    "bbox": [
                        {
                            "x": 0.578,
                            "y": 0.342,
                            "h": 0.043,
                            "w": 0.048,
                            "color": "red",
                            "classification": "apple",
                            "label": "extra delicious", //Wird angezeigt
                            "accuracy": 0.5865
                      }
                    ]
                }
            ],
        }
    ]
}
```
END COMMENT-->