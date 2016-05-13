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



function offerActionHandler(e) {
  var
    $target = $(e.target),
    button = $target.attr('data-button'),
    offer = new Offer(this);

  switch (button) {
    case 'like':
      offer.like();
      break;
    case 'save':
      offer.save();
      break;
    case 'viewComment':
      offer.viewComment($target);
      break;
    case 'openOfferLightbox':
      offer.openofferLightbox();
      break;
    case 'removeComment':
      offer.removeComment($target.parents('.author'));
      break;
    case 'removeAnswer':
      offer.removeAnswer($target.parents('.author'));
      break;
    case 'removeOffer':
      offer.removeOffer();
      break;
  }
}

function commentingHandler(e) {
  if (e.charCode == 13) {
    if ($(this).parents('.offer-plate').length) {
      new Offer($(this).parents('.offer-plate')).addComment(this.value);
    }
    if ($(this).parents('.lightbox.offer').length) {
      new Offer($(this).parents('.lightbox.offer')).addAnswer(this.value);
    }
  }
}

function Offer(self) {
  var
    $offerPlate = $(self),
    offerId = $offerPlate.attr('data-id'),
    hasAction = false;

  this.like = function () {
    $.each(offers[offerId].likes[0].fromUsers, function (i) {
      if (this.userId == user.id) {
        hasAction = true;
        offers[offerId].likes[0].count -= 1;
        offers[offerId].likes[0].fromUsers.splice(i, 1);
        offerRefresh();
        renderShortOffers();
        renderOffer(offerId);

        return false;
      }
    });
    if (!hasAction) {
      offers[offerId].likes[0].count += 1;
      obj = {
        userId: user.id,
        avatar: user.avatar
      }
      offers[offerId].likes[0].fromUsers.push(obj);
      offerRefresh();
      renderShortOffers();
      renderOffer(offerId);
    }
  }

  this.save = function () {
    $.each(offers[offerId].saved[0].fromUsers, function (i) {
      if (this.userId == user.id) {
        hasAction = true;
        offers[offerId].saved[0].count -= 1;
        offers[offerId].saved[0].fromUsers.splice(i, 1);
        offerRefresh();
        renderShortOffers();
        renderOffer(offerId);

        return false;
      }
    });
    if (!hasAction) {
      offers[offerId].saved[0].count += 1;
      obj = {
        userId: user.id,
        avatar: user.avatar
      }
      offers[offerId].saved[0].fromUsers.push(obj);
      offerRefresh();
      renderShortOffers();
      renderOffer(offerId);
    }
  }

  this.viewComment = function ($target) {
    $offerPlate.find('.latest-comments').toggleClass('hidden');
    $offerPlate.find('.add-comment').toggleClass('hidden');
    $offerPlate.find('.add-answer').toggleClass('hidden');
    $target.toggleClass('active');
  }

  this.openofferLightbox = function () {
    $('.lightbox-wrap').toggleClass('hidden');
    renderOffer(offerId);
  }

  this.addComment = function (comment) {
    var currentId;

    if (!offers[offerId].comments[0].count) {
      currentId = 0
    } else {
      currentId = offers[offerId].comments[0].fromUsers[offers[offerId].comments[0].fromUsers.length - 1].id + 1;
    }

    obj = {
      id: currentId,
      userId: user.id,
      avatar: user.avatar,
      comment: comment
    }

    offers[offerId].comments[0].count += 1;
    offers[offerId].comments[0].fromUsers.push(obj);
    offerRefresh();
    renderShortOffers();
  }

  this.addAnswer = function (answer) {
    var currentId;

    if (!offers[offerId].answers[0].fromUsers.length) {
      currentId = 0
    } else {
      currentId = offers[offerId].answers[0].fromUsers[offers[offerId].answers[0].fromUsers.length - 1].id + 1;
    }

    obj = {
      id: currentId,
      userId: user.id,
      avatar: user.avatar,
      comment: answer
    }

    offers[offerId].answers[0].count += 1;
    offers[offerId].answers[0].fromUsers.push(obj);
    offerRefresh();
    renderShortOffers();
    renderOffer(offerId);
  }

  this.removeComment = function ($commentElem) {
    var
      comments = offers[offerId].comments[0].fromUsers,
      commentId = $commentElem.attr('data-id'),
      removedComment = [];

    for (var i = 0; i < comments.length; i++) {
      if (comments[i].id == commentId) {
        removedComment.push(comments[i]);
        offers[offerId].comments[0].count -= 1;
        comments.splice(i, 1);
      }
    }

    $commentElem.remove();
    offerRefresh();
  }

  this.removeAnswer = function ($answerElem) {
    var
      answers = offers[offerId].answers[0].fromUsers,
      answerId = $answerElem.attr('data-id')
      removedAnswer = [];

    for (var i = 0; i < answers.length; i++) {
      if (answers[i].id == answerId) {
        removedAnswer.push(answers[i]);
        offers[offerId].answers[0].count -= 1;
        answers.splice(i, 1);
      }
    }

    $answerElem.remove();
    offerRefresh();
  }

  this.removeOffer = function () {
    var removedOffer = [];

    for (var i = 0; i < offers.length; i++) {
      if (offers[i].id == offerId) {
        removedOffer.push(offers[i]);
        offers.splice(i, 1);
      }
    }
    $('.lightbox-wrap').toggleClass('hidden');
    $('.offer-plate[data-id="' + offerId + '"]').remove();
    offerRefresh();
  }
}
Handlebars.registerHelper('latestComments', function (context, options) {
  var
    ret = '',
    i,
    comment;

  if (context.length < 5) {
    for (i = 0; i < context.length; i++) {
      comment = context[i].comment;

      if (context[i].comment.length > 40) {
        context[i].comment = context[i].comment.slice(0, 40) + '...';
      }

      ret += options.fn(context[i]);
      context[i].comment = comment;
    }
  } else {
    for (i = context.length - 5; i < context.length; i++) {
      comment = context[i].comment;

      if (context[i].comment.length > 40) {
        context[i].comment = context[i].comment.slice(0, 40) + '...';
      }

      ret += options.fn(context[i]);
      context[i].comment = comment;
    }
  }

  return ret;
})

