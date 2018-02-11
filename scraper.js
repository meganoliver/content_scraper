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

//Error Function

function errorFile(error) {
	let time = new Date(),
		errorMsg = "";

	if(error.code === "ENOTFOUND") {
		errorMsg = `[${time}] ${error.code}: Cannot connect to http://shirts4mike.com\n`;
		console.error = `[${time}] ${error.code}: Cannot connect to http://shirts4mike.com`;
	} else {
		errorMsg = `[${time}] ${error.code}: Sorry! Something went wrong!\n`;
		console.error = `[${time}] ${error.code}: Sorry! Something went wrong!`;
	}
	fs.appendFile('scraper-error.log', 'errMsg');
}

// Access the website  http://shirts4mike.com ( http://shirts4mike.com/shirts.php)
const scrapeUrls = new crawler({
	callback : function(error, res, done) {
		if(error) {
			errorFile(error);
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

try{
	scrapeUrls.queue('http://shirts4mike.com/shirts.php');
} catch (error) {
	errorFile(error);
}

//Scrape shirt data
function scrapeShirts(url) {
	const c = new crawler({
		callback: function(error, res, done) {
			if(error) {
				errorFile(error);
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
				
				done();
			} 
		}
	});

	try {
		c.queue(url);
	} catch (error) {
		errorFile(error);
	}
	
}