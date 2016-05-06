createOffers();
function createOffers() {

  $.ajax({
    type: 'GET',
    url: 'offers.json',
    success: function (data) {

       var
        source,
        template;

      source = $('#offer-plate-templ').html();
      template = Handlebars.compile(source);
      var ss = template(data);

      var columns = $('.column');
      var columnACountOffers = [];

      var index = 0;

      while (index < data.offers.length) {
        jQuery.each(columns, function (i) {
          if (index >= data.offers.length) {
            return false;
          }
          columnACountOffers[i] = $(this).find('.offer-plate').length;

          $(this).append(template(data.offers[index]));
          index += 1;
        });
      }
    }
  });
}