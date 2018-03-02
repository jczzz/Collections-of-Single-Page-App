//export default 一个对象，have a function called search
export default {
    search: function(searchTerm, searchLimit, sortBy) {
      return fetch(
        `http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
      )
        .then(res => res.json())
        .then(data => {
          return data.data.children.map(data => data.data);
        })
        .catch(err => console.log(err));
    }
  };