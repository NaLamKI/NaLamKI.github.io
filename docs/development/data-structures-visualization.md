---
sidebar_position: 6
---

# Data Structures and Visualization

This guide provides a comprehensive explanation of the data structures used in NaLamKI and how they map to visualizations in the dashboard. Understanding these structures is essential for developing effective AI services for the NaLamKI platform.

## Overview

NaLamKI uses a standardized data structure based on GeoJSON for all service outputs. This structure allows for:

1. **Geographic Representation**: All data can be displayed on a map
2. **Flexible Data Types**: Support for various agricultural data types
3. **Time Series Data**: Tracking changes over time
4. **Rich Metadata**: Including units, classifications, and confidence scores
5. **Visualization Mapping**: Automatic mapping to appropriate visualization types

## GeoJSON Foundation

All NaLamKI outputs are based on the GeoJSON format, which is a standard for encoding geographic data structures. The basic structure is:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        // Service-specific properties
      }
    }
  ]
}
```

In NaLamKI, this structure is implemented using Python dataclasses from the SDK, which ensure proper formatting and validation.

## Core Dataclasses

The data structure follows a hierarchical organization where each level can contain multiple instances of the level below it. Here's how the dataclasses are connected:

```
GeoOutputData (root)
└── features: List[GeoFeature]
    ├── type: "Feature"  🌐
    ├── geometry: GeoGeometry/GeoPoint  🌐
    │   └── coordinates: GeoCoordinates.tojson()  🌐
    └── properties: GeoFeatureProperty  🌐
        ├── type: str (visualization type)  🍃
        └── datasets: List[Timeseries]  🍃
            ├── type: str (optional)  🍃
            ├── name: str  🍃
            └── items: List[TimeSeriesItem]  🍃
                ├── timestamp: datetime  🍃
                ├── values: List[DataValue]  🍃
                │   ├── name: str  🍃
                │   ├── value: Any  🍃
                │   ├── type: str  🍃
                │   └── unit: str  🍃
                └── images: List[DataImage]  🍃
                    ├── uri: str  🍃
                    ├── geotiff: str (optional)  🍃
                    └── bbox: List[BoundingBox]  🍃
                        ├── x, y: int (coordinates)  🍃
┌─────────────────────┐ ├── w, h: int (dimensions)  🍃
│ 🌐 GeoJSON standard │ ├── classification: str  🍃
│ 🍃 NaLamKI extension│ ├── accuracy: float  🍃
└─────────────────────┘ └── color: str  🍃
```

Key relationships:
- One `GeoOutputData` can contain multiple `GeoFeature`s
- Each `GeoFeature` has one `geometry` and one `properties`
- `properties` can contain multiple `Timeseries` datasets
- Each `Timeseries` can contain multiple `TimeSeriesItem`s
- `TimeSeriesItem`s can have multiple `DataValue`s and `DataImage`s
- `DataImage`s can have multiple `BoundingBox`es

Note: The GeoJSON structure (🌐) forms the foundation of the data format, while NaLamKI extensions (🍃) add agricultural-specific functionality.

### GeoOutputData

The root dataclass for all service outputs.

```python
from nalamkisdk.model.output_data import GeoOutputData

output = GeoOutputData(
    type="FeatureCollection",
    features=[feature1, feature2, ...]
)
```

- `type`: Always "FeatureCollection"
- `features`: List of GeoFeature objects

### GeoFeature

Represents a single feature in the GeoJSON output.

```python
from nalamkisdk.model.output_data import GeoFeature

feature = GeoFeature(
    type="Feature",
    geometry=geometry_object,
    properties=properties_object
)
```

- `type`: Always "Feature"
- `geometry`: A geometry object (GeoPoint, GeoPolygon, etc.)
- `properties`: A GeoFeatureProperty object

### GeoGeometry and GeoPoint

Represent the spatial information of a feature.

```python
from nalamkisdk.model.output_data import GeoGeometry, GeoPoint

# Using GeoGeometry
geometry = GeoGeometry(
    type="Point",
    coordinates=GeoCoordinates(latitude=lat, longitude=lon).tojson()
)

# Using GeoPoint (simplified version)
geometry = GeoPoint(
    coordinates=GeoCoordinates(latitude=lat, longitude=longitude).tojson()
)
```

- `type`: The geometry type (e.g., "Point", "Polygon")
- `coordinates`: The spatial coordinates in JSON format

### GeoCoordinates

Represents geographic coordinates in WGS84 format (standard GPS coordinates).

```python
from nalamkisdk.model.output_data import GeoCoordinates

