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