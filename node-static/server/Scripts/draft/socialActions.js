function socialActionHandler(e) {
  var
    $target = $(e.target),
    $offerPlate = $(this).parent(),
    id = $offerPlate.attr('data-id') - 1;

  if ($target.hasClass('js-like')) {
    offers[id].likes[0].count += 1;
    offerRefresh();
  }

  if ($target.hasClass('js-offer-save')) {
    offers[id].saved[0].count += 1;
    offerRefresh();
  }

  if ($target.hasClass('js-view-comments')) {
    $offerPlate.find('.latest-comments').toggleClass('hidden');
  }
}