import Fuse from fuse.js;



module.exports = [
    function searchValue(keywords, data){
        //console.log(keywor)
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['art_title', 'art_creator', 'art_type']
        }
        console.log('here1');
        
        const search_fuse = new Fuse(data, options);
        console.log('here2');
        const result = search_fuse.search(keywords);
        console.log('here3');
        console.log(result);
        console.log('here4');
        return result;
    }
]