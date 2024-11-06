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
// Function to read the inventory data
function getInventoryData() {
    const filePath = path.join(__dirname, '../database/inventory-data.txt');
    let data;

    try {
        data = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading the inventory file: ${error.message}`);
        return [];
    }

    const cars = [];
    const regex = /INSERT INTO public.inventory.*?\);/gs;
    const matches = data.match(regex);

    if (matches) {
        matches.forEach(match => {
            // Split entries by '), (' while handling multi-line fields
            const entries = match.slice(match.indexOf('VALUES (') + 8, -2).split(/\),\s+\(/);
            entries.forEach(entry => {
                // Match values, allowing for multi-line strings within single quotes
                const values = entry.match(/'([^']*(?:\n[^']*)*)'|(\d+)/g).map(v => v.replace(/'/g, '').trim());

                // Log values for debugging
                console.log("Parsed values:", values);

                if (values.length === 10) { // Ensure we have exactly 10 fields
                    cars.push({
                        inv_make: values[0],
                        inv_model: values[1],
                        inv_year: values[2],
                        inv_description: values[3],
                        inv_image: values[4],
                        inv_thumbnail: values[5],
                        inv_price: Number(values[6]),
                        inv_miles: Number(values[7]),
                        inv_color: values[8],
                        classification_id: Number(values[9]),
                    });
                } else {
                    console.warn("Unexpected number of fields:", values.length, values);
                }
            });
        });
    }

    console.log("Loaded cars:", cars);
    return cars;
}


// Static Routes
router.use(express.static("public"));
router.use("/css", express.static(path.join(__dirname, '../public/css')));
router.use("/js", express.static(path.join(__dirname, '../public/js')));
router.use("/images", express.static(path.join(__dirname, '../public/images')));

router.get('/custom', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === 1); // Compare to number, not string
    res.render('index', { title: 'Custom Cars', cars: filteredCars.length ? filteredCars : [] });
});

router.get('/sedan', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === 5);
    res.render('index', { title: 'Sedan Cars', cars: filteredCars.length ? filteredCars : [] });
});

router.get('/sport', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === 2);
    res.render('index', { title: 'Sport Cars', cars: filteredCars.length ? filteredCars : [] });
});

router.get('/suv', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === 3);
    res.render('index', { title: 'SUV Cars', cars: filteredCars.length ? filteredCars : [] });
});

router.get('/truck', (req, res) => {
    const cars = getInventoryData();
    const filteredCars = cars.filter(car => car.classification_id === 4);
    res.render('index', { title: 'Truck Cars', cars: filteredCars.length ? filteredCars : [] });
});

module.exports = router;
