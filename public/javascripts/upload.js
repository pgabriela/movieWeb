$('#uploadBtn').on('click', function(e) {
    $('#ErrorMsg').addClass('invisible');
    if ($('#MovieTitle').val() == "") {
        $('#ErrorMsg').removeClass("invisible");
        return;
    }
    if ($('#MovieGenre').val() == "") {
        $('#ErrorMsg').removeClass("invisible");
        return;
    }
    if ($('#MovieReleaseDate').val() == "") {
        $('#ErrorMsg').removeClass("invisible");
        return;
    }
    if ($('#MovieCast').val() == "") {
        $('#ErrorMsg').removeClass("invisible");
        return;
    }
    if ($('#MovieCountry').val() == "") {
        $('#ErrorMsg').removeClass("invisible");
        return;
    }
    if ($('#MoviePrice').val() == "") {
        $('#ErrorMsg').removeClass("invisible");
        return;
    }
    if ($('#MovieDescription').val() == "") {
        $('#ErrorMsg').removeClass("invisible");
        return;
    }
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$("#upload-input").on('change', function() {
    var f = $('#upload-input').val().replace(/.*[\/\\]/, '');
    $('#FileNamePlaceholder').html(f);
    $('#FileNamePlaceholder').removeClass('invisible');
});

$('#uploadForm').submit(function(e) {
    e.preventDefault();

    var files = $('#upload-input').get(0).files;
    var filesBanner = $('#uploadBanner').get(0).files;
    var filesPic = $('#uploadPic').get(0).files;

    if (files.length > 0) {
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // add the files to formData object for the data payload
        formData.append('uploadMov', files[0], files[0].name);
        formData.append('uploadPic', filesPic[0], filesPic[0].name);
        formData.append('uploadBanner', filesBanner[0], filesBanner[0].name);
        formData.append('MovieTitle', $('#MovieTitle').val());
        formData.append('MovieGenre', $('#MovieGenre').val());
        formData.append('MovieReleaseDate', $('#MovieReleaseDate').val());
        formData.append('MovieCast', $('#MovieCast').val());
        formData.append('MovieCountry', $('#MovieCountry').val());
        formData.append('MoviePrice', $('#MoviePrice').val());
        formData.append('MovieDescription', $('#MovieDescription').val());
        formData.append('ethAddr', ethAddr);

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                console.log('upload successful!\n' + data);
                $('#ErrorMsg').html('You have successfully uploaded a movie\nRedirecting to main page...');
                $('#ErrorMsg').removeClass('invisible');
                setInterval(function() {
                    window.location.href = '/';
                }, 1000);
            },
            xhr: function() {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function(evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Done');
                        }

                    }

                }, false);

                return xhr;
            }
        });

    } else {
        $('#ErrorMsg').html('Please upload the file first before submitting this form');
        $('#ErrorMsg').removeClass('invisible');
    }
});
