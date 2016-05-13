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