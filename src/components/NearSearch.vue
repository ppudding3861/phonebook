<template>
    <div id="step01" class="container">
        <div class="header">
            <div class="header-top">
                <button class="left-button icon-circle" @click="locateUser">
                    <i class="fas fa-crosshairs"></i>
                </button>
                <h1>주변 검색</h1>
                <button class="right-button icon-circle" @click="toggleButtons">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input
                    type="text"
                    class="search-bar"
                    placeholder="검색"
                    @keypress="searchByKeyword"/>
            </div>
        </div>
        <div class="map-container">
            <div id="map"></div>
            <div class="top-buttons">
                <button class="undo-button icon-circle" @click="clearMarkers">
                    <i class="fas fa-undo"></i>
                </button>
                <button class="menu-button icon-circle" @click="toggleButtons">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
                <div class="additional-buttons">
                    <button class="hospital-button icon-circle" @click="searchPlaces('병원')">
                        <i class="fas fa-hospital"></i>
                    </button>
                    <button class="food-button icon-circle" @click="searchPlaces('맛집')">
                        <i class="fas fa-utensils"></i>
                    </button>
                    <button class="store-button icon-circle" @click="searchPlaces('편의점')">
                        <i class="fas fa-store"></i>
                    </button>
                    <button class="parking-button icon-circle" @click="searchPlaces('주차장')">
                        <i class="fas fa-parking"></i>
                    </button>
                </div>
            </div>
            <div class="footer-buttons">
                <button class="icon-circle" @click="locateUser">
                    <i class="fas fa-crosshairs"></i>
                </button>
                <button class="icon-circle" @click="clearMarkers">
                    <i class="fas fa-heart-circle-plus"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup="setup">
    import {ref, onMounted} from 'vue';

    const map = ref(null);
    const markers = ref([]);
    const latitude = ref(0);
    const longitude = ref(0);
    let userMarker = null;
    const userMarkerImage = ref(null);
    const infowindow = ref(null);

    const toggleButtons = () => {
        document
            .querySelector('.top-buttons')
            .classList
            .toggle('show-buttons');
    };

    const initMap = () => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao
                .maps
                .LatLng(33.450701, 126.570667),
            level: 5
        };
        map.value = new kakao
            .maps
            .Map(container, options);
        displayMarker([
            [latitude.value, longitude.value]
        ]);
    };

    const displayMarker = (markerPositions) => {
        if (markers.value.length > 0) {
            markers
                .value
                .forEach((marker) => marker.setMap(null));
        }

        const positions = markerPositions.map(
            (position) => new kakao.maps.LatLng(...position)
        );

        if (positions.length > 0) {
            markers.value = positions.map(
                (position) => new kakao.maps.Marker({map: map.value, position})
            );

            const bounds = positions.reduce(
                (bounds, latlng) => bounds.extend(latlng),
                new kakao.maps.LatLngBounds()
            );

            map
                .value
                .setBounds(bounds);
        }
    };

    const loadKakaoMap = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.onload = () => {
                kakao
                    .maps
                    .load(() => {
                        userMarkerImage.value = new kakao
                            .maps
                            .MarkerImage(
                                'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                                new kakao.maps.Size(50, 50),
                                {
                                    offset: new kakao
                                        .maps
                                        .Point(25, 50)
                                }
                            );
                        infowindow.value = new kakao
                            .maps
                            .InfoWindow({zIndex: 1});
                        resolve();
                    });
            };
            script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=b2a0131f4a53bec9033cfe18' +
                    'aad009d5';
            document
                .head
                .appendChild(script);
        });
    };

    onMounted(async () => {
        if (!('geolocation' in navigator)) {
            alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
            return;
        }

        await loadKakaoMap();

        navigator
            .geolocation
            .getCurrentPosition((pos) => {
                latitude.value = pos.coords.latitude;
                longitude.value = pos.coords.longitude;
                initMap();
            }, (err) => {
                alert(err.message);
            });
    });

    const locateUser = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator
                    .geolocation
                    .getCurrentPosition((position) => {
                        const {latitude: lat, longitude: lon} = position.coords;
                        const userLocation = new kakao
                            .maps
                            .LatLng(lat, lon);

                        if (userMarker) {
                            userMarker.setMap(null);
                        }

                        userMarker = new kakao
                            .maps
                            .Marker(
                                {position: userLocation, map: map.value, image: userMarkerImage.value, title: '현위치'}
                            );

                        map
                            .value
                            .setCenter(userLocation);
                        map
                            .value
                            .setLevel(3);
                        resolve(userLocation);
                    }, () => {
                        alert('위치 정보를 가져올 수 없습니다.');
                        reject(new Error('위치 정보를 가져올 수 없습니다.'));
                    });
            } else {
                alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
                reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'));
            }
        });
    };

    const searchPlaces = (keyword) => {
        locateUser().then((userLocation) => {
            const places = new kakao
                .maps
                .services
                .Places();
            places.keywordSearch(keyword, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    clearMarkers();
                    const bounds = new kakao
                        .maps
                        .LatLngBounds();
                    data.forEach((place) => {
                        const position = new kakao
                            .maps
                            .LatLng(place.y, place.x);
                        const marker = new kakao
                            .maps
                            .Marker({map: map.value, position});
                        markers
                            .value
                            .push(marker);

                        const content = `
              <div style="padding:10px; font-size:12px; border:1px solid #ccc; background-color:#fff;">
                <strong>${place.place_name}</strong><br>
                주소: ${place.road_address_name || place.address_name}<br>
                전화번호: ${place.phone || '없음'}
              </div>
            `;

                        kakao
                            .maps
                            .event
                            .addListener(marker, 'click', () => {
                                infowindow
                                    .value
                                    .setContent(content);
                                infowindow
                                    .value
                                    .open(map.value, marker);
                            });

                        bounds.extend(position);
                    });
                    map
                        .value
                        .setBounds(bounds);
                } else {
                    alert(`${keyword} 정보를 가져올 수 없습니다.`);
                }
            }, {
                location: userLocation,
                radius: 3000
            });
        });
    };

    const clearMarkers = () => {
        markers
            .value
            .forEach((marker) => marker.setMap(null));
        markers.value = [];
    };

    const searchByKeyword = (event) => {
        if (event.key === 'Enter') {
            const keyword = event.target.value;
            clearMarkers();
            searchPlaces(keyword);
        }
    };
