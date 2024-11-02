// const express = require('express');
// const router = express.Router();

// // Static Routes
// // Set up "public" folder / subfolders for static files
// router.use(express.static("public"));
// router.use("/css", express.static(__dirname + "public/css"));
// router.use("/js", express.static(__dirname + "public/js"));
// router.use("/images", express.static(__dirname + "public/images"));

// module.exports = router;


const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); // Import path module

// Function to read the inventory data
function getInventoryData() {
    const filePath = path.join(__dirname, '../database/inventory-data.txt'); // Adjust path accordingly
    let data;

    try {
        data = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading the inventory file: ${error.message}`);
        return []; // Return an empty array if there is an error
    }

    const cars = [];
    const regex = /INSERT INTO public.inventory.*?\);/gs;
    const matches = data.match(regex);
    
    if (matches) {
        matches.forEach(match => {
            const entries = match.slice(match.indexOf('VALUES (') + 8, -2).split('), (');
            entries.forEach(entry => {
                const values = entry.split(',').map(v => v.trim().replace(/'/g, ''));
                cars.push({
                    inv_make: values[0],
                    inv_model: values[1],
                    inv_year: values[2],
                    inv_description: values[3],
                    inv_image: values[4],
                    inv_thumbnail: values[5],
                    inv_price: values[6],
                    inv_miles: values[7],
                    inv_color: values[8],
                    classification_id: values[9],
                });
            });
        });
    }
    console.log("Loaded cars:", cars); // Log loaded cars for debugging

    return cars;
}

// Static Routes
router.use(express.static("public"));
router.use("/css", express.static(path.join(__dirname, '../public/css')));
router.use("/js", express.static(path.join(__dirname, '../public/js')));
router.use("/images", express.static(path.join(__dirname, '../public/images')));

// Filter routes
router.get('/custom', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === '1');
    res.render('index', { title: 'Custom Cars', cars: filteredCars.length ? filteredCars : [] });
});

router.get('/sedan', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === '2');
    res.render('index', { title: 'Sedan Cars', cars: filteredCars.length ? filteredCars : [] });
});

router.get('/sport', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === '3');
    res.render('index', { title: 'Sport Cars', cars: filteredCars.length ? filteredCars : [] });
});

router.get('/suv', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === '4');
    res.render('index', { title: 'SUV Cars', cars: filteredCars.length ? filteredCars : [] });
});

router.get('/truck', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === '5');
    res.render('index', { title: 'Truck Cars', cars: filteredCars.length ? filteredCars : [] });
});

module.exports = router;
