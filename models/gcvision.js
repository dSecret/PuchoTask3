// Imports the Google Cloud Video Intelligence library + Node's fs library
const video = require('@google-cloud/video-intelligence').v1;
const fs = require('fs');

// Creates a client
const client = new video.VideoIntelligenceServiceClient();


// Human-readable likelihoods
const likelihoods = [
  'UNKNOWN',
  'VERY_UNLIKELY',
  'UNLIKELY',
  'POSSIBLE',
  'LIKELY',
  'VERY_LIKELY',
];

// Constructs request
const request =[
 	{
  		inputContent: '',
  		features: ['LABEL_DETECTION'],
	},
	{
  		inputContent: '',
  		features: ['SHOT_CHANGE_DETECTION'],
	},
	{
  		inputContent: '',
  		features: ['EXPLICIT_CONTENT_DETECTION'],
	}
];


exports.SetUpPath=(filename)=>{
	var path = './uploads/'+filename+'.mp4';
	// Reads a local video file and converts it to base64
	const file = fs.readFileSync(path);
	const inputContent = file.toString('base64');
	request[0].inputContent=inputContent
	request[1].inputContent=inputContent		
	request[2].inputContent=inputContent		

}

exports.LabelDetection=()=>{
// Detects labels in a video
	var foo=[]
	return new Promise((res,rej)=>{
		client
		  .annotateVideo(request[0])
		  .then(results => {
		    const operation = results[0];
		    // console.log('Waiting for operation to complete...');
		    return operation.promise();
		  })
		  .then(results => {
		    // Gets annotations for video
		    const annotations = results[0].annotationResults[0];

		    const labels = annotations.segmentLabelAnnotations;
		    labels.forEach(label => {
		      // console.log(`Label ${label.entity.description} occurs at:`);
		      var description=`${label.entity.description}`
		      label.segments.forEach(segment => {
		        let time = segment.segment;
		        if (time.startTimeOffset.seconds === undefined) {
		          time.startTimeOffset.seconds = 0;
		        }
		        if (time.startTimeOffset.nanos === undefined) {
		          time.startTimeOffset.nanos = 0;
		        }
		        if (time.endTimeOffset.seconds === undefined) {
		          time.endTimeOffset.seconds = 0;
		        }
		        if (time.endTimeOffset.nanos === undefined) {
		          time.endTimeOffset.nanos = 0;
		        }
		        
		        var start=`${time.startTimeOffset.seconds}` +
		            `.${(time.startTimeOffset.nanos / 1e6).toFixed(0)}`
		        var end=`${time.endTimeOffset.seconds}.` +
		            `${(time.endTimeOffset.nanos / 1e6).toFixed(0)}`
		        var confidence=`${segment.confidence}`
		        foo.push(
		        		{	
		        			'label':description,
		        			'start':start,
		        			'end':end,
		        			'confidence':confidence
		        		}
		        )
		      });
		    });
		  })
		  .then(()=>{
		  		res(foo)
		  })
		  .catch(err => {
		    rej([])
		  });		
	})

}

exports.ShotChangeDetection=()=>{
// Detects camera shot changes
	var foo=[]
	return new Promise((res,rej)=>{
		client
		  .annotateVideo(request[1])
		  .then(results => {
		    const operation = results[0];
		    // console.log('Waiting for operation to complete...');
		    return operation.promise();
		  })
		  .then(results => {
		    // Gets shot changes
		    const shotChanges = results[0].annotationResults[0].shotAnnotations;
		    // console.log('Shot changes:');

		    if (shotChanges.length === 1) {
		      // console.log(`The entire video is one shot.`);
		      res([])
		    } else {
		    	// foo.push({'shot:'})
		      shotChanges.forEach((shot, shotIdx) => {
		        // console.log(`Scene ${shotIdx} occurs from:`);
		        if (shot.startTimeOffset === undefined) {
		          shot.startTimeOffset = {};
		        }
		        if (shot.endTimeOffset === undefined) {
		          shot.endTimeOffset = {};
		        }
		        if (shot.startTimeOffset.seconds === undefined) {
		          shot.startTimeOffset.seconds = 0;
		        }
		        if (shot.startTimeOffset.nanos === undefined) {
		          shot.startTimeOffset.nanos = 0;
		        }
		        if (shot.endTimeOffset.seconds === undefined) {
		          shot.endTimeOffset.seconds = 0;
		        }
		        if (shot.endTimeOffset.nanos === undefined) {
		          shot.endTimeOffset.nanos = 0;
		        }
		        var shotIdxx=shotIdx
		        var start=`${shot.startTimeOffset.seconds}` +
		            `.${(shot.startTimeOffset.nanos / 1e6).toFixed(0)}`
		        var end=`${shot.endTimeOffset.seconds}.` +
		            `${(shot.endTimeOffset.nanos / 1e6).toFixed(0)}`

		        foo.push({'shotIdx':shotIdxx,'start':start,'end':end})
		      });
		    }
		  })
		  .then(()=>{
		  		res(foo)
		  })
		  .catch(err => {
		    	rej([])
		  });
	})

}

exports.ExplicitContentDetection=()=>{
// Detects unsafe content
    var foo=[]
	return new Promise((res,rej)=>{
		client
	  .annotateVideo(request[2])
	  .then(results => {
	    const operation = results[0];
	    // console.log('Waiting for operation to complete...');
	    return operation.promise();
	  })
	  .then(results => {
	  	// console.log(results)
	    // Gets unsafe content
	    const explicitContentResults =
	      results[0].annotationResults[0].explicitAnnotation;
	    console.log('Explicit annotation results:');
	    explicitContentResults.frames.forEach(result => {
	      if (result.timeOffset === undefined) {
	        result.timeOffset = {};
	      }
	      if (result.timeOffset.seconds === undefined) {
	        result.timeOffset.seconds = 0;
	      }
	      if (result.timeOffset.nanos === undefined) {
	        result.timeOffset.nanos = 0;
	      }
	      // console.log(
	      //   `\tTime: ${result.timeOffset.seconds}` +
	      //     `.${(result.timeOffset.nanos / 1e6).toFixed(0)}s`
	      // );
	      // console.log(
	      //   `\t\tPornography liklihood: ${
	      //     likelihoods[result.pornographyLikelihood]
	      //   }`
	      // );
	      	var time=`${result.timeOffset.seconds}`+`.${(result.timeOffset.nanos / 1e6).toFixed(0)}`
	      	var pl=`${likelihoods[result.pornographyLikelihood]}`
			foo.push({'time':time,'porn':pl})
	    });
	  })
	  .then(()=>{
	  		res(foo)
	  })
	  .catch(err => {
	    // console.error('ERROR:', err);
	    	rej(foo)
	  });		
	})
	
}