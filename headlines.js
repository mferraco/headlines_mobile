var first = true;

var name = "HEADLINES"

var nfl = "on";
var nba = "on";
var mlb = "on";
var nhl = "on";

//listens if the customized page is being shown which then is recorded in the 'first' variable
$(document).delegate('#customize', 'pagebeforeshow', function (event) {
	first = false;
});

//changes name on home screen if already logged in
function changeName(change)
{
	name = change;
	$("#home-head").html(name);
	$("#login").hide();
	$("#basic").hide();
}

//listens to see if the intro page is being shown and decides which collapsible elements to show
$(document).delegate('#intro', 'pagebeforeshow', function (event) {
	// Let the framework know we're going to handle the load.
	
	event.preventDefault();
	
	//updates name on home screen and deletes login if already logged in
	$("#home-head").html(name);
	if (name != "HEADLINES")
	{
		$("#login").hide();
		$("#basic").hide();
	}
	
	if (!first) {
		nfl = getUrlParams("nfl-check");
		nba = getUrlParams("nba-check");
		mlb = getUrlParams("mlb-check");
		nhl = getUrlParams("nhl-check");
	}
	
	
	if (nfl == "on")
		$('#nflcollapsible').show();
	else
		$('#nflcollapsible').hide();
		
	if (nba == "on")
		$('#nbacollapsible').show();
	else
		$('#nbacollapsible').hide();
		
	if (mlb == "on")
		$('#mlbcollapsible').show();
	else
		$('#mlbcollapsible').hide();
		
	if (nhl == "on")
		$('#nhlcollapsible').show();
	else
		$('#nhlcollapsible').hide();
});

function getUrlParams(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results != null) {
		return results[1] || 0; 
	}
}


//function to get headlines and display them
function getHeadlines(param) {
	
	//variables that will make up the end of the ajax request url
	var resource = "";
	var method = "";
	
	//set up rest of url for ajax request
	if (param == null) {
		resource = "/sports";
		method =  "/news/headlines/top";
	}
	else if (param == "nfl") {
		resource = "/sports/football/nfl";
		method =  "/news/headlines";
	}
	else if (param == "mlb") {
		resource = "/sports/baseball/mlb";
		method =  "/news/headlines/top";
	}
	else if (param == "nba") {
		resource = "/sports/basketball/nba";
		method =  "/news/headlines/top";
	}
	else if (param == "nhl") {
		resource = "/sports/hockey/nhl";
		method =  "/news/headlines/top";
	}
	
	//ajax request to get headlines data from espn
	$.ajax({
		
		url: "http://api.espn.com/v1" + resource + method,
		data: {
			apikey: "m8yucehyj73jwydwn5nyvbpg",
			_accept: "jsonp",
			limit: 15
		},
		dataType: "jsonp",
		crossDomain: true,
		
		//get headlines and display link with headline title
		//each title is a link to espn where the user can read the full article
		success: function(data) {
			$('#headlines').empty();
			$.each(data.headlines, function() {
				var a = "<a href='" + this.links.mobile.href +"' data-transition='slide' class='ui-link-inherit'>" + this.linkText + "<a/>";
				var li = $('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-corner-top ui-btn-up-c"><div class="ui-btn-inner ui-li ui-corner-top"><div class="ui-btn-text">' + a + '</div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
				$('#headlines').append(li)
			});
			//set the header
			$('#all-head').html("All Headlines for " + param.toUpperCase());
		},
		error: function() {
			console.log("error");
		}
	});
} 

//list all of the teams for a particular sport
function listTeams(sport) {

	//variable to hodl the end of the ajax request url
	var end = "";
	
	//set upt he rest of the url
	if (sport == "nfl") {
		end = "football/nfl/teams";
	}
	else if (sport == "mlb") {
		end = "baseball/mlb/teams";
	}
	else if (sport == "nba") {
		end = "basketball/nba/teams";
	}
	else if (sport == "nhl") {
		end = "hockey/nhl/teams";
	}
	
	//ajax request to get teams from espn
	$.ajax({
		
		url: "http://api.espn.com/v1/sports/" + end,
		data: {
			apikey: "m8yucehyj73jwydwn5nyvbpg",
			_accept: "jsonp",
		},
		dataType: "jsonp",
		crossDomain: true,
		
		//set up list of teams
		success: function(data) {
			$('#teamList').empty();
			
			var idArray = [];
			
			//set up the array of necessary data on the teams (name, location, id, color)
			$.each(data.sports[0].leagues[0].teams, function() {
				idArray.push({'name' : this.location + " " + this.name, 'id' : this.id, 'color' : this.color});
			});
			
			//sort function to sort the array
			function sortFunction(a, b) {
					if (a.name < b.name)
						return -1
					else if (a.name > b.name)
						return 1
					else
						return 0
			}
			
			//sort the array by location, name
			idArray.sort(sortFunction);
			
			count = 0;
			
			//set up list of teams
			$.each(idArray, function() {
			
				var sportName = data.sports[0].name;
				var leagueAbbrev = data.sports[0].leagues[0].abbreviation;
				var team = idArray[count].id;
				var teamName = idArray[count].name;
				var color = idArray[count].color;
				
				var a = "<a href='#teamHeadlinesPage' data-transition='slide' class='ui-link-inherit' onclick = \"getTeamHeadlines('" + sportName + "', '" + leagueAbbrev + "', '" + team + "', '" + teamName + "')\">" + this.name + "<a/>";
				var li = $('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-corner-top ui-btn-up-c"><div class="ui-btn-inner ui-li ui-corner-top"><div class="ui-btn-text">' + a + '</div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
				$('#teamList').append(li)
				
				count++;
			});
			//set the pages header
			$('#team-list-head').html(sport.toUpperCase() + "Teams");
		},
		error: function() {
			console.log("error");
		}
	});

}

//get the headlines for a specific team
function getTeamHeadlines(sportName, leagueAbbrev, team, teamName) {

	//ajax request to get data from espn
	$.ajax({
		
		url: "http://api.espn.com/v1/sports/" + sportName + "/" + leagueAbbrev + "/teams/" + team + "/news",
		data: {
			// enter your developer api key here
			apikey: "m8yucehyj73jwydwn5nyvbpg",
			// the type of data you're expecting back from the api
			_accept: "jsonp",
		},
		dataType: "jsonp",
		crossDomain: true,
		
		//set up list of team's headlines
		success: function(data) {
			$('#teamHeadlines').empty();
			$.each(data.headlines, function() {
				var a = "<a href='" + this.links.mobile.href +"' data-transition='slide' class='ui-link-inherit'>" + this.linkText + "<a/>";
				var li = $('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-corner-top ui-btn-up-c"><div class="ui-btn-inner ui-li ui-corner-top"><div class="ui-btn-text">' + a + '</div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
				$('#teamHeadlines').append(li)
			});
			//set header for the page
			$('#team-head').html(teamName);
		},
		error: function() {
			console.log("error");
		}
	});

}

//javascript for pop out panel when clicking "Quick Links"
$( "#popupPanel" ).on({
    popupbeforeposition: function() {
        var h = $( window ).height();

        $( "#popupPanel" ).css( "height", h );
    }
});



