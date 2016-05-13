var
  offers = [],
  user = {
    fullname: 'гость',
    avatar: '../../../images/lampa.gif'
  };

$('.login .button').on('click', function () {
  var id = $('.login .field-text').val();
  if (id) {
    getUser(id)
  }
})

getOffers();

function getOffers() {
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
    async: false,
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

function getUser(id) {
  $.ajax({
    type: 'GET',
    url: 'users.json',
    success: function (data) {
      $.each(data, function () {
        if (this.id == id) {
          user = this;
        }
      });
      renderShortOffers();
      renderLoggedUser();
    }
  });
}