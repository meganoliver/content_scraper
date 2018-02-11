//Dependencies:

const 	crawler = require('crawler');
		fs = require('fs'),
		json2Csv = require('json2csv');

 // Global variables
const 	shirtData = [],
		directory = './data';

// Check for data folder
try {
	fs.statSync(directory);
} catch(e) {
	fs.mkdirSync(directory);
}


// Access the website  http://shirts4mike.com ( http://shirts4mike.com/shirts.php)
const scrapeUrls = new crawler({
	callback : function(error, res, done) {
		if(error) {
			console.error(`I'm sorry, there's been a ${res.statusCode} error. Cannot connect to http://shirts$mike.com`);
		} else {
			let $ = res.$;
		//Grab each shirts url
			let products = $('.products li a');
			products.each(function() {
				let url = 'http://shirts4mike.com/' + $(this).attr("href");
			//Visit each shirt's page and grab the needed data
				scrapeShirts(url);
			})	 
		}
		done();
	}
});

scrapeUrls.queue('http://shirts4mike.com/shirts.php');

//Scrape shirt data
function scrapeShirts(url) {
	const c = new crawler({
		callback: function(error, res, done) {
			if(error) {
				console.log(res.statusCode);
			} else {
				let $ = res.$;
				let shirtInfo = {};
				shirtInfo = {
					Title: $('.shirt-details h1').text(),
					Price: $('.price').text(),
					ImageUrl: $('img').attr('src'),
					URL: url,
					Time: new Date().toJSON()
				};
			shirtData.push(shirtInfo);

			//Recored the date for file name
			let date = new Date();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let year = date.getFullYear();
			let filePath = `${directory}/${year}-${month}-${day}.csv`;

			//Create the csv
			let fields = ['Title', 'Price', 'ImageUrl', 'URL', 'Time'];
			let csv = json2Csv({data: shirtData, fields: fields});

			//Write csv to file
			fs.writeFileSync(filePath, csv);
			}
			done();
		}

	});

		c.queue(url);
	
}