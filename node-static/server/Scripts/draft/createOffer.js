var offers = [];
getOffers();

function getOffers() {
  $.ajax({
    type: 'GET',
    url: 'offers.json',
    success: function (data) {
      $.each(data, function () {
        offers.push(this);
      });

      createOffers(offers);
    }
  });
}

function createOffers(offers) {
  var
    source,
    template;

  source = $('#offer-plate-templ').html();
  template = Handlebars.compile(source);

  var columns = $('.column');
  var columnACountOffers = [];

  var index = 0;

  jQuery.each(columns, function (i) {
    $(this).html('');
  });

  while (index < offers.length) {
    jQuery.each(columns, function (i) {
      if (index >= offers.length) {
        return false;
      }
      columnACountOffers[i] = $(this).find('.offer-plate').length;

      $(this).append(template(offers[index]));
      index += 1;
    });
  }

  $('.social-actions').on('click', socialActionHandler);
}

function offerRefresh() {
  $.ajax({
    async: false,
    type: 'POST',
    data: JSON.stringify(offers),
    url: '/refresh',
    contentType: 'application/json',
    success: function (data) {
      createOffers(JSON.parse(data));
    }
  });
}