coordinates = GeoCoordinates(latitude=52.606383808027587, longitude=13.82027178604052)
```

- `latitude`: The latitude coordinate in WGS84 format
- `longitude`: The longitude coordinate in WGS84 format
- `tojson()`: Method to convert to GeoJSON format `[longitude, latitude]` array

### GeoFeatureProperty

Contains the properties of a feature.

```python
from nalamkisdk.model.output_data import GeoFeatureProperty

properties = GeoFeatureProperty(
    type="BAUM",  # Determines visualization type
    datasets=[dataset1, dataset2, ...]
)
```

- `type`: Determines how the feature is visualized in the dashboard
- `datasets`: List of Timeseries objects

### Timeseries

Represents time series data.

```python
from nalamkisdk.model.output_data import Timeseries

dataset = Timeseries(
    type="BILDAUSWERTUNG",  # Optional type
    name="water_table_depth",  # Dataset name
    items=[item1, item2, ...]  # List of TimeSeriesItem objects
)
```

- `type`: Optional type identifier
- `name`: Name of the dataset
- `items`: List of TimeSeriesItem objects

### TimeSeriesItem

Represents a single item in a time series.

```python
from nalamkisdk.model.output_data import TimeSeriesItem

item = TimeSeriesItem(
    timestamp=datetime.now(),
    values=[value1, value2, ...],  # Optional list of DataValue objects
    images=[image1, image2, ...]   # Optional list of DataImage objects
)
```

- `timestamp`: When the data was collected
- `values`: Optional list of DataValue objects
- `images`: Optional list of DataImage objects

### DataValue

Represents a single data value with metadata.

```python
from nalamkisdk.model.output_data import DataValue

value = DataValue(
    name="Bodentemperatur LSE",
    value=23.5,
    type="temp_soil_lse",
    unit="°C"
)
```

- `name`: Human-readable name
- `value`: The actual data value
- `type`: Type identifier
- `unit`: Unit of measurement

### DataImage

Represents an image with optional bounding boxes.

```python
from nalamkisdk.model.output_data import DataImage

image = DataImage(
    uri="image.jpg",
    bbox=[bbox1, bbox2, ...]  # Optional list of BoundingBox objects
)
```

- `uri`: Reference to the image file
- `bbox`: Optional list of BoundingBox objects

### BoundingBox

Represents a bounding box for object detection.

```python
from nalamkisdk.model.output_data import BoundingBox

bbox = BoundingBox(
    x=100,
    y=200,
    w=50,
    h=50,
    classification="apple",
    accuracy=0.95,
    color="red"
)
```

- `x`, `y`: Coordinates of the top-left corner
- `w`, `h`: Width and height
- `classification`: What the object is classified as
- `accuracy`: Confidence score
- `color`: Color for visualization

## Visualization Mapping

The `type` field in the `GeoFeatureProperty` determines how the feature is visualized in the dashboard. Common types include:

1. **BAUM** (Tree): For tree-related data, often with bounding boxes
2. **Ampfer** (Sorrel): For weed detection with bounding boxes
3. **BODENFEUCHTE** (Soil Moisture): For soil moisture data with time series
4. **Reihenkultur** (Row Culture): For row crop data with bounding boxes
5. **Heatmap**: For spatial data like peatland monitoring
6. **Pegelsensor** (Water Level Sensor): For water level data with time series

## Example Implementations

### 1. Sorrel Detector

```python
# Create bounding boxes for detected sorrel
boxes_list = []
for box, cls, conf in zip(bbox, clss, confs):
    boxes_list.append(BoundingBox(
        x=box[0], y=box[1], w=box[2], h=box[3],
        classification=names[int(cls)], 
        accuracy=conf, 
        color="red"
    ))

# Create image with bounding boxes
images = [DataImage(uri=image_name, bbox=boxes_list)]

# Create time series item
item = TimeSeriesItem(timestamp=data["timestamp"], images=images)

# Create feature
feature = GeoFeature(
    type="Feature", 
    geometry=GeoGeometry(
        type="Point", 
        coordinates=GeoCoordinates(
            latitude=coords[0], 
            longitude=coords[1]
        ).tojson()
    ), 
    properties=GeoFeatureProperty(
        type="Ampfer", 
        datasets=[
            Timeseries(
                type="AmpferBBox", 
                name="boundingBox",
                items=[item]
            )
        ]
    )
)
```

### 2. Apple Detection Service

```python
# Create bounding boxes for detected apples
boxes = []
for box in result['boxes']:
    b = box['xywh']
    boxes.append(BoundingBox(
        x=b[0], y=b[1], w=b[2], h=b[3], 
        color="red", 
        label=box["name"],
        classification=box["name"], 
        accuracy=box["conf"]
    ))

