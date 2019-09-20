$(function(){


    $.init = function(){

    
        var filemanager = $('.filemanager'),
            breadcrumbs = $('.breadcrumbs'),
            fileList = filemanager.find('.data');


        var data;




        // Start by fetching the file data from scan.php with an AJAX request
        var un = $.getCookie("deusername")
        var term = "/iplant/home/" + un;
        var encoded = encodeURI(term);

        $.showLoader();

        fetch('defiles/?path='+encoded)
        .then(response => response.json())
        .then(raw_data => {

            //translate data?

            data = raw_data;


            var response = [data],
                currentPath = term,
                breadcrumbsUrls = ["iplant", "iplant/home", "iplant/home/toddwickizer"];

            var folders = [],
                files = [];

            // This event listener monitors changes on the URL. We use it to
            // capture back/forward navigation in the browser.

            var createbreads = function(){
    
                var correct_hash = location.hash
                if (correct_hash == "")
                {
                    correct_hash = encoded;
                }
                var cururl = correct_hash.replace("#", "");
                var dec = decodeURIComponent(cururl).replace("#","");

                while(dec.charAt(0) === '/')
                {
                dec = dec.substr(1);
                }
    
                var decpath = dec.split("/");

                console.log(decpath)
    
                var newpaths = [];
    
                for (var i = 0; i < decpath.length; i++){
    
                    if (i == 0){
                        newpaths.push(decpath[i])
                        continue;
                    }
    
                    var temp_string = decpath[0];
                    
                    for (var j = 1; j <= i; j++){
                        temp_string += "/" + decpath[j]
                    }
    
                    newpaths.push(temp_string);
                }
    
                breadcrumbsUrls = newpaths;
                console.log(breadcrumbsUrls);
            }
    

            $(window).on('hashchange', function(){


                var correct_hash = location.hash
                if (correct_hash == "")
                {
                    correct_hash = encoded;
                }

                console.log(correct_hash)

                createbreads();


                $.showLoader();
                fetch('defiles/?path='+correct_hash.replace("#",""))
                .then(response => response.json())
                .then(raw_data => {
                    data = raw_data;
                    render();
                });

                
                
                // We are triggering the event. This will execute 
                // this function on page load, so that we show the correct folder:

            }).trigger('hashchange');


            // Hiding and showing the search box


            // Clicking on folders

            fileList.on('click', 'li.folders', function(e){
                e.preventDefault();

                var nextDir = $(this).find('a.folders').attr('href');                

                window.location.hash = encodeURIComponent(nextDir);
                currentPath = nextDir;
            });


            // Clicking on breadcrumbs

            breadcrumbs.on('click', 'a', function(e){
                e.preventDefault();

                var index = breadcrumbs.find('a').index($(this)),
                    nextDir = breadcrumbsUrls[index];

                breadcrumbsUrls.length = Number(index);

                window.location.hash = encodeURIComponent(nextDir);

            });






            // Render the HTML for the file manager

            function render() {


                var scannedFolders = data.folders;
                var scannedFiles = data.files;

                // Empty the old result and make the new one

                fileList.empty().hide();

                if(!scannedFolders.length && !scannedFiles.length) {
                    filemanager.find('.nothingfound').show();
                }
                else {
                    filemanager.find('.nothingfound').hide();
                }

                if(scannedFolders.length) {

                    scannedFolders.forEach(function(f) {

                        var name = escapeHTML(f.label),
                            icon = '<span class="icon folder"></span>';

                        var folder = $('<li class="folders"><a href="'+ f.path +'" title="'+ f.path +'" class="folders">'+icon+'<span class="name">' + name + '</span> <span class="details">' + '</span></a></li>');
                        folder.appendTo(fileList);
                    });

                }

                if(scannedFiles.length) {

                    scannedFiles.forEach(function(f) {

                        var fileSize = bytesToSize(f['file-size']),
                            name = escapeHTML(f.label),
                            fileType = name.split('.'),
                            icon = '<span class="icon file"></span>';

                        fileType = fileType[fileType.length-1];

                        icon = '<span class="icon file f-'+fileType+'">.'+fileType+'</span>';

                        var file = $('<li class="files"><a href="'+ f.path+'" title="'+ f.path +'" class="files">'+icon+'<span class="name">'+ name +'</span> <span class="details">'+fileSize+'</span></a></li>');
                        file.appendTo(fileList);
                    });

                }

                fileList.show();
                $.hideLoader();


                // Generate the breadcrumbs

                var url = '';

       
                //fileList.addClass('animated');

                breadcrumbsUrls.forEach(function (u, i) {


                    var name = u.split('/');

                    if (i !== breadcrumbsUrls.length - 1) {
                        url += '<a href="'+u+'"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">→</span> ';
                    }
                    else {
                        url += '<span class="folderName">' + name[name.length-1] + '</span>';
                    }

                });

                

                breadcrumbs.text('').append(url);


                // Show the generated elements

                fileList.animate({'display':'inline-block'});

            }


            // This function escapes special html characters in names

            function escapeHTML(text) {
                return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
            }


            // Convert file sizes from bytes to human readable units

            function bytesToSize(bytes) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return '0 Bytes';
                var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
            }

        });
    }
});
