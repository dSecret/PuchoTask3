// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Name of a bucket, e.g. my-bucket';
// const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';
exports.handleUpload=(filename)=>{
// Uploads a local file to the bucket
	// return new Promise((res)=>{
		storage
		  .bucket('pucho-task-3')
		  .upload('./uploads/7434967e0291cef626a144c7604f32f3.mp4')
		  // .then(()=>{
		  // 	res()
		  // })		
	// })
	  
}