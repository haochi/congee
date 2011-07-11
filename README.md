You can speed up your website using Congee by executing only the Javascript code that the web page needs through URL-matching, it also helps you to keep your code for different sections of the site separate.

## Get Started
To get started, grab a copy of [http://code.google.com/p/congee/source/browse/trunk/congee.js Congee] and include it in your page/template.

`<script src="/path_to/congee.js" type="text/javascript"></script>`

Obviously, it would be better if you have some sort of code combiner/compressor that serves all script files in one file, but that's to get you started.

### Example

Suppose you have a e-commerce site and you want to execute different codes on the user account pages and product pages, instead of having:

    $("#account_page input").validate();
    $("#account_page img").magnifiable();
    $("#account_page #search").fix_global_warming();
    ...
    $("#product_page .fancy_pictures").fancybox();
    $("#product_page #search").do_the_rain_dance();
    ...
    // Google Analytics

you can do:

    Congee.add("account", function(){
      $("input").validate();
      $("img").magnifiable();
      $("#search").fix_global_warming();
    });
    Congee.add("product/(\\d+)", function(product_id){
      $(".fancy_pictures").fancybox();
      $("#search").do_the_rain_dance();
    }).after(function(){
      // Google Analytics
    });
    Congee.run();

You can chain it, you don't have to chain it, it's up to you.

### Methods

#### `add(path, function[, options])`
This method adds a path for the Congee object to evaluate when you [#run() run()] it. The path parameter can be a string or a RegExp object. Since the path will be evaluated as a regular expression and because of this, if you want to pass in a regular expression as a string, you need to be careful with the [https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp#Description backslash].

You can pass an object to this method to modify its behavior. There are two options currently, `go_on` and `raw`. By default, Congee will stop after it finds the first match, by passing in `{"go_on": true}` you can overwrite this behavior (a better name for this would be "continue", but that's a Javascript keyword and IE doesn't like it). When you add a path to Congee, by default it will be replaced with `RegExp("^"+your_path+"\/?$")`. So by passing in `{"raw": true}` you can overwrite that.

The paths will be evaluated in the order that you `add` them.

Example:

    Congee.add("blog", function(){ /* your code here */ });
    Congee.add(/^blog\/post\//, function(){ /* uses the raw option and it will continue executing */ }, {raw: true, go_on: true}); 
    Congee.add("blog/post/([\\w-]+)", function(){ /* your code here */ });
    Congee.add(/blog\/post\/([\w-]+)/, function(){ /* same thing as above, but passes in as a RegExp object instead */ });

    Congee.add("blog/page/([\\w-]+)", function(slug){
      // you can do something with the slug here, it's derived from the path
    });

#### `after(function)`
This will add code to be executed after everything in Congee is executed.

    Congee.after(function(){
      // Google Analytics
    });

#### `before(function)`
Similar to `after()`, it executes before hand.

#### `defaults(function)`
It will add code to be executed if no paths you added matches the page URL.

#### `param(key)`
This is a helper method that will return the value of the search query in the URL (i.e. window.location.search).

    // For the search string `?a=apple&b[]=beatles&b[]=bono&c&d=`
    Congee.param("a") // returns "apple"
    Congee.param("b") // returns undefined
    Congee.param("b[]") // returns ["beatles", "bono"]
    Congee.param("c") // returns null
    Congee.param("d") // returns ""
    Congee.param("e") // returns undefined

#### `run()`
This will execute Congee.

    Congee.add("", function(){
      // code for home page
    }).run();
