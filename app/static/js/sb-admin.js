(function ($) {
  "use strict"; // Start of use strict


  //****************
  //  RANDOM
  //*************** */
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }



  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  $.getCookie = function (cname) {
    return getCookie(cname);
  }


  //  ***************
  //  *** Loader ****
  // ****************

  $.showLoader = function () {
    showLoader();
  }

  $.hideLoader = function () {
    hideLoader();
  }

  var showLoader = function () {
    $('#loader').show();
    $('#delitemain').parent().parent().css("pointer-events", "none")
    $('#delitemain').css("filter", "grayscale(100%)")
    $('#delitemain').css("filter", "blur(2px)")
    //$('#delitemain').parent().parent().css("background-color", "gray")
  }

  var hideLoader = function () {
    $('#loader').hide();
    $('#delitemain').parent().parent().css("pointer-events", "inherit")
    $('#delitemain').css("filter", "none")
    $('#delitemain').css("filter", "none")
  }

  //  ***************
  //  **** Login ****
  //  ***************
  var applyTemplateLogin = function () {
    var login_html = `
    <div class="card card-login mx-auto mt-5">
    <div class="card-header">Discovery Environment Login</div>
    <div class="card-body">
      <form id="deloginform">
        <div class="form-group">
          <div class="form-label-group">
            <input type="text" id="inputEmail" class="form-control" placeholder="DE Username" required="required" autofocus="autofocus">
            <label for="inputEmail">DE Username</label>
          </div>
        </div>
        <div class="form-group">
          <div class="form-label-group">
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="required">
            <label for="inputPassword">Password</label>
          </div>
        </div>

        </div>
        <input type="submit" id="deloginbutton" class="btn btn-primary btn-block"/>
      </form>

    </div>
  </div>`
    $('#delitemain').html(login_html);
  };

  $(document).on("click", "#deloginbutton",
    function () {
      $.showLoader();
      var deusername = $('#inputEmail').val();
      setCookie("deusername", deusername, 1);
      var depassword = $('#inputPassword').val();

      var url = 'delogin/';
      var data = { 'deusername': deusername, 'depassword': depassword };
      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken
        }
      }).then(response => {
          $.hideLoader();

          if (response.status === 400) {
            toastr.error("Sorry there was an error, try reloading and try again")
          } else {

            console.log("logged in");
            reindexPage();
            

          }


        })
        .catch(error => {
          $.hideLoader();
          toastr.error("Sorry there was an error, try reloading and try again");
        });

    });


  var applyHomeTemplate = function () {
    var home_html =
      `
    <h1>Welcome to DE<sub>lite</sub></h1>
        <hr/>
        <p>This is a demo using the DE Terrain API with Django. 
        For more information please checkout the Github <a href="https://github.com/towicode/DElite"> Here </a></p>
    `
    $('#delitemain').html(home_html);

  }

  // ***************
  // ***** TREE ****
  //****************

  var applyTreeTemplate = function () {
    var tree_html = `
    `
    $('#delitemain').html(tree_html);
  }

  $('#menutree').click(function () {
    reindexPage("tree");
  });

  $('#menuhome').click(function () {
    reindexPage("home");
  });

  // ****************
  // **** Files *****
  // ****************


  var applyFilesTemplate = function (path = null) {
    var files_html = `
    <div class="filemanager">
      <div class="breadcrumbs"></div>

      <ul class="data"></ul>

      <div class="nothingfound">
        <div class="nofiles"></div>
        <span>No files here.</span>
      </div>

    </div>
    `
    $('#delitemain').html(files_html);
    $.init();
  }

  $('#menufiles').click(function () {
    reindexPage("files");
  });



  //  ***************
  //  *** App List **
  //  ***************

  var applySearchTemplate = function (term = "DE Word Count") {
    var search_html = `
    <nav class="navbar navbar-light bg-light justify-content-between">
      <a class="navbar-brand"></a>
      <div class="form-inline">
        <input id="appsearchinput" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button id="appsearchbtn" class="btn btn-outline-success my-2 my-sm-0" >Search</button>
      </div>
    </nav>
    `
    var encoded = encodeURI(term);
    showLoader();
    fetch('deappsearch/?searchterm=' + encoded)
      .then(response => response.json())
      .then(data => {
        if (data.total != 0) {

          const markup =
            `
        <div class="row">
          ${data.apps.map(idea =>
              `
            <div class="col-sm-4">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${idea.name}</h5>
                  <p class="card-text">${idea.description}</p>
                  <a data-name="${idea.name}" data-id=${idea.id} data-system=${idea.system_id} href="#" class="btn btn-primary multiappbtn">Open</a>
                </div>
              </div>
            </div>
            `
            ).join('')}
        `;
          $('#delitemain').html(search_html + markup);
          hideLoader();

        }
      });
  }

  $('#menuapps').click(function () {
    reindexPage("apps");
  });

  $(document).on("click", "#appsearchbtn",
    function () {
      reindexPage("apps", $("#appsearchinput").val())
    });

  $(document).on("click", ".multiappbtn",
    function (event) {
      reindexPage("app", event.target)
    });


  //  ***************
  //  **** App ******
  //  ***************

  var stored_groups_length = -1;
  var stored_app_length = []
  var stored_app_id = ""
  var stored_system_id = ""

  var applyAppTemplate = function (elem) {
    var jelm = $(elem);//convert to jQuery Element
    stored_app_id = jelm.data("id");
    stored_system_id = jelm.data("system");
    var app_id = encodeURI(jelm.data("id"));
    var system_id = encodeURI(jelm.data("system"))
    showLoader();
    fetch('deinfo/?app_id=' + app_id + '&system_id=' + system_id)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        var groups = data.groups;
        var inputs = ``
        stored_groups_length = groups.length;
        for (var i = 0; i < groups.length; i++) {
          var paramaters = groups[i].parameters;
          stored_app_length.push(paramaters.length);
          for (var j = 0; j < paramaters.length; j++) {
            var param = paramaters[j];
            var new_input =
              `
            <div class="form-group">
              <label for="input${i}${j}">${param.label}</label>
              <input data-id="${param.id}" type="text" class="form-control" id="input${i}${j}" aria-describedby="helpme${i}${j}" placeholder="...">
              <small id="helpme${i}${j}" class="form-text text-muted">${param.description}</small>
            </div>
            `

            inputs += new_input;
          }
        }
        var app_html =
          `
      <h1> ${jelm.data("name")} </h1>
      <sub> If you're using the DE Word Count App try using this as the File Input! </sub>
      <br/>
      <sub> <span style="background-color:lightgray"> /iplant/home/shared/workshop_material/terrain_intro/essay.txt </span> </sub>
      <hr/>
      <form>
      ` + inputs + `
        <button id="submit-app" class="btn btn-primary">Submit</button>
      </form>
      `
        $('#delitemain').html(app_html);
        hideLoader();
      });
  }

  $(document).on("click", "#submit-app",
    function () {
      var config = {};
      for (var i = 0; i < stored_groups_length; i++) {

        for (var j = 0; j < stored_app_length[i]; j++) {

          var key = ($('#input' + i + '' + j).data("id"))
          var val = ($('#input' + i + '' + j).val())

          config[key] = val;
        }
      }

      var url = 'desubmit/';
      var data = {
        'username': getCookie("deusername"), 'config': config, 'app_id': stored_app_id,
        'system_id': stored_system_id
      };

      showLoader();

      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken
        }
      }).then(res => res.json())
        .then(response => {
          console.log('Success:', JSON.stringify(response));
          hideLoader();
          if (response.status == "Submitted") {
            var submitted_html = `
        <div class="p-3 mb-2 bg-success text-white">Job Was Sucessfully Submitted!</div>
        `

            $('#delitemain').html(submitted_html);



          }

        })
        .catch(error => {
          console.error('Error:', error);
          toastr.error("Sorry there was an error, try reloading and try again")
          hideLoader();
        });


    });



  // ***************
  // *** Transfer **
  // ***************

  var cur_path = ""
  var prev_path = ""

  var applyTransferTemplate = async function (path) {

    path = typeof path !== 'undefined' ? path : null;

    if (path == null) {
      var un = $.getCookie("deusername");
      cur_path = "/iplant/home/" + un;
      prev_path = "/iplant/home"
    } else {
      cur_path = path;
    }
    if (cur_path.endsWith("/")) {
      cur_path = cur_path.slice(0, -1);
    }
    prev_path = cur_path.substring(0, cur_path.lastIndexOf("/") + 1);

    var encoded = encodeURI(cur_path);

    $.showLoader();

    try {
      let [responsea, responseb] = await Promise.all([
        fetch('defiles/?path=' + encoded),
        fetch("localfiles/")
      ]);

      let [raw_data, local_data] = await Promise.all([
        responsea.json(),
        responseb.json(),
      ]);



      var folders = ``;

      folders += `
        <div>
            <a class="transferfolder" href="#" data-path="${prev_path}">
              <span>
                <div class="ficon"></div> <------
              </span>
            </a>
          </div>
      `
      for (var i = 0; i < raw_data.folders.length; i++) {
        var folder = raw_data.folders[i];
        var new_folder = `
          <div>
            <a class="transferfolder" href="#" data-path="${folder.path}">
              <span>
                <div class="ficon"></div> ${folder.label}
              </span>
            </a>
          </div>
          `
        folders += new_folder
      }

      var options = ``;
      for (var i = 0; i < raw_data.files.length; i++) {
        var file = raw_data.files[i];
        var new_option = `<option data-info="${file.path}">${file.label}</option>`;
        options += new_option;
      }

      var localfiles = ``;
      for (var i = 0; i < local_data.length; i++) {
        var new_localfile = `<option data-info="${local_data[i]}">${local_data[i]}</option>`;
        localfiles += new_localfile;
      }

      var transferHtml = `
        <div class="container">
          <div class="row">
            <div class="col-sm-5 ">
              <h3 id="transferpath"> ${cur_path} </h3>
              <div class = "transferbox">
                <div id="transferremotefolders">${folders}</div>
                <select id="transferremotebox" class="leftbox" size=25>
                ${options}
                </select>
              </div>
            </div>
            <div class="col-sm-1">
            <div class="bigtransfer">
            <button id="leftbutton" class=""> &leftarrow; Transfer</button>
            <hr /> 
            <button id="rightbutton" class=""> &rightarrow; Transfer</button>
            </div>
    
            </div>
            <div class="col-sm-5 ">
              <h3> Server Side Storage </h3>
              <div class = "transferbox">
                <select id="transferlocalbox" name="leftbox" class="leftbox" size=30>
                ${localfiles}
                </select>
              </div>
            </div>
          </div>
        </div>
        `
      $('#delitemain').html(transferHtml);
      $.hideLoader();

      var left_box = $('#transferremotebox').parent()
      var right_box = $('#transferlocalbox').parent()

      right_box.height(left_box.height())
    }
    catch (err) {
      console.log(err);
      $.hideLoader();
    };
  }

  $(document).on("click", "#rightbutton",
    function (event) {
      $.showLoader();

      var path = $("#transferremotebox :selected").data('info');
      var data = {
        'path': path
      }
      console.log(data)
      fetch("deticket/", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken
        }
      }).then(res => res.json())
        .then(response => {
          $.hideLoader();
          applyTransferTemplate(cur_path)
        });
    }
  );

  $(document).on("click", "#leftbutton",
    function (event) {
      $.showLoader();

      var file = $("#transferlocalbox :selected").data('info');
      var data = {
        'file': file,
        'path': cur_path
      }
      console.log(data)
      fetch("deupload/", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken
        }
      }).then(res => {
        $.hideLoader();
        applyTransferTemplate(cur_path)
      })

    });



  $(document).on("click", ".transferfolder",
    function (event) {
      var elem = $(event.target).parent()
      var mydata = elem.data("path")
      applyTransferTemplate(mydata);
    });



  //  ***************
  //  **** Index ****
  //  ***************
  var reindexPage = function (term = "home", args = null) {
    showLoader();
    console.log("hello")
    fetch('deinfoset/')
      .then(response => {
        if (response.status === 400) {
          applyTemplateLogin();
          return;
        }
        switch (term) {
          case "home":
            applyHomeTemplate();
            $('#jstree_demo_div').html("");
            break;
          case "apps":
            if (args != null) {
              applySearchTemplate(args);
              $('#jstree_demo_div').html("");
              break;
            }
            applySearchTemplate();
            $('#jstree_demo_div').html("");
            break;
          case "app":
            $('#jstree_demo_div').html("");
            applyAppTemplate(args);
            break;
          case "files":
            $('#jstree_demo_div').html("");
            //applyFilesTemplate();
            applyTransferTemplate();
            break;
          case "tree":
            $.treeInit();
            applyTreeTemplate();
            break;
        }
      }).catch(error => {
        console.log(error)
        applyTemplateLogin();
      });

    hideLoader();
  }

  reindexPage();



  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

})(jQuery); // End of use strict
