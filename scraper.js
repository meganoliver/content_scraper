//Dependencies:

const request = require("tinyreq"),
 cheerio = require("cheerio"),
 req = require("tinyreq"),
 scrapeIt = require("scrape-it");

 // Global variables
 let shirtUrls =[];

// Access the website  http://shirts4mike.com ( http://shirts4mike.com/shirts.php)
scrapeIt('http://shirts4mike.com/shirts.php', {
// Extract the data
	shirts: {
		listItem: '.products li',
		data: {
			URL: {
				selector: 'a',
				attr: 'href'
			}
		}
	}
}).then(({ data, response }) => {
	console.log(data.shirts);
	shirtUrls = (data.shirts);
});





//5. Add prices to CSV

	//Create a CSB