# Create image with bounding boxes
images.append(DataImage(uri=os.path.basename(result['image']), bbox=boxes))

# Create time series item with apple count
item = TimeSeriesItem(
    timestamp=timestamp,
    values=[
        DataValue(
            name='Fruchtanzahl', 
            value=int(num_apples), 
            type="Fruchtanzahl", 
            unit="Stk."
        )
    ],
    images=images
)

# Create feature
new_feature = GeoFeature(   
    type="Feature",
    geometry=GeoPoint(
        coordinates=GeoCoordinates(latitude=latitude, longitude=longitude).tojson()
    ),
    properties=GeoFeatureProperty(
        type="BAUM", 
        datasets=[
            Timeseries(
                name="BILDAUSWERTUNG", 
                items=[item]
            )
        ]
    )
)
```

### 3. Ground Moisture Prediction Service

```python
# Create time series items with sensor values
items.append(TimeSeriesItem(
    timestamp=datetime.strptime(property["timestamp"], date_format), 
    values=[
        DataValue(type="temp_soil_lse", name="Bodentemperatur LSE", value=property["temp_soil_lse"]["value"], unit=property["temp_soil_lse"]["unit"]),
        DataValue(type="temp_soil_lsp", name="Bodentemperatur LSP", value=property["temp_soil_lsp"]["value"], unit=property["temp_soil_lsp"]["unit"]),
        DataValue(type="water_soil", name="Bodenfeuchte", value=property["water_soil"]["value"], unit=property["water_soil"]["unit"]),
        DataValue(type="conduct_soil", name="Leitfähigkeit des Bodens", value=property["conduct_soil"]["value"], unit=property["conduct_soil"]["unit"]),
        DataValue(type="ph_soil", name="PH Wert des Bodens", value=property["ph_soil"]["value"], unit=property["ph_soil"]["unit"]),
        DataValue(type="bat", name="Batteriestand", value=property["bat"]["value"], unit=property["bat"]["unit"]),
        DataValue(type="irrigation_neccessary", name="Notwendigkeit der Bewässerung", value="no" if int(out[i])==0 else "yes")
    ]                                             
))

# Create feature
feature = GeoFeature(
    type="Feature", 
    geometry=GeoPoint(
        coordinates=GeoCoordinates(
            latitude=json_data["geometry"]["coordinates"][1], 
            longitude=json_data["geometry"]["coordinates"][0]
        ).tojson()
    ), 
    properties=GeoFeatureProperty(
        type="BODENFEUCHTE", 
        datasets=[
            Timeseries(
                type="TIMESERIES", 
                name="AlleDaten",
                items=items
            )
        ]
    )
)
```

## Dashboard Integration

When a feature is displayed on the map in the NaLamKI dashboard, clicking on it will show the associated data according to the configuration in `config/dashboard_blueprint.json` (or `config/dashboard_template.json`). The `type` field in the `GeoFeatureProperty` determines which visualization component is used.

For example:
- Features with `type="BAUM"` might show a tree visualization with bounding boxes
- Features with `type="BODENFEUCHTE"` might show a time series chart of soil moisture
- Features with `type="Heatmap"` might show a heatmap overlay

## Best Practices

1. **Choose Appropriate Types**
   - Use the correct `type` in `GeoFeatureProperty` to ensure proper visualization
   - Follow the established naming conventions for consistency

2. **Include Metadata**
   - Always include units for numerical values
   - Provide meaningful names for all data points
   - Include confidence scores for classifications

3. **Structure Time Series Data**
   - Use consistent timestamps
   - Group related data points in the same `TimeSeriesItem`
   - Use appropriate time intervals

4. **Handle Images and Bounding Boxes**
   - Ensure image URIs are correct
   - Normalize bounding box coordinates
   - Use appropriate colors for different classes

5. **Optimize for Performance**
   - Limit the number of features when possible
   - Use appropriate data types
   - Consider data aggregation for large datasets

## Resources

- [GeoJSON Specification](https://tools.ietf.org/html/rfc7946)
- [NaLamKI SDK Documentation](../architecture/sdk/overview.md)
- [Building with StarterKit](./building-with-starterkit.md)
- [Farmers Workflow](../user-perspective/farmers_workflow.md) 