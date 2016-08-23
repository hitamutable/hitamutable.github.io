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
	  fetchThenVote('popular');
	});
	
	function generateReport(res, photo) {
		console.log(photo);
		var msg = res.success ? "Voted" : res.error_message;
		var img = '<img src="' + photo.image_url + '" width="100" />';
		var url = '<a href="https://500px.com/' + photo.url + '">' + photo.name + '</a>';
		var gear = 'Body: ' + photo.camera + '<br>Lens: ' + photo.lens;
		var exif = photo.focal_length + ' mm, ' +
		           'iso ' + photo.iso + ', ' +
		           'f ' + photo.aperture + ', ' +
		           photo.shutter_speed + ' s';
		var row =
		  '<tr>' +
		    '<td>' + photo.taken_at + '</td>' +
		    '<td>' + img + '</td>' +
		    '<td>' + url + '</td>' +
		    '<td>' + gear + '</td>' +
		    '<td>' + exif + '</td>' +
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
