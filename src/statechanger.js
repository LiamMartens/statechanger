var State = {
    url: window.location.origin,
    ignore_head: false,
    update_selector: "body",
    stateObject: function(_state) {
        //constructor
        this.state = _state;
        this.path = State.url+'/'+this.state;

        this.ignore_head = false;
        this.update_selector = "body";
        this.update_url = true;

        this.ignoreHead = function() {
            this.ignore_head = true;
            return this;
        }

        this.updateHead = function() {
            this.ignore_head = false;
            return this;
        }

        this.updateSelector = function(selector) {
            this.update_selector = selector;
            return this;
        }
        //
        this.xhr = new XMLHttpRequest();
        this.xhr.open('GET', this.state);
        //send
        this.load = function(update_url) {
            if(update_url==false) this.update_url=false;
            this.xhr.send();
        }
        //success
        this.success = function(callback) {
            //
            // callback(response)
            //
            this.xhr.addEventListener('readystatechange', (function() {
                if((this.xhr.readyState==4)&&(this.xhr.status==200)) {
                    this.callback.call(this.callback, this.xhr.response);
                }
            }).bind({
                xhr: this.xhr,
                callback: callback
            }));
            return this;
        }
        this.error = function(callback) {
            //
            // callback(xhr, response)
            //
            this.xhr.addEventListener('readystatechange', (function() {
                if((this.xhr.readyState==4)&&(this.xhr.status!=200)) {
                    this.callback.call(this.callback, this.xhr, this.xhr.response);
                }
            }).bind({
                xhr: this.xhr,
                callback: callback
            }));
            return this;
        }
        this.parse = function(response) {
            var html = document.createElement('html');
            html.innerHTML = response;
            if(!this.ignore_head) document.querySelector('head').innerHTML = html.querySelector('head').innerHTML;
            document.querySelector(this.update_selector).innerHTML = html.querySelector(this.update_selector).innerHTML;
            //update location
            if(this.update_url==true) {
                if(window.history) {
                    window.history.pushState(this.state, document.querySelector('head title').innerText, this.path)
                } else { window.location = this.path; }
            }
            //execute scripts
            var scripts = Array.prototype.slice.call(document.querySelectorAll('body script'));
            if(!this.ignore_head) {
                scripts.concat(Array.prototype.slice.call(document.querySelectorAll('head script')));
            }
            for(var i = 0; i < scripts.length; i++) {
                //dont reload statechanger
                if(!scripts[i].hasAttribute('statechanger')) {
                    var new_script = document.createElement('script');
                    for(var j = 0; j < scripts[i].attributes.length; j++) {
                        new_script.setAttribute(scripts[i].attributes[j].nodeName, scripts[i].attributes[j].nodeValue)
                    }
                    new_script.innerHTML = scripts[i].innerHTML;
                    scripts[i].parentNode.replaceChild(new_script, scripts[i]);
                }
            }
        }
    },
    goto: function(_state) {
        var obj = new State.stateObject(_state);
        if(State.ignore_head) st.ignoreHead();
        st.updateSelector(State.update_selector);
        obj.success(obj.parse.bind(obj));
        return obj;
    },
    initialize: function() {
        window.addEventListener('popstate', function(event) {
            var st = State.goto(event.currentTarget.location.pathname.trim('/'));
            if(State.ignore_head) st.ignoreHead();
            st.updateSelector(State.update_selector);
            st.load(false);
        });
    }
}
State.initialize();
