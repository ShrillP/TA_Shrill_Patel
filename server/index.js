// creating and initializing server
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const fs = require('fs');
const csv = require('csv-parser');

// creating and initializing database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the database!');
});
createDB();
insertData();

// API routes to get various types of lumber futures data
app.get("/data", (req, res) => {
    let type = req.query.type;
    getData(db, type).then((data) => {
        res.json({ allData: data});
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

function createDB() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS lumberData (Date TEXT, Open REAL, High REAL, Low REAL, Close REAL, AdjClose REAL, Volume INTEGER)`, (err) => {
            if (err) {
                throw err;
            }
        });
    });
}

function insertData() {
    db.run(`DELETE FROM lumberData`, (err) => {
        if (err) {
            throw err;
        }
    });
    fs.createReadStream('./LumberFuturesData.csv').pipe(csv()).on('data', (row) => {
        db.serialize(() => {
            db.run(
                `INSERT INTO lumberData (Date, Open, High, Low, Close, AdjClose, Volume) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [row.Date, parseFloat(String(row["Open"]).replace(/,/g, '')), parseFloat(String(row["High"]).replace(/,/g, '')), 
                parseFloat(String(row["Low"]).replace(/,/g, '')), parseFloat(String(row["Close*"]).replace(/,/g, '')), 
                parseFloat(String(row["Adj Close**"]).replace(/,/g, '')), Number(String(row.Volume))], 
                function(err) {
                    if (err) {
                        throw err;
                    }
            });
        });
    }).on('end', () => {
        console.log('CSV file successfully processed!');
    });
}

function getData(db, type) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT Date, ${type} FROM lumberData WHERE ${type} IS NOT NULL`, (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows === undefined) {
                reject("No data found");
            }
            var openData = [];
            rows.forEach((row) => {
                openData.push(new FutureData(row.Date, row[type]));
            });
            resolve(openData);
        });
    });
}

// to structure query data 
class FutureData {
    constructor (date, value) {
        this.date = date;
        this.value = value;
    }
}