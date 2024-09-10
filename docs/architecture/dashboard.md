# Dashboard
The Dashboard Template describes the Sidebar in the Dashboard containing the visualization of the Dataset. The template translates the data into Plots, Images, ...

You can create a different visualization for different [GEO JSON Features](###Geo-Data-Structure). Therefore you can define different Template Objects and select which `featureTypes` they are relevant for. Furthermore you can define which `title` and `description` the sidebar should show.

The `widgets` describe the actual visualizations that will be displayed in the sidebar. There are different Widget visualizations you can select from [Widgets Overview](###-Widget-Overview).

```json 
[
    {
        "featureTypes": [
            "BAUM"
        ], 
        "title": "Baum Auswertung", // Wird dargestellt
        "description": "Das ist eine Auswertung der Bäume auf dem Fehld", // Wird dargestellt
        "widgets": [
            //...
        ]
    },
    //...
]
```
### Widget Overview
At the moment you can select between two Kategories of Visualizations with different subtypes:
- Charts 
    - Bar Chart: `CHART:BAR`
    - Line Chart: `CHART:LINE`
    - Pie Chart: `CHART:CHART`
    - Scatter Plot: `CHART:SCATTER`
- Images: `IMAGES`

### Anatomy of a Widget
A Widget always need a `type`, which describes the concrete visualisation of the data. [Different Types](###-Widget-Overview). 

The most important information for the widget is the data attribute. This referes to the Dataset, the data for the visualization is loaded from. Conrete the Dataset Type you defined in the [Dataset](###Dataset-Datastructure). Sometimes you don't want to visualize all values (in one Diagram) therefore you must define the values that should be visualized in the diagramm. Again you have to use the same value types defined in the [Dataset](###Dataset-Datastructure).


```json 
{
    "type": "CHART:BAR | CHART:LINE | IMAGES | ...", 
    "data": "TIMESERIES",
    "values": [
        "Fruchtanzahl",
        //...
    ],
    //...
}
```

### Charts
Depending on the Widget Type we have different Attributes to controll the look and feel of the widget. 

When multiple values should be visualized e.g. different series within a dataset you can controll the visualization with the `grouping` attribute. COLORS will visualize all Series in one Diagramm and FACET will create different diagrams for each series. 

Furthermore we can create `clickableDatapoints` in a chart. This allows the user to click on a single Datapoint e.g. a Timeseries Timestamp and reveal more details about this datapoint. The Details are defined in the `datapointsWidgets` where you can include Widgets that visualize specific elements of the datapoint. One example is an Image Widget that shows the images from the Datapoint that are used for the values. 

```json 
{   
    "type": "CHART:BAR", // Barchart, Linechart, ....
    "data": "TIMESERIES",
    "values": [
        "Fruchtanzahl",
        "Blütenfläche",
        "Blattfläche"
    ],
    "grouping": "FACET | COLOR",
    "clickableDatapoint": true,
    "datapointWidgets": [
        {
            "type": "IMAGES",
            "data": "images",
            "bounding_boxes": true
        }
    ]
}
```

### Images
A Dataset item can contain Images. To visualize those Images you can use the image Widget. You don't need a value definition in this Widget. Furthermore you can decide if you want to visualize the Boundingboxes or not. 

```json 
{
    "type": "IMAGES",
    "data": "TIMESERIES",
    "bounding_boxes": true
}
```

