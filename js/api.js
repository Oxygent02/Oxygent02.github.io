//=========================MENGAMBIL DATA DARI API==============================
// var base_url = "https://readerapi.codepolitan.com/";

const API_KEY   = 'adce15e60b1d4fe99ad034af0b0e6ffb';
const LEAGUE_ID = 2014; //liga spanyol

var base_url    = "https://api.football-data.org/v2/";
var team_url    = `${base_url}competitions/${LEAGUE_ID}/teams`
var match_url   = `${base_url}competitions/${LEAGUE_ID}/matches`

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });
}

var getMatchesData = () => {
  return fetchApi(match_url)
    .then(status)
    .then(json)
}

var getTeamsData = () => {
  return fetchApi(team_url)
    .then(status)
    .then(json)
}

// Blok kode untuk melakukan request data json API
var teamData;

function getTeams() {
  var teamsFromAPI = getTeamsData();

  //Jika sudah ada di cache
  if ("caches" in window) {
    caches.match(team_url).then(function(response) {
      if (response) {
        response.json().then(function(data) {

          var teamsHTML = "";
          data.teams.forEach(function(team) {
            teamsHTML += `
                  <div class="col s12 m12 l4">
                    <div class="card green lighten-5">
                      <div class="card-content">
                        <div class="center"><img width="100" height="100" src="${team.crestUrl}"></div>
                        <div class="center">${team.name}</div>
                        <div class="center">${team.area.name}</div>
                        <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
                      </div>
                      <div class="card-action right-align">
                          <a class="waves-effect green darken-4 btn-floating" onclick="insertTeamListener(${team.id})"><i class="material-icons">add</i></a>
                      </div>
                    </div>
                  </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teams").innerHTML = teamsHTML;
        });
      }
    });
  }

  //Jika data tidak ada di cache
  // fetch(base_url + "articles")
  teamsFromAPI.then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      var str = JSON.stringify(data).replace(/http:/g, 'https:');
      data = JSON.parse(str);

      teamData = data;

      // Menyusun komponen card artikel secara dinamis
      var teamsHTML = "";
      data.teams.forEach(function(team) {
        teamsHTML += `
              <div class="col s12 m12 l4">
                <div class="card green lighten-5">
                  <div class="card-content">
                    <div class="center"><img width="100" height="100" src="${team.crestUrl}"></div>
                    <div class="center">${team.name}</div>
                    <div class="center">${team.area.name}</div>
                    <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
                  </div>
                  <div class="card-action right-align">
                      <a class="waves-effect green darken-4 btn-floating" onclick="insertTeamListener(${team.id})"><i class="material-icons">add</i></a>
                  </div>
                </div>
              </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teams").innerHTML = teamsHTML;
    })
    .catch(error);
}

//=====================function untuk merapikan match========================
function sortByDateASC(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function toDMY(date){
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}
//==================END|function untuk merapikan match========================

function getMatches() {
  var matchesFromAPI = getMatchesData();

  //Jika sudah ada di cache
  if ("caches" in window) {
    caches.match(match_url).then(function(response) {
      if (response) {
        response.json().then(function(data) {

          var matchdays = sortByDateASC(data.matches, 'matchday');
          var matchesHTML = "";

          for (const key in matchdays) {
            if (key != 'null') {
                  matchdays[key].forEach(function(match) {
                    matchesHTML += `
                    <div class="col s12 m12 l4">
                      <div class="card">
                        <div class="card-content card-match">
                        <h4 class="center">${toDMY(new Date(match.utcDate))}</h4>
                        <hr>
                          <div class="row">
                            <div class="col s10">${match.homeTeam.name}</div>
                            <div class="col s2">${match.score.fullTime.homeTeam}</div>
                          </div>
                          <div class="row center">
                          VS
                          </div>
                          <div class="row">
                            <div class="col s10">${match.awayTeam.name}</div>
                            <div class="col s2">${match.score.fullTime.awayTeam}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                        `;
                  });
            }
          }
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("matches").innerHTML = matchesHTML;
        });
      }
    });
  }

  //Jika data tidak ada di cache
  // fetch(base_url + "articles")
  matchesFromAPI.then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var matchdays = sortByDateASC(data.matches, 'matchday');
      var matchesHTML = "";

      for (const key in matchdays) {
        if (key != 'null') {
              matchdays[key].forEach(function(match) {
                matchesHTML += `
                <div class="col s12 m12 l4">
                  <div class="card">
                    <div class="card-content card-match">
                    <h4 class="center">${toDMY(new Date(match.utcDate))}</h4>
                    <hr>
                      <div class="row">
                        <div class="col s10">${match.homeTeam.name}</div>
                        <div class="col s2">${match.score.fullTime.homeTeam}</div>
                      </div>
                      <div class="row center">
                      VS
                      </div>
                      <div class="row">
                        <div class="col s10">${match.awayTeam.name}</div>
                        <div class="col s2">${match.score.fullTime.awayTeam}</div>
                      </div>
                    </div>
                  </div>
                </div>
                    `;
              });
        }
      }
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("matches").innerHTML = matchesHTML;
    })
    .catch(error);
}

//=============================FAVORITE===============================
function getFavTeams() {
  //Jika sudah ada di cache
  if ("caches" in window) {
    caches.match(team_url).then(function(response) {
      if (response) {
        response.json().then(function(data) {

          var teamsHTML = "";
          var teams = getFavTeamsFromDB();

          teams.then(function(data){
            console.log(teams);

            data.forEach(function(team){
              teamsHTML += `
              <div class="col s12 m12 l4">
                <div class="card green lighten-5">
                  <div class="card-content">
                    <div class="center"><img width="100" height="100" src="${team.crestUrl}"></div>
                    <div class="center">${team.name}</div>
                    <div class="center">${team.area.name}</div>
                    <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
                  </div>
                  <div class="card-action right-align">
                      <a class="waves-effect red darken-4 btn-floating" onclick="deleteTeamListener(${team.id})"><i class="material-icons left">delete</i></a>
                  </div>
                </div>
              </div>
            `;
            })

            if(data.length == 0)
              teamsHTML += '<h5 class="center">Tidak ada tim favorit!</h5>';

              document.getElementById("favoriteteams").innerHTML = teamsHTML;
            });
          });
       }
     });
   }


  //Jika data tidak ada di cache
  // fetch(base_url + "articles")
  teamData.then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var teamsHTML = "";
      var teams = getFavTeamsFromDB();

      teams.then(function(data){
        console.log(teams);
        teamData = data;

        data.forEach(function(team){
          teamsHTML += `
          <div class="col s12 m12 l4">
            <div class="card green lighten-5">
              <div class="card-content">
                <div class="center"><img width="100" height="100" src="${team.crestUrl}"></div>
                <div class="center">${team.name}</div>
                <div class="center">${team.area.name}</div>
                <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
              </div>
              <div class="card-action right-align">
                  <a class="waves-effect red darken-4 btn-floating" onclick="deleteTeamListener(${team.id})"><i class="material-icons left">delete</i></a>
              </div>
            </div>
          </div>
        `;
        })

        if(data.length == 0)
          teamsHTML += '<h5 class="center">Tidak ada tim favorit!</h5>';

          document.getElementById("favoriteteams").innerHTML = teamsHTML;
      })

    })
    .catch(error);
}


//=============================DATABASE===============================
var dbPromise = idb.open('footbally', 1, function(upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
  }
});

function insertTeam(team){
  dbPromise.then(function(db){
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams')
    team.createdAt = new Date().getTime()
    store.put(team)
    return tx.complete;
  }).then(function(){
    M.toast({ html: `${team.name} menjadi favorit!` })
    console.log('tim disimpan');
  }).catch(function(err){
    console.error('gagal simpan tim', err);
  });
}

function deleteTeam(teamId){
  dbPromise.then(function(db){
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams');
    store.delete(teamId);
    return tx.complete;
  }).then(function(){
    M.toast({ html: `Terhapus dari favorit`});
    // setTimeout(location.reload.bind(location), 5000);
    getFavTeams();
  }).catch(function(err){
    console.error('Error hapus db: ', err);
  });
}

function getFavTeamsFromDB(){
  return dbPromise.then(function(db){
    var tx = db.transaction('teams', 'readonly');
    var store = tx.objectStore('teams');
    return store.getAll();
  })
}


//========================LISTENER====================================
function insertTeamListener (teamId){
  var team = teamData.teams.filter(idtim => idtim.id == teamId)[0];
  insertTeam(team);
}

function deleteTeamListener (teamId){
  var c = confirm("Hapus team?")
  if (c == true) {
    deleteTeam(teamId);
  }
}