</script>
<style scoped="scoped">

    body,
    html {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
    }

    .container {
        
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .header {
        background-color: #66c5c7;
        padding: 20px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1000;
    }

    .header-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header .left-button,
    .header .right-button {
        background: none;
        border: none;
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        /* 마우스 포인터를 손 모양으로 변경 */
    }

    .header h1 {
        font-size: 24px;
        color: #fff;
        margin: 0;
    }

    .search-container {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 10px 20px;
        position: relative;
    }

    .search-container .search-icon {
        font-size: 20px;
        color: #888;
        margin-right: 10px;
    }

    .search-bar {
        width: 100%;
        padding: 15px;
        background-color: #ccc;
        border: none;
        border-radius: 5px;
        font-size: 18px;
    }

    .map-container {
        flex-grow: 1;
        position: relative;
    }

    #map {
        height: 100%;
        width: 100%;
        z-index: 0;
    }

    .footer-buttons {
        position: absolute;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    }

    .footer-buttons button {
        background: none;
        border: none;
        font-size: 24px;
        color: #000;
        cursor: pointer;
        /* 마우스 포인터를 손 모양으로 변경 */
    }

    .top-buttons {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    }

    .top-buttons button {
        background: none;
        border: none;
        color: #000;
        font-size: 24px;
        cursor: pointer;
        /* 마우스 포인터를 손 모양으로 변경 */
    }

    .additional-buttons {
        display: none;
    }

    .show-buttons .additional-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .icon-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 4vw;
        /* 화면 너비의 4%로 설정 */
        height: 4vw;
        /* 화면 너비의 4%로 설정 */
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transition: transform 0.2s;
        /* 클릭 시 변형 애니메이션 */
    }

    .icon-circle:active {
        transform: scale(0.9);
        /* 클릭 시 크기 축소 효과 */
    }
</style>