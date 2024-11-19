// Gestion de la navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = link.getAttribute('data-target');

        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// Gestion de l'affichage des bâtiments
const buildingLinks = document.querySelectorAll('.building-link');
const buildings = document.querySelectorAll('.building');

buildingLinks.forEach(link => {
    link.addEventListener('click', () => {
        const buildingNumber = link.getAttribute('data-building');

        // Masquer tous les bâtiments
        buildings.forEach(building => building.classList.remove('active'));

        // Afficher le bâtiment sélectionné
        const selectedBuilding = document.getElementById(`building-${buildingNumber}`);
        if (selectedBuilding) {
            selectedBuilding.classList.add('active');
        }
    });
});

function toggleRooms(levelId, imageId) {
    // Obtenez les éléments de pièces et d'image par leurs identifiants
    const rooms = document.getElementById(levelId);
    const image = document.getElementById(imageId);

    // Alternez l'affichage entre "block" et "none" pour les deux éléments
    const isVisible = rooms.style.display === "block";
    rooms.style.display = isVisible ? "none" : "block";
    image.style.display = isVisible ? "none" : "block";
}



// Initialisation de la carte CesiumJS
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain(),
    imageryProvider: new Cesium.IonImageryProvider({ assetId: 3 }),
    baseLayerPicker: false
});

// Fonction pour ajouter un bâtiment 3D simulé avec des boîtes
function addBuildingSimulation() {
    var buildingCenter = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 0);

    for (let i = 0; i < 15; i++) {
        const offset = i * 30;
        viewer.entities.add({
            name: 'Pièce ' + (i + 1),
            position: Cesium.Cartesian3.fromDegrees(-75.59777 + (i % 5) * 0.0001, 40.03883 + Math.floor(i / 5) * 0.0001, 10),
            box: {
                dimensions: new Cesium.Cartesian3(20.0, 20.0, 15.0),
                material: Cesium.Color.fromRandom({ alpha: 0.7 }),
                outline: true,
                outlineColor: Cesium.Color.BLACK
            }
        });
    }
}

// Ajouter le bâtiment simulé
addBuildingSimulation();

// Carrousel
document.addEventListener("DOMContentLoaded", function() {
    const carouselImages = document.querySelectorAll('.carousel img');
    let currentIndex = 0;

    function showNextImage() {
        // Masquer l'image actuelle
        carouselImages[currentIndex].classList.remove('active');

        // Passer à l'image suivante
        currentIndex = (currentIndex + 1) % carouselImages.length;

        // Afficher la nouvelle image
        carouselImages[currentIndex].classList.add('active');
    }

    // Démarrage du défilement automatique toutes les 4 secondes
    setInterval(showNextImage, 4000);
});

// Développer l'API de réception sur le serveur
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/sensor-data', (req, res) => {
    console.log(req.body); // Afficher les données des capteurs envoyées par l'Arduino
    // Stocker les données ou les traiter selon les besoins
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Fonction pour obtenir les données de l'Arduino et mettre à jour la pièce 101
function fetchSensorData() {
    const url = "http://votre-adresse-ip:3000/sensor-data"; // Mettez à jour avec l'IP de votre serveur

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Mettre à jour les éléments de la pièce 101
            document.querySelector('#room-101 .temperature').textContent = `${data.temperature}°C`;
            document.querySelector('#room-101 .humidity').textContent = `${data.humidity}%`;
            document.querySelector('#room-101 .co2').textContent = `${data.co2} ppm`;
            document.querySelector('#room-101 .dust').textContent = `${data.dust} µg/m³`;

            // Mettre à jour le style de la pièce en fonction de la température
            const roomElement = document.getElementById('room-101');
            if (data.temperature > 30) {
                roomElement.style.backgroundColor = '#ff6961'; // Rouge pâle pour indiquer une température élevée
            } else {
                roomElement.style.backgroundColor = '#77dd77'; // Vert pâle pour indiquer une température normale
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données du serveur:", error);
        });
}

// Appeler la fonction toutes les 5 secondes pour mettre à jour les données
setInterval(fetchSensorData, 5000);
fetchSensorData(); // Appel initial