Handlebars.registerHelper('latestAnswers', function (context, options) {
  var
    ret = '',
    i;

  if (context.length < 3) {
    for (i = 0; i < context.length; i++) {
      ret += options.fn(context[i]);
    }
  } else {
    for (i = context.length - 3; i < context.length; i++) {
      ret += options.fn(context[i]);
    }
  }

  return ret;
})

Handlebars.registerHelper('close', function (context, options) {
  var ret;

  if (context && context == user.id) {
    ret = options.fn(context)
  }
  return ret;
})

Handlebars.registerHelper('like', function (context, options) {
  var
    ret,
    i;

  for (i = 0; i < context.length; i++) {
    if (context[i].userId == user.id) {
      context.liked = 'active';
    }
  }

  ret = options.fn(context)
  delete context.liked;

  return ret;
})

Handlebars.registerHelper('removeOffer', function (context, options) {
  var
    ret,
    i;

  for (i = 0; i < context.length; i++) {
    if (context[i].userId != user.id) {
      context.hidden = 'hidden';
    }
  }

  ret = options.fn(context)
  delete context.hidden;

  return ret;
})

Handlebars.registerHelper('save', function (context, options) {
  var
    ret,
    i;

  for (i = 0; i < context.length; i++) {
    if (context[i].userId == user.id) {
      context.saved = 'active';
    }
  }
  
  ret = options.fn(context)
  delete context.saved;


  return ret;
})

Handlebars.registerHelper('hasCount', function (context, options) {
  var ret;

  if (context != 0) {
    ret = options.fn(context)
  }

  return ret;
})
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