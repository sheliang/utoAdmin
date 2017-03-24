<template>
	<div id="map"></div>
</template>

<script>
	export default {
		name: "baiduMap",
		data(){
			return{}
		},
		props: {
			cityName: String,
			regionInfo: Object,
			isEdit: Boolean
		},
		methods: {
			baiduMap() {
				var _this = this;
				setTimeout(() => {
					var map = new BMap.Map("map", {
						enableMapClick: false
					});
					map.centerAndZoom(_this.cityName, 12);
					// 启用地图缩放
					map.enableScrollWheelZoom();
					// 添加城市列表
					map.addControl(new BMap.CityListControl({
						anchor: BMAP_ANCHOR_TOP_LEFT,
						offset: new BMap.Size(10, 20)
					}));
					// 地图区域编辑功能
					_this.mapAdd(map);
				}, 0);
			},
			mapAdd(map) {
				var _this = this,
					points = [],
					polygon, options = {
						strokeColor: "blue",
						strokeWeight: 2,
						strokeOpacity: 0.5
					};

				for(var i in _this.regionInfo.points) {
					points.push(new BMap.Point(_this.regionInfo.points[i].lon, _this.regionInfo.points[i].lat));
				};

				if(_this.regionInfo.points.length == 0) {
					// 根据城市名获取经纬度坐标
					var myGeo = new BMap.Geocoder();

					myGeo.getPoint(_this.cityName, function(point) {
						if(point) {
							map.centerAndZoom(point, 16);
							map.addOverlay(new BMap.Marker(point));
							// 根据城市中心点画圆
							polygon = new BMap.Polygon(add_oval(point, 0.07, 0.07), options);

							_this.$emit("message", polygon.getPath());
							_this.points(map, polygon);
						} else {
							_this.$notify({
								title: '错误',
								message: '您选择地址没有解析到结果',
								type: 'error'
							});
						}
					}, _this.cityName);
				} else {
					polygon = new BMap.Polygon(points, options);
					_this.$emit("message", polygon.getPath());
					_this.points(map, polygon);
				}
				// 根据城市中心点画圆 -- 方法
				function add_oval(centre, x, y) {
					var assemble = [],
						angle, dot, tangent = x / y;
					for(i = 0; i < 36; i++) {
						angle = (2 * Math.PI / 36) * i;
						dot = new BMap.Point(centre.lng + Math.sin(angle) * y * tangent, centre.lat + Math.cos(angle) * y);
						assemble.push(dot);
					}
					return assemble;
				}
			},
			points(map, polygon) {
				var _this = this;
				// 地图上添加多边形
				map.addOverlay(polygon);
				// 开启编辑功能
				polygon.enableEditing();

				// 添加右键功能
				var menu = new BMap.ContextMenu();
				var txtMenuItem = [{
					text: '完成',
					callback: function() {
						polygon.disableEditing();
						// _this.regionInfo.points = polygon.getPath();
						_this.$emit("message", polygon.getPath());
					}
				}, {
					text: '编辑',
					callback: function() {
						polygon.enableEditing();
					}
				}];
				for(var i = 0; i < txtMenuItem.length; i++) {
					menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 0));
				}

				map.addContextMenu(menu);
				// 区域右键功能
				polygon.addContextMenu(menu);
			}
		},
		created() {
			this.isEdit ? this.baiduMap() : "";
		},
		watch: {
			"isEdit": function(flag) {
				this.isEdit ? this.baiduMap() : "";
			},
			"cityName": function() {
				this.isEdit ? this.baiduMap() : "";
			}
		}
	}
</script>

<style>

</style>