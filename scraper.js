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

function errorFile(err) {
	let time = new Date(),
		errorMsg = "";

	if(err === 404) {
		errorMsg = `[${time}] ${err}: Cannot connect to http://shirts4mike.com\n`;
		console.error(`There's been a a ${err} error. Cannot connect to http://shirts4mike.com`)
	} else {
		errorMsg = `[${time}] ${err}: Sorry! Something went wrong!\n`;
		console.error(`There's been a a ${err} error.`);
	}
	fs.appendFile('scraper-error.log', `${errorMsg}`, (err) => {
		if(err) throw err;

	});
}

// Access the website  http://shirts4mike.com ( http://shirts4mike.com/shirts.php)
const scrapeUrls = new crawler({
	callback : function(err, res, done) {
		if(res.statusCode != 200) {
			errorFile(res.statusCode);
		} else if(res.statusCode === 200){
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

	scrapeUrls.queue('http://shirts4me.com/shirts.php');


//Scrape shirt data
function scrapeShirts(url) {
	const c = new crawler({
		callback: function(err, res, done) {
			if(err) {
				console.error(res.statusCode);
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
	} catch (err) {
		console.error(res.statusCode);
	}
	
}