var dTable;
function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
var apiKey = "AIzaSyD3cpLN1S91nxdTkHORQDQICWF0mbnOPSw";
//var apiKey = "AIzaSyAumB5NxVWq8fqmRb8ODmxpWMDxsNXWO5I";


function handleAPILoaded() {
	  console.log('here');
	  gapi.client.setApiKey(apiKey);
	  gapi.client.load("youtube","v3",function(){
	  });
	  
	}
// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials

// Set endpoints
var endpoints = {
  translate: "",
  detect: "detect",
  languages: "languages"
};

// Abstract API request function
function makeApiRequest(endpoint, data, type, authNeeded) {
  url = "https://www.googleapis.com/language/translate/v2/" + endpoint;
  url += "?key=" + apiKey;
  // If not listing languages, send text to translate
  if (endpoint !== endpoints.languages) {
    url += "&q=" + encodeURIComponent(data.textToTranslate);
  }

  // If translating, send target and source languages
  if (endpoint === endpoints.translate) {
    url += "&target=" + data.targetLang;
    url += "&source=" + data.sourceLang;
  }

  // Return response from API
  return $.ajax({
    url: url,
    type: type || "GET",
    data: data ? JSON.stringify(data) : "",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

// Translate
function translate(data,targetId,target) {
  makeApiRequest(endpoints.translate, data, "GET", false).done(function(
    resp
  ) {
  	console.log(resp.data);
  	if(target=="title"){
  		$("#"+targetId).find('input').val(decodeURIComponent(resp.data.translations[0].translatedText.replace(/&#39;/g,"'")));
  	}else if(target=="desc"){
  		$("#"+targetId).find('textarea').html(decodeURIComponent(resp.data.translations[0].translatedText.replace(/<br>/g,"\n")));
  	}
  	
    //$("#"+target).val(resp.data.translations[0].translatedText);
  });
}

// Detect language
function detect(data) {

  makeApiRequest(endpoints.detect, data, "GET", false).done(function(resp) {
    source = resp.data.detections[0][0].language;
    conf = resp.data.detections[0][0].confidence.toFixed(2) * 100;
    console.log(source);
    console.log(conf);
    $("#detectlanguage option")
      .filter(function() {
        return $(this).val() === source; //To select Blue
      })
      .prop("selected", true);
    /*$.when(getLanguageNames()).then(function(data) {
      $("p.target").text(data[source] + " with " + conf + "% confidence");
    });
    $("h2.translation-heading").hide();
    $("h2.detection-heading, p").show();*/
  });
	/*url = "https://www.googleapis.com/language/translate/v2/" + endpoints.detect;
  url += "?key=" + apiKey;

  // If not listing languages, send text to translate
  if (endpoints.detect !== endpoints.languages) {
    url += "&q=" + encodeURI(data.textToTranslate);
  }

  // If translating, send target and source languages
  if (endpoints.detect === endpoints.translate) {
    url += "&target=" + data.targetLang;
    url += "&source=" + data.sourceLang;
  }
	$.ajax({
    url: url,
    type: "GET",
    data: data ? JSON.stringify(data) : "",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  }).done(function(resp) {
  	console.log(resp)
	  source = resp.data.detections[0][0].language;
    conf = resp.data.detections[0][0].confidence.toFixed(2) * 100;
    console.log(source);
    console.log(conf);
	});*/
}

// Get languages
function getLanguages() {
  makeApiRequest(endpoints.languages, null, "GET", false).success(function(
    resp
  ) {
    $.when(getLanguageNames()).then(function(data) {
      $.each(resp.data.languages, function(i, obj) {
        $(".source-lang, .target-lang").append(
          '<option value="' +
            obj.language +
            '">' +
            data[obj.language] +
            "</option>"
        );
      });
    });
  });
}

// Convert country code to country name
function getLanguageNames() {
  return $.getJSON("https://api.myjson.com/bins/155kj1");
}

jQuery(document).ready(function () {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "https://apis.google.com/js/client.js?onload=googleApiClientReady";
	head.appendChild(script);
	//window.makeApiRequest = makeApiRequest;
	function makeApiRequest(endpoint, data, type, authNeeded) {
	  url = "https://www.googleapis.com/language/translate/v2/" + endpoint;
	  url += "?key=" + apiKey;

	  // If not listing languages, send text to translate
	  if (endpoint !== endpoints.languages) {
	    url += "&q=" + encodeURI(data.textToTranslate);
	  }

	  // If translating, send target and source languages
	  if (endpoint === endpoints.translate) {
	    url += "&target=" + data.targetLang;
	    url += "&source=" + data.sourceLang;
	  }

	  // Return response from API
	  return $.ajax({
	    url: url,
	    type: type || "GET",
	    data: data ? JSON.stringify(data) : "",
	    dataType: "json",
	    headers: {
	      "Content-Type": "application/json",
	      Accept: "application/json"
	    }
	  });
	}
  var translationObj = {};
  var translationObjTitle = {};
  var translationObjDescription = {};
  // Popuplate source and target language dropdowns
  //getLanguages();
	function getLang(){
		var request = gapi.client.youtube.i18nLanguages.list({
	  		hl: 'en_US',
	      part: 'snippet'
	   });
		request.execute(function(response) {
	  	console.log(response);
	  	if(response.items.length){
	  		for (var j = 0; j <= response.items.length-1; j++) {
	  			$("#selectlanguage, #detectlanguage").append(
	          '<option value="' +
	            response.items[j].snippet.hl +
	            '">' +
	            response.items[j].snippet.name +
	            "</option>"
	        );
	  		}
	  	}
	  });
	}
	function getVideos(yttoken,pagetoken) {
		console.log(gapi.client.youtube.search);
		if(pagetoken==''){
			request = gapi.client.youtube.search.list({
	  		maxResults: '50',
	  		forMine: 'true',
			part: 'snippet',
			type: 'video',
			q: '',
			access_token: yttoken
		  });
		}else{
			request = gapi.client.youtube.search.list({
	  		maxResults: '50',
	  		forMine: 'true',
				part: 'snippet',
				type: 'video',
				q: '',
				access_token: yttoken,
				pageToken: pagetoken
		  });
		}
		request.execute(function(response) {
		  console.log(response);
	  	if(response.items.length){
  			var videoData = "";
  			$('#myvideos tbody').html();
  			var rowCount = $('#myvideos tbody tr').length;
  			for (var i = 0; i <= response.items.length-1; i++) {
  				var desc = response.items[i].snippet.description;
  				if(response.items[i].snippet.description && response.items[i].snippet.description.length>=180) {
  					desc = response.items[i].snippet.description.slice(0, 180)+'...';
  				}
  				videoData = "";
  				videoData+='<tr video-id="'+response.items[i].id.videoId+'">\
					<td style="text-align:center; vertical-align:middle;">'+(rowCount+i+1)+'</td>\
					<td><a target="_blank" href="https://www.youtube.com/watch?v='+response.items[i].id.videoId+'"><img alt="" src="'+response.items[i].snippet.thumbnails.default.url+'"></a></td>\
					<td><span class="current-video-title" style="display:block; font-weight:bold;">'+response.items[i].snippet.title+'</span><span  class="current-video-description" style="font-size: 12px;color:rgba(0,0,0,.55);">'+desc+'</span></td>\
					<td style="vertical-align:middle;">'+response.items[i].snippet.publishedAt.split("T")[0]+'</td>\
					<td style="vertical-align:middle;"><button type="button" class="editvideo btn btn-success">Translate</button></td>\
				</tr>';
				$('#myvideos tbody').append(videoData);	
  			};
  			if(response.nextPageToken){
  				getVideos(yttoken, response.nextPageToken);
  			}else{
  				dTable = $('#myvideos').DataTable( {
						"aoColumnDefs": [{ "bSortable": false, "aTargets": [ 1,4 ] }] 
					}); 
					$('.box-body').show();
  			}
	  	}else{
	  		dTable = $('#myvideos').DataTable( {
					"aoColumnDefs": [{ "bSortable": false, "aTargets": [ 1,4 ] }] 
				}); 
				$('.box-body').show();
	  	}
	  });
	}
	if(localStorage.getItem('token') && localStorage.getItem('token')!=""){
		var token = localStorage.getItem('token');
		var x = new XMLHttpRequest();
    x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    x.onload = function() {
        var profileData = JSON.parse(x.response);
        console.log(profileData)
        if(profileData.id){
        	$('#signin').hide();
        	$('#logout').show();
        	$(".personal-info").append('<div style="display:inline;"><img style="width:40px; border-radius:50%; height:40px;" src="'+profileData.picture+'"></img><span style="font-size: 20px;font-weight: bold;margin-left: 10px;margin-right: 10px;">'+profileData.name+'</span></div');
        	console.log(token);
        	setTimeout(function(){ getVideos(token,''); }, 2000);
        }
    };
    x.send();
	}
	$('#logout').click(function(){
		localStorage.removeItem('token');
		$(".personal-info").html('');
		$('#myvideos tbody').html('');
		$('#translationForm').hide();
		dTable.destroy();
		$('#myvideos tbody').html('');
		$('.box-body').hide();
		//$('#myvideos').DataTable( {} );
		$('#signin').show();
     $('#logout').hide();
	});
	$('#signin').click(function(){
		chrome.identity.getAuthToken({
		    interactive: true
		}, function(token) {
		    if (chrome.runtime.lastError) {
		        console.log(chrome.runtime.lastError.message);
		        return false;
		    }
		    localStorage.setItem("token",token);
		    var x = new XMLHttpRequest();
		    x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
		    x.onload = function() {
		        var profileData = JSON.parse(x.response);
		        console.log(profileData)
		        if(profileData.id){
		        	$('#signin').hide();
		        	$('#logout').show();
		        	$(".personal-info").append('<div style="display:inline;"><img style="width:40px; border-radius:50%; height:40px;" src="'+profileData.picture+'"></img><span style="font-size: 20px;font-weight: bold;margin-left: 10px;margin-right: 10px;">'+profileData.name+'</span></div');
		        	getVideos(token,'');
		        }
		    };
		    x.send();
					
				//});
		});
	});
	$('body').on('click','.editvideo',function(){
		$('#originalvideoid').val($(this).parent().parent('tr').attr('video-id'));
		$('#originaltitle').val($(this).parent().parent('tr').find('.current-video-title').text());
		$('#originaldesc').val($(this).parent().parent('tr').find('.current-video-description').text());
		$('#tab-list').html('');
		$('div.tab-content').html('');
		$("#translateVideo").hide();
	    $('#translationForm').show();
	    $('html, body').animate({scrollTop:$(document).height()}, 'slow');
	    return false;
	});
	$('body').on('click','#updateVideo',function(){
			if($("ul#tab-list li.active").length){
				var def_lang = "en";
				var token = localStorage.getItem('token');
				var xhr = new XMLHttpRequest();
				var data = {
		        id: $("#originalvideoid").val(),
		        "localizations": {
						  /*[$('#selectlanguage').val()]: {
						   "description": $('#newdesc').val(),
						   "title": $('#newtitle').val()
						  }*/
						 },
		        "snippet": {
		        	"defaultLanguage": $('#detectlanguage').val() ? $('#detectlanguage').val() : def_lang,
						  "title": $('#originaltitle').val(),
						  "description": $('#originaldesc').val(),
						  "categoryId": "1"
						 }
		    };		
		    $("div.tab-content").find("div.tab-pane").each(function(key,val){
		    	data.localizations[$(this).attr('key')] = { title: $(this).find('input').val(), description: $(this).find('textarea').val()};
		    });
		    var json = JSON.stringify(data);
				xhr.open("PUT", "https://content.googleapis.com/youtube/v3/videos?part=localizations%2Csnippet&fields=status&key="+apiKey+"&alt=json", true);
				xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
				xhr.setRequestHeader('Authorization', 'Bearer ' + token);
				xhr.onload = function () {
					console.log (xhr.response);
					if (xhr.readyState == 4 && xhr.status == "200") {
						/*$('#success_update').show();
	        			setTimeout(function(){ $('#success_update').hide(); }, 2000);*/
	        			alert("Your translations have been successfully submitted!");
	        			return false;
					} else {
						console.error(xhr.response);
					}
				}
				xhr.send(json);
			}
	});
	$(document).on("click", "button#translateVideo", function() {
		var source_lan = 'en';
		if($("#detectlanguage").val()){
			source_lan = $("#detectlanguage").val();
		}
		console.log($("ul#tab-list li.active"));
		if($("ul#tab-list li.active").length){
			var target_lan = $("ul#tab-list li.active").attr("key");
			var target_id = $("ul#tab-list li.active").attr("translate-id");
			if(target_lan && target_id){
				translationObjTitle = {
			      sourceLang: source_lan,
			      targetLang: target_lan,
			      textToTranslate: nl2br($("#originaltitle").val(),false)
			    };
			    translate(translationObjTitle,target_id,"title");
			    if($("#originaldesc").val().length<=2500){
			    	translationObjDescription = {
				      sourceLang: source_lan,
				      targetLang: target_lan,
				      textToTranslate: nl2br($("#originaldesc").val(),false)
				    };	
			      	translate(translationObjDescription,target_id,"desc");	
			    }
			}
		}else{
			alert("Please add a target language");
		}
  }).on("click", "button#detectVideo", function() {
    translationObj = {
      textToTranslate: $("#originaltitle").val()
    };

    detect(translationObj);
  });
  $(".nav-tabs").on("click", "a", function (e) {
      e.preventDefault();
      $(this).tab('show');
  }).on("click", "span", function () {
      var anchor = $(this).siblings('a');
      $(anchor.attr('href')).remove();
      $(this).parent().remove();
      console.log($(".nav-tabs li").children('a').first());
      if($(".nav-tabs li").children('a').first().length){
      	$(".nav-tabs li").children('a').first().click();	
      }else{
      	$("#translateVideo").hide();
      }
  });
	$('body').on('click','#addLanguage',function(e){
	    e.preventDefault();
	    if($("#selectlanguage").val()){
	    	var id = $(".nav-tabs").children().length; //think about it ;)
		    var tabId = 'contact_' + $("#selectlanguage").val();
		    $('.nav-tabs').append('<li key="'+$("#selectlanguage").val()+'" translate-id="'+tabId+'"><a href="#contact_' + $("#selectlanguage").val() + '">'+$("#selectlanguage option:selected").text()+'</a> <span> x </span></li>');
		    //$('.tab-content').append('<div class="tab-pane" id="' + tabId + '">Contact Form: New Contact ' + id + '</div>');
		    $('.tab-content').append('<div class="tab-pane" key="'+$("#selectlanguage").val()+'" id="' + tabId + '"><label class="col" for="title-'+$("#selectlanguage").val()+'">Title:</label>\
		    	<input type="text" key="'+$("#selectlanguage").val()+'" id="title-'+$("#selectlanguage").val()+'" class="form-control new-title">\
		    	<label class="col" for="desc-'+$("#selectlanguage").val()+'">Description:</label>\
		    	<textarea style="height:162px;" id="desc-'+$("#selectlanguage").val()+'" class="form-control new-description"></textarea></div>');
		   $('.nav-tabs li:nth-child(' + (id+1) + ') a').click();	
		   $("#translateVideo").show();
	    }
	});
});


 
