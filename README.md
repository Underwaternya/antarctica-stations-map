# Antarctica Stations Map
This is a map displaying all Antarctic facilities such as laboratories and stations operated by National Antarctic Programs in the Antarctic Treaty Area (South of 60° latitude South). Users can filter the facilities by primary operator country, established year, facility type, and facility seasonality.

It uses [Leaflet](http://leafletjs.com/) for the map, [jQuery](https://jquery.com/) for event handling, [jQuery UI](https://jqueryui.com/autocomplete/) for the slider, [Font Awesome](https://fontawesome.com/icons/times-circle?style=regular ) for the cross icon to clear the current search, [Proj4Leaflet](http://kartena.github.io/Proj4Leaflet/) plugin to support the special projection of south polar.

## Data Source
### Layers
* Base layer: NASA Global Imagery Browse Services (GIBS) [MODIS Blue Marble (August 2004, Shaded Relief and Bathymetry)](https://earthobservatory.nasa.gov/Features/BlueMarble/)
* Two reference layers: [Graticule and Coastlines](https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products#expand-ReferenceLayers9Layers) in NASA Global Imagery Browse Services (GIBS) 

### Facilities Data 
From Council of Managers of National Antarctic Program (COMNAP), as their data could be freely used for educational and non-commercial purpose.

There are several versions of Antarctic Facilities Data in COMNAP, each version is slightly different from others. In this project, the photo URL and webcam URL come from [this excel file](https://www.comnap.aq/Members/SiteAssets/SitePages/Home/COMNAP%20Antarctic%20Facilities%20List%2031%20March%202017.xlsx), while other facility information comes from their [GitHub version](https://github.com/PolarGeospatialCenter/comnap-antarctic-facilities). 

## Screenshot
![Screenshot of the main page](https://i.loli.net/2018/05/19/5aff3a3150eb0.png)

## Credit
Inspired by [宇宙よりも遠い場所](http://yorimoi.com/)
