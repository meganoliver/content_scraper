//Dependencies:

const 	crawler = require('crawler');
		fs = require('fs'),
		csv = require('json2csv');

 // Global variables
const 	shirtData = [];

// Access the website  http://shirts4mike.com ( http://shirts4mike.com/shirts.php)
const scrapeUrls = new crawler({
	callback : function(error, res, done) {
		if(error) {
			console.log(res.statusCode);
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
					title: $('.shirt-details h1').text(),
					price: $('.price').text(),
					image: $('img').attr('src'),
					url: url,
					time: new Date().toJSON()
				};
				shirtData.push(shirtInfo);
				
			}
			console.log(shirtData);
			done();
		}

	});
	c.queue(url);
}


	
	// Extract the data

// Visit each shirt's site and scrape remaining info.




//5. Add prices to CSV

	//Create a CSB