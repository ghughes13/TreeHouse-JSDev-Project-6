let request = require('request');
let cheerio = require('cheerio');
let urls = [];
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1;
let yyyy = today.getFullYear();
let date = yyyy + '-' + mm + '-' + dd;

const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = createCsvWriter({
    header: ['TITLE', 'PRICE', 'IMGURL', 'URL', 'TIME'],
    path: 'data.csv'
});
let records = [];


let createPromise = new Promise(function(resolve, reject) {
        request('http://shirts4mike.com/shirts.php', function(error, response, body) {
           let $ = cheerio.load(body);
           let shirts = $('.products').children();
           resolve(shirts.each(function(index) {
             let url = (shirts.eq(index).children().eq(0).attr('href'));
             request("http://shirts4mike.com/" + url, function(error, response, html) {
               let $ = cheerio.load(html);
               let shirtImg = $('.shirt-picture').children().eq(0).children().eq(0).attr('src');
               let titleFull = $('.shirt-details').children().eq(0).text();
               let titleArray = titleFull.split(' ');
               let price = titleArray.splice(0, 1);
               price = price.join(' ');
               let title = titleArray.join(' ');
               // console.log([title, price, shirtImg, url, date]);
               records.push([title, price, shirtImg, url, date]);
             });
           }));
        });
      })


createPromise.then(function() {
  console.log(records);
  csvWriter.writeRecords(records)
  console.log(records);
});

//create a csv file (csv creation module with at least 1k dl and updated in last 6 months)
//npm install should install all our dependencies
//if shirts4mike is down, display an error message to the console (human friendly eg: 404 error: Cannot connect to shirts4mike)
//disable wifi to make sure error works
//make package.json run when npm start is run
//When an error occurs, append it to a 'scraper-error.log' file with a date and error message;
