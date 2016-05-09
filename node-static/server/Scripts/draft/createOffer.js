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

      createOffersPlate(offers);
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

      offers.splice(0, offers.length);

      $.each(JSON.parse(data), function () {
        offers.push(this);
      });
    }
  });
}

function createOffer(id) {
  var
      source,
      template;

  source = $('#offer-templ').html();
  template = Handlebars.compile(source);

  $('.js-lightbox-offer').html(template(offers[id]));

  $('.close-lightbox').on('click', function () {
    $('.js-lightbox-offer').toggleClass('hidden');
  });
  $('.lightbox-offer').on('click', socialActionHandler);
  $('.js-comment').on('keypress', addAnswer);
}

function createOffersPlate() {
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

  $('.offer-plate').on('click', socialActionHandler);
  $('.js-comment').on('keypress', addComment);
}

Handlebars.registerHelper('latestComments', function (context, options) {
  var ret = '';
  if (context.length < 3) {
    for (var i = 0; i < context.length; i++) {
      ret = ret + options.fn(context[i]);
    }
  } else {
    for (var i = context.length - 3; i < context.length; i++) {
      ret = ret + options.fn(context[i]);
    }
  }

  return ret;
})