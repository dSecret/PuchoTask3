// var config = require('./config')

var AWS = require('aws-sdk');

// var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');
// var klawSync = require('klaw-sync')
// var paths = klawSync('./uploads/faces', { nodir: true, ignore: [ "*.json" ] });

var config={
	collectionName:'',
	region:'us-east-1'
}

AWS.config.region = config.region;
var rekognition = new AWS.Rekognition({region: config.region});


exports.DetectLabelsTest=(imagePath)=>{
	var bitmap = fs.readFileSync(imagePath);

	var params = {
		Image: { 
			Bytes: bitmap
		},
		MaxLabels: 10,
		MinConfidence: 50.0
	};
	return new Promise((res,rej)=>{
		rekognition.detectLabels(params, function(err, data) {
			if (err) {
				rej(err); // an error occurred
			} else {
				res(data);           // successful response
			}
		});
	})

}
// // create collection
// exports.createCollection=(label)=>{
// 	config.collectionName=label
// 	// Index a dir of faces
// 	return new Promise((res,rej)=>{
// 		rekognition.createCollection( { "CollectionId": config.collectionName }, function(err, data) {
// 		  if (err) {
// 			rej(err); // an error occurred
// 		  } else {
// 			res(data);           // successful response
// 		  }
// 		});		
// 	})

// }
// // Reads from a sub folder named 'faces'
// exports.indexFaces=()=> {
// 	return new Promise((res,rej)=>{
// 		paths.forEach((file) => {
// 			// console.log(file.path);
// 			var p = path.parse(file.path);
// 			var name = p.name.replace(/\W/g, '');
// 			var bitmap = fs.readFileSync(file.path);

// 			rekognition.indexFaces({
// 			   "CollectionId": config.collectionName,
// 			   "DetectionAttributes": [ "ALL" ],
// 			   "ExternalImageId": name,
// 			   "Image": { 
// 				  "Bytes": bitmap
// 			   }
// 			}, function(err, data) {
// 				if (err) {
// 					rej(err) // an error occurred
// 				} else {
// 					// console.log(data);
// 					res(data)           // successful response
// 					fs.writeJson(file.path + ".json", data, err => {
// 						// if (err) return console.error(err)
// 					});
// 				}
// 			});
// 		});	
// 	})
	
// }

// exports.checkMatch=(file)=>{
// 	var bitmap = fs.readFileSync(file.path);

// 	return new Promise((res,rej)=>{
// 		rekognition.searchFacesByImage({
// 		 	"CollectionId": config.collectionName,
// 		 	"FaceMatchThreshold": 70,
// 		 	"Image": { 
// 		 		"Bytes": bitmap,
// 		 	},
// 		 	"MaxFaces": 1
// 		}, function(err, data) {
// 		 	if (err) {
// 		 		rej(err);
// 		 	} else {
// 				if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
// 				{
// 					res(data.FaceMatches[0].Face);	
// 				} else {
// 					res("Not recognized");
// 				}
// 			}
// 		});		
// 	})

// }