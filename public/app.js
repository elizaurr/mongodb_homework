//First scrap articles and return them to browser for rendering here.

  $.getJSON('/scrape', function(data) {
    console.log("data=",data);
    for (var i = 0; i<data.length; i++){
      //if there is a note on this article, attach *note* to the title to signify its existence to the user.
      if(data[i].note){
        noteExists = '<span style="color: yellow"><sup> *note attached*</sup></span>'
        }else{
          noteExists = "";
      }
      $('#articles').append('<h2><p data-id="' + data[i]._id + '">' + data[i].title + noteExists+'</p></h2>'+'<a href='+data[i].link +' target = "_blank">'+data[i].link+"<br />");
      $('#articles').append("____________________________________________________________________________________________________________________");
    }
      $('#articles').append("____________________________________________________________________________________________________________________");
  });

//call scape function

//When the article is clicked, the note input (or display) box is displayed with
//either a savenote or deletenote button as appropriate.
$(document).on('click', 'p', function(){
  $('#notes').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      //console.log("app.js data=",data);
      $('#notes').append('<h2>' + data.title + '</h2>');
      $('#notes').append('<input id="titleinput" name="title" >');
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      
      //lets see if there is a note for this article and display it with delete btn
      //or if not allow for entry of a note and save with save btn. 
      //Color of input box changes depending on existence of note or not. 
      if(data.note){
        
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
        $('#notes').append('<button data-id="' + data._id + '" id="deletenote">Delete Note</button>');
        $('#bodyinput,#titleinput').css('background-color', '#99ddff');
      }else{
        $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
        $('#bodyinput,#titleinput').css('background-color', '#99ddff');
      }
    });
});
//When the save note button is clicked POST to savenote on server
$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/savenote/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').empty();
    });

    location.reload();
  $('#titleinput').val("");
  $('#bodyinput').val("");
  
});
//When the delete note button is clicked Post to deletenote on server
$(document).on('click', '#deletenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/deletenote/" + thisId,
  })
    .done(function( data ) {
      
      console.log(data);
      $('#notes').empty();
    });

  location.reload();
  $('#titleinput').val("");
  $('#bodyinput').val("");
  
});

$(document).on('click', '#cnnlogo', function(){
$('#head').css("color", "white");
  $.ajax({
    method: "POST",
    url: "/dropdb/"
  })
    .done(function( data ) {
      console.log("back from drop");
      $('#head').css("color", "black");
      //this will force a page refresh which will force a GET to '/' and that will force
      //the /scrape because it is the first thing that the JS does upon starting up.  ;-)
      location.reload();
    });

});