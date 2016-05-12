#Statechanger
Statechanger is a simple JS script to load in pages through Ajax

##Usage
###Include the file
Add the file at the end of your page
```
    <script type="text/javascript" src="statechanger.js" statechanger></script>
```
Make sure to add the `statechanger` attribute

###Set configuration
You can set these 2 state wide configurations
```
    State.update_head = true;
    State.update_selector = "body"
```
These will be applied to all `State.goto` calls. The `update_head` settings specifies whether to replace the `head` and the `update_selector` specifies what element needs to be replaced apart from head. These settings can be important as these are also applied to the `onpopstate` event.

###Simple
Let's say we want to load in `page.html`
```
    State.goto('page.html').load()
```
This will load the `page.html` file, replace the `head` and the `body` and reload/reexecute the `script` tags.

###Option
We can also specify the settings at this level
```
    State.goto('page.html').ignoreHead().updateSelector('#replace').load();
```

And we can also tell the script to not set a new URL by adding `false` to the `load()` function
```
    State.goto('page.html').load(false);
```

###Callbacks
There is also the possibility to set custom `success` and `error` callbacks
```
    State.goto('page.html').success(function(response) {
        //own code
    }).error(function(xhr, response) {
        //own code
    }).load();
```
