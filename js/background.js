/*var api_url = "https://www.instagram.com/web/search/topsearch/?context=blended&count=1000&query=";
function findEmails(input) {
  var regex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm
  var result = "";
  if(input && input.match(regex)){
  	result = input.match(regex)[0]
  }
  //console.log(result);
  return result;
}
chrome.runtime.onMessage.addListener(function (msg, sender,sendResponse) {
	if ((msg.message === 'GetInfo') && msg.keyword && msg.follow) {
		var follow = msg.follow;
		//sendResponse({status:"success"});
		if(msg.keyword){
			$.ajax({
			    type: "GET",  
			    url: api_url + msg.keyword,
			    success: function(data){  
			        if(data.users.length == 0 || data.users.length){
			        	var return_user_info = [];
			        	if (follow!=0){
			        		for(var i in data.users){
			        			if(follow==1){
			        				if(data.users[i].user.follower_count>0 && data.users[i].user.follower_count<100000)
			        				return_user_info.push(data.users[i]);
			        			}else if(follow==2){
			        				if(data.users[i].user.follower_count>=100000 && data.users[i].user.follower_count<500000)
			        				return_user_info.push(data.users[i]);
			        			}else if(follow==3){
			        				if(data.users[i].user.follower_count>=500000 && data.users[i].user.follower_count<2000000)
			        				return_user_info.push(data.users[i]);
			        			}else if(follow==2){
			        				if(data.users[i].user.follower_count>=2000000 && data.users[i].user.follower_count<10000000)
			        				return_user_info.push(data.users[i]);
			        			}
			        		}
			        	}else {
			        		return_user_info = data.users;
			        	}
			        	for(var j in return_user_info){
			        		//if(return_user_info[j].user.username=="dogs.247"){
			        			var x = 0;
			        			$.ajax({
							        type: 'get',
							        url: "https://www.instagram.com/"+return_user_info[j].user.username+"/",
							        dataType: "html",
							        success: function (data) {
							        	var doc = document.implementation.createHTMLDocument(); // Sandbox
										doc.body.innerHTML = data; // Parse HTML properly
										[].map.call(doc.getElementsByTagName('script'), function(el) {
										    //console.log(el.textContent) ;
										    if(el.textContent.indexOf("window._sharedData")!=-1){
										    	//var users_content = el.textContent.replace("window._sharedData = ","");
										    	var users_content = eval(el.textContent);
										    	for(var k in return_user_info){
										    		if(return_user_info[k].user.username==users_content.entry_data.ProfilePage[0].user.username){
										    			return_user_info[k].user.biography = users_content.entry_data.ProfilePage[0].user.biography ? users_content.entry_data.ProfilePage[0].user.biography.replace(/(\r\n|\n|\r)/gm,"").replace(",",".") : "";
										    			return_user_info[k].user.external_url = users_content.entry_data.ProfilePage[0].user.external_url ? users_content.entry_data.ProfilePage[0].user.external_url : "";
										    			return_user_info[k].user.media = users_content.entry_data.ProfilePage[0].user.media.count ? users_content.entry_data.ProfilePage[0].user.media.count : 0;
										    			return_user_info[k].user.email = findEmails(users_content.entry_data.ProfilePage[0].user.biography);
										    			var total_likes = 0;
										    			var total_comments = 0;
										    			for(var h in users_content.entry_data.ProfilePage[0].user.media.nodes){
										    				total_comments += parseInt(users_content.entry_data.ProfilePage[0].user.media.nodes[h].comments.count);
										    				total_likes += parseInt(users_content.entry_data.ProfilePage[0].user.media.nodes[h].likes.count);
										    			}
										    			return_user_info[k].user.likes = parseInt(total_likes/users_content.entry_data.ProfilePage[0].user.media.nodes.length);
										    			return_user_info[k].user.comments = parseInt(total_comments/users_content.entry_data.ProfilePage[0].user.media.nodes.length);
										    			chrome.runtime.sendMessage({status:"success", data: return_user_info[k]},function(response){
														});
														x++;
														if(x==return_user_info.length){
															chrome.runtime.sendMessage({status:"end"},function(response){
															});
														}
										    		}
										    	}
										    }
										});
							        }
							    });
			        	}	
			        }
			    },
			    error: function(XMLHttpRequest, textStatus, errorThrown) { 
			        alert("Status: " + textStatus); alert("Error: " + errorThrown); 
			    }       
			});
		}
  	}
});*/
			        	
/*chrome.identity.getAuthToken({
    interactive: true
}, function(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    var x = new XMLHttpRequest();
    x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    x.onload = function() {
        alert(x.response);
    };
    x.send();
});*/

chrome.browserAction.onClicked.addListener(function() {
    window.open('html/popup.html');
});



