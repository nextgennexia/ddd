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