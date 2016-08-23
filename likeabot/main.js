$(function () {

	// Init
	_500px.init({
	  sdk_key: '92e0ebba2f64a8e25bb1def13436fc0268993b8b'
	});

	// Handle logging out event
	_500px.on('logout', function() {
	  $('#not_logged_in').show();
	  $('#logged_in').hide();
	  $('#logged_in').html('');
	});

	// If the user has already logged in & authorized your application, this will fire an 'authorization_obtained' event
	_500px.getAuthorizationStatus();
	
	// If the user clicks the login link, log them in
	$('#login').click(_500px.login);

	_500px.on('authorization_obtained', function() {
	  $('#not_logged_in').hide();
	  $('#logged_in').show();
	  fetchThenVote('upcoming');
	});

	function makeThumbnail(photo) {
		return '<a href="https://500px.com/' + photo.url + '">' +
				 		 '<img src="' + photo.image_url + '" width="50" />' +
				 		 '<legend style="text-align: center">' + photo.name + '</legend>' +
					 '</a>';
	};

	function getExif(photo) {
		if(!photo.iso) return "";
		return photo.focal_length + ' mm, ' +
						 'iso ' + photo.iso + ', ' +
						 'f ' + photo.aperture + ', ' +
					 photo.shutter_speed + ' s';
	};

	function getGearInfo(photo) {
		if(!photo.camera) return "";
		return "Body: " + photo.camera + "<br>" +
					 "Lens: " + photo.lens;
	};

	function makeMsg(res, photo) {
		if(res.error) return res.error_message;
		return "Voted for" + photo.user.fullname + "<br>" +
					 "Live in " + photo.user.city + ", " + photo.user.country + "<br>" +
					 "Followers: " + photo.user.followers_count + "<br>"

	};
	
	function generateReport(res, photo) {
		var thumbnail = makeThumbnail(photo);
		var gear = getGearInfo(photo);
		var exif = getExif(photo);
		var msg  = makeMsg(res, photo);
		var row =
		  '<tr>' +
		    '<td>' + thumbnail + '</td>' +
		    '<td>' + gear + '</td>' +
		    '<td>' + exif + '</td>' +
		    '<td>' + photo.times_viewed + '</td>' +
		    '<td>' + photo.votes_count + '</td>' +
		    '<td>' + msg + '</td>' +
		  '</tr>';
		
		$('#logged_in #table tbody:last-child').append(row);
	};

	function voteUp(photos) {
		photos.map(function(photo){
			var url = '/photos/' + photo.id + '/vote';
			var params = {vote: 1};
			// Vote up each photo
			_500px.api(url, 'post', params, function(res) {
				generateReport(res, photo);
			});
		});
	};

	function fetchThenVote(cat) {
		var params = { feature: cat, rpp: 50 };
		// Get photos by category
		_500px.api('/photos', params, function(res){
			if (res.success) {
				voteUp(res.data.photos)				
			} else {
				console.error(res.error_message)
			}
		});
	};
})
