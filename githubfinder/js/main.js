$(document).ready(function(){
    $('#searchUser').on('keyup', function(e){
      let username = e.target.value;
  
      // Make request to Github
      $.ajax({
        url:'https://api.github.com/users/'+username,
        data:{
          client_id:'f0ee70c58cbf6237d402',
          client_secret:'f757810dc44e218eaba5e1d5b35bcd833836d84d'
        }
      }).done(function(user){
       // console.log(user); 查看user object
        $.ajax({
          url:'https://api.github.com/users/'+username+'/repos',
          data:{
            client_id:'f0ee70c58cbf6237d402',
            client_secret:'f757810dc44e218eaba5e1d5b35bcd833836d84d',
            sort: 'created: asc',
            per_page: 5
          }
        }).done(function(repos){
            /*
            $.each(object/array, callback) 
            A generic iterator function, which can be used to 
            seamlessly iterate over objects or arrays
            */
            //console.log(repos);查看repos array
          $.each(repos, function(index, repo){
            $('#repos').append(`
              <div class="well">
                <div class="row">
                  <div class="col-md-7">
                    <strong>${repo.name}</strong>: ${repo.description}
                  </div>
                  <div class="col-md-3">
                    <span class="label label-default">Forks: ${repo.forks_count}</span>
                    <span class="label label-primary">Watchers: ${repo.watchers_count}</span>
                    <span class="label label-success">Stars: ${repo.stargazers_count}</span>
                  </div>
                  <div class="col-md-2">
                    <a href="${repo.html_url}" target="_blank" class="btn btn-default">Repo Page</a>
                  </div>
                </div>
              </div>
            `);
          });
        });
        $('#profile').html(`
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">${user.name}</h3>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-3">
                  <img class="thumbnail avatar" src="${user.avatar_url}">
                  <a target="_blank" class="btn btn-primary btn-block" href="${user.html_url}">View Profile</a>
                </div>
                <div class="col-md-9">
                <span class="label label-default">Public Repos: ${user.public_repos}</span>
                <span class="label label-primary">Public Gists: ${user.public_gists}</span>
                <span class="label label-success">Followers: ${user.followers}</span>
                <span class="label label-info">Following: ${user.following}</span>
                <br><br>
                <ul class="list-group">
                  <li class="list-group-item">Company: ${user.company}</li>
                  <li class="list-group-item">Website/blog: ${user.blog}</li>
                  <li class="list-group-item">Location: ${user.location}</li>
                  <li class="list-group-item">Member Since: ${user.created_at}</li>
                </ul>
                </div>
              </div>
            </div>
          </div>
          <h3 class="page-header">Latest Repos</h3>
          <div id="repos"></div>
        `);
      });
    });
  });