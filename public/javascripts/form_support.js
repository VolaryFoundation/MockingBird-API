$(document).ready(function() {
  var doc = $(document)
  //Add google map to blank image.
  $(".group_img").each(function(image) {
    if (this.getAttribute('src') == 'http://placehold.it/180x125.png') {
      if (this.getAttribute('extra_info_city')) {
      	city = this.getAttribute('extra_info_city')
      	state = this.getAttribute('extra_info_state')
      	this.setAttribute('src', "https://maps.googleapis.com/maps/api/staticmap?center=" + city +',' + state + '&size=180x125&sensor=false')
      }
      else if (this.getAttribute('extra_info_state')) {
      	state = this.getAttribute('extra_info_state')
      	this.setAttribute('src', "https://maps.googleapis.com/maps/api/staticmap?center=" + state + '&size=180x125&sensor=false')
      }
    }
  });

  //Event Listenr for Edit form
  $("a.edit_link", $('section#mockingbird_view')).click(function(e) {
    e.preventDefault();
    $('section#mockingbird_view').hide();
    $('section#mockingbird_edit').show();
    $('.form.main_info_area').show().addClass('active_area');
    $('#main_info_area').addClass('active')
  })

  //Event listener for link to form show proccess
  $("a.form_nav_link").click(function(e) {
    e.preventDefault();
    $('.form.active_area').hide().removeClass('active_area')
    $('a.active').removeClass('active')
    $(e.currentTarget).addClass('active')
    $('.' + e.currentTarget.id).show().addClass('active_area')
  })

  //Event listen for canel edit form
  $("a.cancel", $('section#mockingbird_edit')).click(function(e) {
    e.preventDefault();
    $('section#mockingbird_view').show();
    $('section#mockingbird_edit').hide();
    $("form#submit_groups")[0].reset()
    resetFroms()
  })
  //URL edit form listeners
  $('.edit_url_link').click( function(e) {
    e.preventDefault();
    $('.url_area .active').removeClass('active');
    $(e.currentTarget).parent().parent().addClass('active');
    $('form.submit_url').hide();
    $("form[group_id='" + $(e.currentTarget).attr('group_id') + "']").show().addClass('active');
  })

  //AJAX Submit
  doc.on("submit", "form.ajax_submit", function(e) {ajaxSubmit(e)} );
  doc.on("click", "a.ajax_submit", function(e) {ajaxSubmit(e)} );


})

function ajaxSubmit(e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/api/groups/" + $(e.currentTarget).attr('action'),
    data: $(e.currentTarget).serialize(),
    success: function(data){
     console.log(e);
     data = JSON.parse(data);
     target = $(e.currentTarget)
     if (target.hasClass('submit_url')) {urlChangeUpdates(data)}
     else if (target.hasClass('submit_groups')) {mainInfoChangeUpdates(data);}
     else if (target.hasClass('delete_url_link')) {urlDeleteUpdate(data)};
    },
    error: function(data){
     if ($(e.currentTarget).hasClass('submit_url')) {
       $("#url_error").text("Unable to update the link. Please check the fields and try again").show();
     } else if ($(e.currentTarget).hasClass('submit_groups')) {
       $("#group_error").text("Unable to update the group. Please check the fields and try again").show();
     } else if ($(e.currentTarget).hasClass('submit_groups')) {
       $("#url_error").text("Unable to delete the URL.").show();
     }
    }
  });
};

function urlDeleteUpdate(data) {
  $("[group_id='" + data.id + "']").remove();
  $('section#mockingbird_view').show();
  $('section#mockingbird_edit').hide();
  resetFroms();
  alert(data);
}

function mainInfoChangeUpdates(data) {
  $("#group_error").hide().text("");
  detailsUL = $('ul.mocking_bird_details')
  //Update Location
  locationLI = $('li.location', detailsUL)
  $('span.text', locationLI).text(locationHelper(data.location))
  //Update range
  rangeLI = $('li.range', detailsUL)
  $('span.text', rangeLI).text(data.range)
  //Update name
  nameLI = $('li.name', detailsUL)
  $('span.text', nameLI).text(data.name)
  //Update tags
  descriptionLI = $('li.description', detailsUL)
  $('span.text', descriptionLI).text(data.description)
  //Update tags
  tagsLI = $('li.tags', detailsUL)
  $('span.text', tagsLI).text(data.tags.join(", "))
  $('section#mockingbird_view').show();
  $('section#mockingbird_edit').hide();
}


function urlChangeUpdates(data) {
  $("#url_group_error").hide().text("");
  $("a[object_id='" + data.id + "']").attr('href', data.url)
  $("a[object_id='" + data.id + "']").text(data.url)
  $("input[object_id='" + data.id + "']").attr('value', data.url)
  $("select[object_id='" + data.id + "']").val(data.type)
  resetFroms()
  $('section#mockingbird_view').show();
  $('section#mockingbird_edit').hide();
}

function resetFroms() {
  $("#group_error").hide().text("");
  $('.active_area').removeClass('active_area');
  $('.active').removeClass('active');
  $('.form.main_info_area').hide();
  $('.form.url_area').hide();
  $('.form.tags_area').hide();
  $('.form.admin_area').hide();
  $('form.submit_url').hide();
  form = $('form')
  form.each( function(index) {
    form[index].reset();
  });
};


function locationHelper(locationObject) {
	var locationArray = []
	if (locationObject.address != null && locationObject.address != "") {
		locationArray.push(locationObject.address)
	}
	if (locationObject.city != null && locationObject.address != "") {
		locationArray.push(locationObject.city)
	}
	if (locationObject.state != null && locationObject.address != "") {
		locationArray.push(locationObject.state)
	}
	if (locationObject.postal_code != null && locationObject.address != "") {
		locationArray.push(locationObject.postal_code)
	}
	if (locationObject.country != null && locationObject.address != "") {
		locationArray.push(locationObject.country)
	}
	return locationArray.join(', ')
};
