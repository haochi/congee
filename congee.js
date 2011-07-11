;(function(){
  var routes = [], functions = {}, params = {}, param_parsed = false,
      before_fn, after_fn, default_fn, loc = window.location, 
      default_opts = {go_on: false, raw: false};

  function extend(default_opts, user_opts){
    if(user_opts){
      for(var name in user_opts)
        default_opts[name] = user_opts[name];
    }
    return default_opts;
  }
  window.Congee = {
    defaults: function(fn){ default_fn = fn; return this; },
    before: function(fn){ before_fn = fn; return this; },
    after: function(fn){ after_fn = fn; return this; },
    param: function(param){
      if(!param_parsed){
        var search = loc.search.substring(1).split("&");
        for(var i=0, len = search.length; i<len; i++){
          var str = search[i], index = str.indexOf("="), name, val;
          if(index < 0){
            index = str.length;
            val = null;
          }else{
            val = decodeURIComponent(str.slice(index+1).replace(/\+/g, " "));
          }
          name = str.slice(0, index);
          if(name.slice(-2) == "[]"){
            // name = name.slice(0,-2); // uncomment if you don't want "a[]" and "a" both be available
            if(!(name in params))
              params[name] = [];
            params[name].push(val);
          }else{
            params[name] = val;
          }
        }
        param_parsed = true;
      }
      return params[param];
    },
    add: function(route, fn, opts){
      if(route instanceof RegExp)
        route = route.source;
      routes.push(route);
      functions[route] = {fn: fn, opts: extend(default_opts, opts)};
      return this;
    },
    run: function(){
      var path = loc.pathname.substring(1), called = false;
      before_fn && before_fn.apply(this);
      for(var i=0, len = routes.length; i<len; i++){
        var route = routes[i], match, match_str, matching_route = functions[route];
        match_str = matching_route.opts.raw ? route : "^"+route+"\\/?$";
        match = path.match(new RegExp(match_str));
        if(match){
          matching_route.fn.apply(this, match.slice(1));
          called = true;
          if(!matching_route.opts.go_on)
            break;
        }
      }
      if(!called && default_fn)
        default_fn.apply(this);
      after_fn && after_fn.apply(this);
    }
  };
})();