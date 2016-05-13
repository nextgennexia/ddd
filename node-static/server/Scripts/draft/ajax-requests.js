var
  offers = [],
  user = {
    fullname: 'Гость',
    avatar: '../../../images/lampa.gif'
  };

$('.login .button').on('click', function () {
  var id = $('.login .field-text').val();

  if (id) {
    getUser(id)
  }
})

getOffersRequest();

function getOffersRequest() {
  $.ajax({
    type: 'GET',
    url: 'offers.json',
    success: function (data) {
      $.each(data, function () {
        offers.push(this);
      });
      renderShortOffers();
    }
  });
}

function offerRefresh() {
  $.ajax({
    type: 'POST',
    data: JSON.stringify(offers),
    url: '/refresh',
    contentType: 'application/json',
    success: function (data) {
      try {
        offers = JSON.parse(data).slice();
      } catch (e) {
        offerRefresh();
      }
    }
  });
}

function getLoggedUserRequest(id) {

  $.ajax({
    type: 'POST',
    data: id,
    url: '/getUser',
    contentType: 'application/json',
    success: function (data) {
      user = data;
      renderLoggedUser();
      renderShortOffers();
    }
  })

 /* $.ajax({
    type: 'GET',
    url: 'users.json',
    success: function (data) {
      $.each(data, function () {
        if (this.id == id) {
          user = this;
        }
      });
      renderLoggedUser();
      renderShortOffers();
    }
  });*/
}