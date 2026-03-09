var map;

require([
  "esri/config",
  "esri/map",
  "esri/dijit/BasemapGallery",
  "dojo/parser",
  "dojo/dom",
  "dojo/on",
  "esri/geometry/Point",
  "esri/SpatialReference",
  "esri/geometry/webMercatorUtils",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  "esri/graphic",
  "esri/layers/KMLLayer",
  "esri/layers/GraphicsLayer",
  "esri/toolbars/draw",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/TitlePane",
  "dojo/domReady!"
], function (
  esriConfig,
  Map,
  BasemapGallery,
  parser,
  dom,
  on,
  Point,
  SpatialReference,
  webMercatorUtils,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  Color,
  Graphic,
  KMLLayer,
  GraphicsLayer,
  Draw
) {
  parser.parse();

  map = new Map("map", {
    basemap: "topo",
    center: [-105.255, 40.022],
    zoom: 13
  });

  var basemapGallery = new BasemapGallery({
    showArcGISBasemaps: true,
    map: map
  }, "basemapGallery");

  basemapGallery.startup();

      // ===== Lat/Lon Search =====
      var input   = dom.byId("latlon-input");
      var goBtn   = dom.byId("latlon-go");
      var errNode = dom.byId("latlon-error");
      input.placeholder = "lat, long  e.g. 32.221139, -110.965578" 

;

      var searchSymbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE, 12,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,255,0.95]), 2),
        new Color([255,0,0,0.85])
      );

      function showError(msg){ errNode.textContent = msg || ""; }
      function parseLatLon(text){
        if (!text) return null;
        var cleaned = text.replace(/[^\d\-\.,\s]/g, " ").trim();
        var m = cleaned.match(/(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)/);
        if (!m) return null;
        var a=parseFloat(m[1]), b=parseFloat(m[2]);
        if (isNaN(a)||isNaN(b)) return null;
        var lat=a, lon=b, ok=(Math.abs(lat)<=90 && Math.abs(lon)<=180);
        if (!ok && Math.abs(a)<=180 && Math.abs(b)<=90){ lon=a; lat=b; ok=true; }
        return ok ? {lat:lat, lon:lon} : null;
      }
      function goToLatLon(text){
        showError("");
        var p = parseLatLon(text);
        if (!p){ showError("Please enter like: 32.221139, -110.965578"); return; }
        var geoPt = new Point(p.lon, p.lat, new SpatialReference({wkid:4326}));
        var wmPt  = webMercatorUtils.geographicToWebMercator(geoPt);
        map.graphics.clear();
        map.graphics.add(new Graphic(wmPt, searchSymbol));
        map.centerAndZoom(wmPt, 16);
      }
      on(goBtn, "click", function(){ goToLatLon(input.value); });
      on(input, "keydown", function(evt){
        if (evt.key === "Enter" || evt.keyCode === 13) goToLatLon(input.value);
      });

      // ===== KMZ support (load your CAD polylines as KMZ here if needed) =====
      function addKMZ(url){
        var layer = new KMLLayer(url, { outSR: map.spatialReference });
        layer.on("load", function(){ if (layer.fullExtent) map.setExtent(layer.fullExtent.expand(1.15)); });
        map.addLayer(layer);
      }
      

      // ===== Markups (points & lines that persist while browsing) =====
      var markups = new GraphicsLayer({ id: "markups" });
      map.addLayer(markups);

      var draw = new Draw(map);
      draw.on("draw-end", function(evt){
        map.enableMapNavigation();
        draw.deactivate();

        if (evt.geometry.type === "point") {
          var pinSym = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,255,1]), 2),
            new Color([46,125,255,0.95]) // blue fill
          );
          markups.add(new Graphic(evt.geometry, pinSym));
        } else if (evt.geometry.type === "polyline") {
          var lineSym = new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([0,255,0,1]), // green line
            3
          );
          markups.add(new Graphic(evt.geometry, lineSym));
        }
      });

      // UI hooks
      var pinBtn   = dom.byId("mk-pin");
      var lineBtn  = dom.byId("mk-line");
      var clearBtn = dom.byId("mk-clear");

      function setActive(btn){
        [pinBtn,lineBtn].forEach(function(b){ b.classList.remove("btn-on"); });
        if (btn) btn.classList.add("btn-on");
      }

      on(pinBtn, "click", function(){
        setActive(pinBtn);
        map.disableMapNavigation();
        draw.activate(Draw.POINT);
      });

      on(lineBtn, "click", function(){
        setActive(lineBtn);
        map.disableMapNavigation();
        draw.activate(Draw.POLYLINE); // double-click to finish
      });

      on(clearBtn, "click", function(){
        setActive(null);
        draw.deactivate();
        map.enableMapNavigation();
        markups.clear(); // clears only your markups
      });

      // ESC cancels drawing
      on(document, "keydown", function(evt){
        if (evt.key === "Escape" || evt.keyCode === 27){
          setActive(null);
          draw.deactivate();
          map.enableMapNavigation();
        }
      });
    });