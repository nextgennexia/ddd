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
function socialActionHandler(e) {
  var
    $target = $(e.target),
    $offerPlate = $(this),
    id = $offerPlate.attr('data-id') - 1,
    hasAction = false,
    hasPopup = false;

  if ($target.hasClass('js-like')) {
    $.each(offers[id].likes[0].fromUsers, function (i) {
      if (this.userId == user.id) {
        hasAction = true;
        offers[id].likes[0].count -= 1;
        offers[id].likes[0].fromUsers.splice(i, 1);
        offerRefresh();
        createOffersPlate(offers);
        createOffer(id);

        return false;
      }
    });
    if (!hasAction) {
      offers[id].likes[0].count += 1;
      obj = {
        userId: user.id,
        avatar: user.avatar
      }
      offers[id].likes[0].fromUsers.push(obj);
      offerRefresh();
      createOffersPlate(offers);
      createOffer(id);
    }
  }

  if ($target.hasClass('js-offer-save')) {
    $.each(offers[id].saved[0].fromUsers, function (i) {
      if (this.userId == user.id) {
        hasAction = true;
        offers[id].saved[0].count -= 1;
        offers[id].saved[0].fromUsers.splice(i, 1);
        offerRefresh();
        createOffersPlate(offers);
        createOffer(id);

        return false;
      }
    });
    if (!hasAction) {
      offers[id].saved[0].count += 1;
      obj = {
        userId: user.id,
        avatar: user.avatar
      }
      offers[id].saved[0].fromUsers.push(obj);
      offerRefresh();
      createOffersPlate(offers);
      createOffer(id);
    }
  }

  if ($target.hasClass('js-comments')) {
    $offerPlate.find('.latest-comments').toggleClass('hidden');
    $offerPlate.find('.add-comment').toggleClass('hidden');
  }

  if ($target.hasClass('js-answer')) {
    $('.js-lightbox-offer').toggleClass('hidden');
    createOffer(id);
  }

  if ($target.hasClass('view-offer')) {
    $('.js-lightbox-offer').toggleClass('hidden');
    createOffer(id);
  }
}

function addComment(e) {
  if (e.charCode == 13) {
    var
      $offerPlate = $(this).parents('.offer-plate'),
      id = $offerPlate.attr('data-id') - 1;

    obj = {
      userId: user.id,
      avatar: user.avatar,
      comment: this.value
    }

    offers[id].comments[0].count += 1;
    offers[id].comments[0].fromUsers.push(obj);
    offerRefresh();
    createOffersPlate(offers);
  }
}

function addAnswer(e) {
  if (e.charCode == 13) {
    var
      $offerPlate = $(this).parents('.lightbox-offer'),
      id = $offerPlate.attr('data-id') - 1;

    obj = {
      userId: user.id,
      avatar: user.avatar,
      comment: this.value
    }

    offers[id].answers[0].count += 1;
    offers[id].answers[0].fromUsers.push(obj);
    offerRefresh();
    createOffersPlate(offers);
    createOffer(id);
  }
}