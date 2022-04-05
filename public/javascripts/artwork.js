    function findTags(){
        let tags = document.getElementsByClassName('form-check-input');
        let string = "";
        for(i = 0; i < tags.length; i++){
            let tag = tags[i];
            if(tag.checked){ 
                string = string !== "" ? string + "+" + tag.value : tag.value;
            }
        }

        console.log('string')
        return string;
    }

    function searchByParams(){
        let searchParams = new URLSearchParams(window.location.search);
        let search = document.getElementById('search').value
        let tags = findTags();
        console.log('here');
        console.log(tags);
        
        if(search){
            searchParams.set('search', search) 
        }
        else{ return; }
        
        if(tags){
            searchParams.set('tags', tags); 
        }
        
        window.location.search = searchParams.toString();
    }

    function addUrlParameter(name, value) {
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set(name, value);
    }

    function deleteSort(){
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('sort');
        window.location.search = searchParams.toString();
    }

    function pagination(page_number){
        let location = window.location.href;
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        console.log(params);

        let search_string = "";

        for (parameter in params) {
            if (params.hasOwnProperty(parameter)) {
                if(!search_string === ""){search_string += "&"}
                search_string += parameter + "=" + params[parameter];
            }


        }

        console.log("/artwork/" + page_number + "?" + search_string);
        window.location.href = "/artwork/" + page_number + "?" + search_string;
    }
