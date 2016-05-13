function renderOffer(id) {
  var
      source,
      template;

  source = $('#offer-templ').html();
  template = Handlebars.compile(source);

  for (var i = 0; i < offers.length; i++) {
    if (offers[i].id == id) {
      $('.lightbox-wrap').html(template(offers[i]));
    }
  }

  renderAddMessage('answer');

  $('.js-close-lightbox').on('click', function () {
    $('.lightbox-wrap').toggleClass('hidden');
  });
  $('.lightbox.offer').on('click', offerActionHandler);
  $('.js-comment').on('keypress', commentingHandler);
}

function renderShortOffers() {
  var
    source,
    template,
    columns = $('.column'),
    index = 0;

  source = $('#offer-plate-templ').html();
  template = Handlebars.compile(source);

  $.each(columns, function (i) {
    $(this).html('');
  });

  while (index < offers.length) {
    $.each(columns, function (i) {
      $(this).append(template(offers[index]));
      index += 1;
      if (index >= offers.length) return false;
    });
  }
  renderAddMessage('comment');

  $('.offer-plate').on('click', offerActionHandler);
  $('.js-comment').on('keypress', commentingHandler);

}

function renderAddMessage(subject) {
  var
  source,
  template,
  index = 0,
  sourceSelector,
  containerSelector;

  switch (subject) {
    case 'comment':
      sourceSelector = '#add-comment-templ';
      containerSelector = '.add-comment';
    break;
    case 'answer':
      sourceSelector = '#add-answer-templ';
      containerSelector = '.add-answer';
      break;
    default:
      return false;
  }

  source = $(sourceSelector).html();
  template = Handlebars.compile(source);

  $(containerSelector).append(template(user));
}

function renderLoggedUser() {
  var
  source,
  template;

  source = $('#user-plate-templ').html();
  template = Handlebars.compile(source);

  $('.login-wrap .author').html(template(user));
}