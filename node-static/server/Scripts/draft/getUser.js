var user = [];
$('.login .button').on('click', function () {
  var id = $('.login .field-text').val();
  if (id) {
    getUser(id)
  }
})

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
      createOffersPlate(offers);
    }
  });
}