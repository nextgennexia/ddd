function renderOffer(id) {
  var
    template,
    $lightboxWrap = $('.lightbox-wrap');

  template = Handlebars.compile($('#offer-templ').html());

  $.each(offers, function (i) {
    if (offers[i].id == id) {
      $lightboxWrap.html(template(offers[i]));
    }
  });

  renderAddMessage('answer');

  $('.js-close-lightbox').on('click', function () {
    $lightboxWrap.toggleClass('hidden');
  });
  $('.lightbox.offer').on('click', offerActionHandler);
  $('.js-comment').on('keypress', commentingHandler);
}

function renderShortOffers() {
  var
    template,
    columns = $('.column'),
    index = 0;

  template = Handlebars.compile($('#offer-plate-templ').html());

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
    template,
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

  template = Handlebars.compile($(sourceSelector).html());
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