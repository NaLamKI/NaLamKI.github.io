# Data Structure

## Geo Data Structure
The Geo Datastructure is a GEO JSON (http://geojson.org). You have a Feature Collection with different GEO Features. Features can be (Point, LineString, Polygon, MultiPoint, MultiLineString, and MultiPolygon). All Geo Information are stored in the geometry object.

Every Geo Feature will be visualized automatically on the map in the Dashboard. The Properties contains additional Information like the actual Datasets. [More infos](###Dataset-Datastructure)


```json 
{ 
    "type": "FeatureCollection",
    "features": [
        { 
            "type": "Feature",
            "id": "",  
            "properties": {
                "type": "Baum", // Müssen wir standardisieren vorerst Frei wählbar
                "roiID": "",
                "elevation": 14.3,
                "datasets": [
                    //...
                ]
            },
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

### Dataset Datastructure
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

