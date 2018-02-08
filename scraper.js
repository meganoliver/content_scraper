//Dependencies:

const 	scrapeIt = require("scrape-it"),
		fs = require('fs'),
		csv = require('json2csv');

 // Global variables
 let shirtUrls =[];
 let url = [];
 let fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
 let shirtData = [];

// Access the website  http://shirts4mike.com ( http://shirts4mike.com/shirts.php)
scrapeIt('http://shirts4mike.com/shirts.php', {
// Extract the data
	shirts: {
		listItem: '.products li',
		data: {
			link: {
				selector: 'a',
				attr: 'href'
			},
			pic: {
				selector: 'img',
				attr: 'src'
			}
		}
	}
}).then(({ data, response }) => {
	shirtUrls = (data.shirts);
	console.log(shirtUrls);
	
});



//5. Add prices to CSV

	//Create a CSB