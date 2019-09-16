(function($) {
  "use strict"; // Start of use strict


  //****************
  //  RANDOM
  //*************** */
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
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


  //  ***************
  //  *** Loader ****
  // ****************

  var showLoader = function(){
    $('#loader').show();
    $('#delitemain').parent().parent().css("pointer-events", "none")
    $('#delitemain').parent().parent().css("background-color", "gray")
  }

  var hideLoader = function(){
    $('#loader').hide();
    $('#delitemain').parent().parent().css("pointer-events", "inherit")
    $('#delitemain').parent().parent().css("background-color", "inherit")
  }

  //  ***************
  //  **** Login ****
  //  ***************
    var applyTemplateLogin = function(){
    var login_html = `
    <div class="card card-login mx-auto mt-5">
    <div class="card-header">Discovery Environment Login</div>
    <div class="card-body">
      <form id="deloginform">
        <div class="form-group">
          <div class="form-label-group">
            <input type="email" id="inputEmail" class="form-control" placeholder="DE Username" required="required" autofocus="autofocus">
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
  function(){
    showLoader();
    var deusername = $('#inputEmail').val();
    setCookie("deusername", deusername, 1);
    var depassword = $('#inputPassword').val();

    var url = 'delogin/';
    var data = {'deusername': deusername, 'depassword': depassword};

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "X-CSRFToken": csrftoken
      }
    }).then(res => res.json())
    .then(response => {
      console.log('Success:', JSON.stringify(response))
      if (response.response == true)
      {
        console.log("logged in");
        reindexPage();
      }

    })
    .catch(error => console.error('Error:', error));

    hideLoader();
  });


  var applyHomeTemplate = function(){
    var home_html = 
    `
    <h1>Welcome to DE<sub>lite</sub></h1>
        <hr/>
        <p>This is a demo using the DE Terrain API with Django. 
        For more information please checkout the Github Here</p>
    `
    $('#delitemain').html(home_html);

  }

  // ****************
  // **** Files *****
  // ****************

  

  //  ***************
  //  *** App List **
  //  ***************

  var applySearchTemplate = function(term="DE Word Count"){
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
    fetch('deappsearch/?searchterm='+encoded)
    .then(response => response.json())
    .then(data => {
      if (data.total != 0){

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
        $('#delitemain').html(search_html+markup);
        hideLoader();

      }
    });    
  }

  $('#menuapps').click(function(){
    reindexPage("apps");
  });

  $(document).on("click", "#appsearchbtn",
  function(){
    reindexPage("apps", $("#appsearchinput").val())
  });

  $(document).on("click", ".multiappbtn",
  function(event){
    reindexPage("app", event.target)
  });


  //  ***************
  //  **** App ******
  //  ***************

  var stored_groups_length = -1;
  var stored_app_length = []
  var stored_app_id = ""
  var stored_system_id = ""

  var applyAppTemplate = function(elem){
    var jelm = $(elem);//convert to jQuery Element
    stored_app_id = jelm.data("id");
    stored_system_id = jelm.data("system");
    var app_id = encodeURI(jelm.data("id"));
    var system_id = encodeURI(jelm.data("system"))
    showLoader();
    fetch('deinfo/?app_id='+app_id+'&system_id='+system_id)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var groups = data.groups;
      var inputs = ``
      stored_groups_length = groups.length;
      for (var i =0 ; i < groups.length; i++){
        var paramaters = groups[i].parameters;
        stored_app_length.push(paramaters.length);
        for (var j = 0 ; j < paramaters.length ; j++){
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
  function(){
    var config = {};
    for (var i = 0; i < stored_groups_length; i++){

      for ( var j = 0; j < stored_app_length[i]; j++){

        var key = ($('#input'+i+''+j).data("id"))
        var val = ($('#input'+i+''+j).val())

        config[key] = val;
      }
    }

    var url = 'desubmit/';
    var data = {'username': getCookie("deusername"), 'config': config, 'app_id': stored_app_id, 
                'system_id': stored_system_id};

    showLoader();

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        "X-CSRFToken": csrftoken
      }
    }).then(res => res.json())
    .then(response => {
      console.log('Success:', JSON.stringify(response));
      hideLoader();
      if (response.status == "Submitted"){
        var submitted_html = `
        <div class="p-3 mb-2 bg-success text-white">Job Was Sucessfully Submitted!</div>
        `
  
        $('#delitemain').html(submitted_html);

        
      }

    })
    .catch(error => {
      console.error('Error:', error);
      hideLoader();
    });

    
  });



  //  ***************
  //  **** Index ****
  //  ***************
  var reindexPage = function(term="home", args=null){
    showLoader();
    fetch('deinfoset/')
    .then(response => response.json())
    .then(data => {
      if (data.response == true){

        switch(term){
          case "home":
            applyHomeTemplate();
            break;
          case "apps":
            if (args != null){
              applySearchTemplate(args);
              break;
            }
            applySearchTemplate();
            break;
          case "app":
            applyAppTemplate(args);
            break;


        }
      } else {
        applyTemplateLogin();
      }
    })

    hideLoader();
  }

  reindexPage();

  

































  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

})(jQuery); // End of use strict
