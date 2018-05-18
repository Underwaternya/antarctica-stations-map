var markers = L.layerGroup();

$( document ).ready(function(){
	///////////////////////////
	//       init map        //
	///////////////////////////
	// The polar projection
	const EPSG3031 = new L.Proj.CRS(
		"EPSG:3031",
		"+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs", {
			origin: [-4194304, 4194304],
            resolutions: [
                8192.0,
                4096.0,
                2048.0,
                1024.0,
                512.0,
                256.0
            ],
            bounds: L.bounds(
                [-4194304, -4194304],
                [4194304, 4194304]
			)
		});

	const southWest = L.latLng(-38.94137277935882, -135);
	const northEast = L.latLng(-38.94137277935882, 45);
	const bounds = L.latLngBounds(southWest, northEast);
	
	// create the map
	myMap = new L.Map('mapid', {
		crs: EPSG3031,
	    minZoom: 0,
	    maxZoom: 4, // because nasa data has only five zoom levels
		maxBounds: bounds
	});

	// config attributes for nasa data source
	const nasaAttrib = "Data Source &copy; <a href='https://www.comnap.aq/SitePages/Home.aspx' target='_blank'>" +
		"COMNAP</a><br>Base Map &copy; <a href='https://wiki.earthdata.nasa.gov/display/GIBS' target='_blank'>" +
		"NASA EOSDIS GIBS</a>";
	const nasaUrl = 'https://gibs-{s}.earthdata.nasa.gov' +
		'/wmts/epsg3031/best/' +
		'{layer}/default/{tileMatrixSet}/{z}/{y}/{x}.{format}';
	
	// config attributes for blue marble layer
	const blueMarble = new L.tileLayer(nasaUrl, {
		attribution: nasaAttrib, 
		attributionControl: false,
	    tileSize: 512,
	    layer: "BlueMarble_ShadedRelief_Bathymetry",
	    tileMatrixSet: "500m",
	    format: "jpeg"
	});

	L.control.attribution({
		prefix: false,
		position: 'bottomleft'
	}).addTo(myMap);
	
	// config attributes for graticule layer
	const graticule = new L.tileLayer(nasaUrl, {   
	    tileSize: 512,
	    layer: "Graticule",
	    tileMatrixSet: "250m",
	    format: "png"
	});

	// config attributes for coastline layer
	const coastline = new L.tileLayer(nasaUrl, {
	    tileSize: 512,
	    layer: "Coastlines",
	    tileMatrixSet: "250m",
	    format: "png"
	});

	// add nasa blue marble and graticule data to the map
	myMap.setView(new L.LatLng(-90, 0), 0);
	myMap.addLayer(blueMarble);
	myMap.addLayer(graticule);
	myMap.addLayer(coastline);
	
	// add default point data
	showMarkers();

	///////////////////////////
	//     country filter    //
	///////////////////////////

	const allCountries = myData.map(entry => entry.operator_1);

	// remove duplicate countries
	function unique(array) {
		return [...new Set(array)]
	}

	// get the list of countries
    var uniqueCountries = unique(allCountries);

	// dropdown list of countries
	$("#search-countries").autocomplete({
		source: uniqueCountries,
		focus: function( event, ui ) {
			$( "#search-countries" ).val( ui.item.label );
			return false;
		},
		select: function( event, ui ) {
			showMarkers();
			// add reset button
			$("#clear-search").show();
		}
	});	

	///////////////////////////
	//     clear search      //
	///////////////////////////
	$('#clear-search').click(function() {
		$("#search-countries").val("");
		showMarkers();
		$("#clear-search").hide();
	});

	///////////////////////////
	//       type filter     //
	///////////////////////////
	$(".typebox").on("click", function() {
		showMarkers();
	});

	///////////////////////////
	//       type filter     //
	///////////////////////////
	$(".seasonality-box").on("click", function() {
		showMarkers();
	});

	///////////////////////////
	//      year filter      //
	///////////////////////////

	$("#year-slider").on("input", function() {
		$("#end-year").html($(this).val());
		showMarkers();
	})

	///////////////////////////
	//    apply filters      //
	///////////////////////////

	function showMarkers() {
		// get the current state of each filter
		let country = $("#search-countries").val();
		let type = $( ".typebox input:checked" ).map(function() {
				return $(this).siblings("label").text()
			}).toArray();
		let year = $("#year-slider").val();
		let seasonality = $( ".seasonality-box input:checked" ).map(function() {
			return $(this).val()
		}).toArray();

		// clear all markers
		markers.clearLayers();
		
		// apply filters
		if (country) {
			myData.forEach(item => {
				// if year established is unknown, the facility will only appear in 2015
				if (typeof(item.year_est) !== "number") {
					if (year == 2015 && item.operator_1 == country && $.inArray(item.fac_type,type) > -1 && $.inArray(item.fac_seas,seasonality) > -1) {
						addMarker(item);
					}
				} else if (item.operator_1 == country && year >= item.year_est && $.inArray(item.fac_type,type) > -1 && $.inArray(item.fac_seas,seasonality) > -1) {
					addMarker(item);
				}
			})
		} else {
			// if country is not specified
			myData.forEach(item => {
				if (typeof(item.year_est) !== "number") {
					if (year == 2015 && $.inArray(item.fac_type,type) > -1 && $.inArray(item.fac_seas,seasonality) > -1) {
						addMarker(item);
					}
				} else if (year >= item.year_est && $.inArray(item.fac_type,type) > -1 && $.inArray(item.fac_seas,seasonality) > -1) {
					addMarker(item);
				}
			});
		}
		
		// add markers to the map
		myMap.addLayer(markers);
	}

	///////////////////////////
	//       helpers         //
	///////////////////////////

	function addPopup(entry) {
		let site_img = (entry.photo_url == "N/A" || entry.photo_url == null) ? "" : '<div class="site-img"><img src="' + entry.photo_url + '" alt="' + entry.name_off + '"></div>';
		let year_est = (entry.year_est == null) ? "Unknown" : entry.year_est;
		let webcam = (entry.webcam_url == "N/A" || entry.webcam_url == null) ? "" : '<li><span>Realtime Webcam: </span><a href="' + entry.webcam_url + '" target="_blank">Click here</a></li>'

		let site_info = "<ul><li><span>"+ entry.lat_ddm.replace(/ /g,'') + "  " + entry.lon_ddm.replace(/ /g,'') +"</span></li>"+
		"<li><span>Type: </span>" + entry.fac_type + "</li>" +
		"<li><span>Operational period: </span>" + entry.fac_seas + "</li>" +
		"<li><span>Year established: </span>" + year_est + "</li>" +
		"<li><span>Primary Operator: </span>" + entry.operator_1 + "</li>" +
		webcam + "</ul>";

		let intro = "<h2>" + entry.name_off + "</h2>" + site_img + site_info;

		return intro;
	}

	function addMarker(entry) {
		// use custom icon
		let thisIcon = L.icon({
			iconUrl : 'icons/' + entry.operator_1.toLowerCase().replace(/ /g, '') + '.png',
			iconSize: [35, 41],
			iconAnchor: [17.5, 41],
			popupAnchor: [0, -5]
		})
		let marker = L.marker([entry.lat_dd,entry.lon_dd],{
			title: entry.name_off,
			icon: thisIcon
		});			
		let intro = addPopup(entry);

		marker.bindPopup(intro);

		markers.addLayer(marker);	
	}

});



