$(document).ready(function(){
    //jQuery event method on()
    //(e)=>  ???
    $('#searchForm').on('submit', (e)=>{
        let searchText =$('#searchText').val();
        getMoives(searchText);
        e.preventDefault();
    })
})


function getMoives(searchText){
    // test: console.log(searchText);
    /*The Open Movie Database
      The OMDb API is a RESTful web service to obtain movie information, 
      all content and images on the site are contributed and maintained 
      by our users. 
 
      Axios for making HTTP requests to the OMDb API. */
	  //请求数据， 接收数据，处理数据，生成mockup内容
    axios.get('http://www.omdbapi.com/?apikey=thewdb&s='+ searchText) 
         .then((response)=>{
            console.log(response);
            let movies= response.data.Search;
            // movies 数组
            console.log(movies);
            let output = "";
            //jQuery go throuh遍历 数组movies
            $.each(movies,function(index,movie){
				//注意： This is a backtick 左上角. Backtick is not a quotation sign. 
                 output += `
       	   <div class="col-md-3 ">
       	      <div class="well text-center pops">
       	        <img src="${movie.Poster}" >
       	        <h5 style="color:#eb6e80">${movie.Title}</h5>
       	        <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary " href="#">Movie Details </a>
       	      </div>
       	   </div>
       	   `
            });
            //html() 返回所选元素的内容（包括 HTML 标记）
			//display the generated content
            $('#movies').html(output);
         })
         .catch(function(err){
             console.log(err);
         })
}

function movieSelected(id){
    sessionStorage.setItem('movieId',id);
	//jump to movie.html
    window.location='movie.html';
    return false;
}

function getMoive(){
    let movieId = sessionStorage.getItem('movieId');
    console.log(movieId);
    // 同样请求数据，接收数据，处理数据，生成内容
	//下面的get 无法运行
    axios.get('http://www.omdbapi.com/?apikey=thewdb&i='+ movieId)
    .then((response)=>{
        console.log(response);
        let movie = response.data;
        let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
     .catch(function(err){
         console.log(err);
     })
}