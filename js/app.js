//Set a click event listener to the bars icon
$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
    });

//Set a click handler to mark the clicked li
$('ul').on('click', 'li', function() {
    $('li.active').removeClass('active');
    $(this).addClass('active');
});

let map,
infowindow,
locations = [{ //neighborhood locations
    title: 'Abdeen Palace Museum',
    location: {
        lat: 30.047732,
        lng: 31.247303
    }
}, {
    title: 'Mosque of Muhammad Ali',
    location: {
        lat: 30.028611,
        lng: 31.259722
    }
}, {
    title: 'Al-Hussein Mosque',
    location: { 
        lat: 30.047778,
        lng: 31.263056
    }
}, {
    title: 'Al Azhar University',
    location: {
        lat: 30.045833,
        lng: 31.2625
    }
}, {
    title: 'Giza Zoo',
    location: {
        lat: 30.024533,
        lng: 31.213897
    }
}, {
    title: 'Cairo Tower',
    location: {
        lat: 30.045833,
        lng:  31.224444
    }
}];

function initMap() {

    try {
            map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: {
                lat: 30.044444,
                lng: 31.235833
            }
            });
        } catch(err) {
            alert('Uh oh! The google map request failed');
        }

    locations.forEach(function(loc) {
        loc.marker = new google.maps.Marker({
            position: loc.location,
            title: loc.title,
            map: map,
        });

        infowindow = new google.maps.InfoWindow();
        loc.marker.addListener('click', function(){
            let  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc.title + '&format=json&callback=wikiCallback';
            $.ajax(wikiURL,{
                dataType: "jsonp",
                data: {
                  async: true
                }
              }).done(function(response) {
                let  URL = 'http://en.wikipedia.org/wiki/' + response[1];
                infowindow.setContent('<div>' +
                  '<h4>' + loc.title + '</h4>' + '</div><br><a href ="' + URL + '" target="_blank">' + URL + '</a><hr>');
                infowindow.open(map, loc.marker);
              }).fail(function(jqXHR, textStatus) {
                infowindow.setContent('<div>' +
                  '<h4>' + loc.title + '</h4>' + '</div><br><p>Sorry. We could not contact Wikipedia! </p><hr>');
                  infowindow.open(map, loc.marker);
              });
            loc.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                loc.marker.setAnimation(null);
              }, 2000);
        });
    });

    ko.applyBindings(new ViewModel());
}//end of initMap()

let Loc = function(data) {
    this.title = data.title;
    this.location = data.location;
    this.marker = data.marker;
};

let ViewModel = function() {
    let self = this;

    self.listLoc = ko.observableArray();

    locations.forEach(function(locItem) {
    self.listLoc.push(new Loc(locItem));
    });

    self.filter = ko.observable('');

    self.filteredItems = ko.computed(function() {
        let filter = self.filter().toLowerCase();
        if (!filter) {
            ko.utils.arrayForEach(self.listLoc(), function (item) {
                item.marker.setVisible(true);
            });
            return self.listLoc();
        } else {
            return ko.utils.arrayFilter(self.listLoc(), function(item) {
                // set all markers visible (false)
                let result = (item.title.toLowerCase().search(filter) >= 0);
                item.marker.setVisible(result);
                return result;
            });
        }
    });



    self.setLoc = function(clickedLoc) {
        let  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + clickedLoc.title + '&format=json&callback=wikiCallback';
        $.ajax(wikiURL,{
            dataType: "jsonp",
            data: {
              async: true
            }
          }).done(function(response) {
            let  URL = 'http://en.wikipedia.org/wiki/' + response[1];
            infowindow.setContent('<div>' +
              '<h4>' + clickedLoc.title + '</h4>' + '</div><br><a href ="' + URL + '" target="_blank">' + URL + '</a><hr>');
            infowindow.open(map, clickedLoc.marker);
          }).fail(function(jqXHR, textStatus) {
            infowindow.setContent('<div>' +
              '<h4>' + clickedLoc.title + '</h4>' + '</div><br><p>Sorry. We could not contact Wikipedia! </p><hr>');
              infowindow.open(map, clickedLoc.marker);
          });
        clickedLoc.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            clickedLoc.marker.setAnimation(null);
          }, 2000);
    };
};