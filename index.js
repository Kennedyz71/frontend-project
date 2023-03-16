const $button = $("button");
const $input = $("input");
const $results = $("#results");
const $search = $("#search");
let timezone;
if ($results.children().length === 0) {
  $results.hide();
}

$button.on("click", () => {
  $.get("https://geocode.maps.co/search?q=" + $input.val(), function (data) {
    function getUs() {
      for (let i = 0; i < data[i].display_name.length; i++) {
        if (data[i].display_name.includes("United States")) {
          console.log(i);
          console.log(data[i].display_name);
          return i;
        } else {
          console.log("nope");
        }
      }
      return false;
    }
    // getUs()

    let $la = data[getUs()].lat;
    const $lat = parseFloat($la).toFixed(4);
    let $lo = data[getUs()].lon;
    const $lon = parseFloat($lo).toFixed(4);
    const $latLon = $lat + "," + $lon;
    const $latLong = $lat + "&lon=" + $lon;
    console.log($latLon);
    console.log(data);
    $.get("https://api.weather.gov/points/" + $latLon, async function (data) {
      console.log($(data));
      console.log(data.properties.timeZone);
      timezone = data.properties.timeZone; // example timezone
      var currentTime;
      console.log(timezone);
      function updateTimeZone() {
        currentTime = new Date().toLocaleTimeString("en-US", {
          timeZone: timezone,
          hour12: false,
        });

        document.getElementById("currentTime").innerText =
          "Current Local Time:\n" + currentTime;
        setTimeout(function () {
          updateTimeZone();
        }, 1000);
      }
      // let localTime = "Current Local Time: <br>" + currentTime;
      // updateTimeZone();
      // console.log(currentTime);
      // console.log(data.properties.relativeLocation.properties.city);
      let forecastUrl = data.properties.forecast;
      // console.log(forecastUrl);
      let hTemp;
      let lTemp;
      let ele;
      let inFt;

      await $.get(forecastUrl, (data) => {
        console.log(data);
        hTemp =
          "Highs:  <br>" + data.properties.periods[0].temperature + "&#8457";
        lTemp =
          "Lows: <br>" + data.properties.periods[1].temperature + "&#8457";
        ele = data.properties.elevation.value * 3.281;
        inFt = "Elevation: <br>" + parseFloat(ele).toFixed(2);
        sumUp =
          data.properties.periods[0].detailedForecast +
          data.properties.periods[1].detailedForecast;
      });

      let $resultCard = $(`
            <span class="result-card">
                <h3 class="card-title" id='city'>${data.properties.relativeLocation.properties.city}, ${data.properties.relativeLocation.properties.state}</h3>
                <h3 id="currentTime">${currentTime}</h3>
                <h2 id="elevation"> ${inFt} ft</h2>
                <h2 class=${data.properties.relativeLocation.properties.city} high>${hTemp}</h2>
                <h2 class=${data.properties.relativeLocation.properties.city} low>${lTemp}</h2>
                <div class="card-summary">
                    <em><u><b> Detailed Summary:<b> </u></em>
                    <p><b>${sumUp}</b></p>
                    <a href="https://forecast.weather.gov/MapClick.php?lat=${$latLong}" target="_blank">Detailed 7 day forecast</a>
                </div>
            </span>
            `);
      $results.append($resultCard);
      $results.show();
      updateTimeZone();

      $button.click(function () {
        $resultCard.remove();
      });
    });
  });

  if ($input == [] || $input == "") {
    let $nope = $(`<div id="results">Sorry must be lat.</div>`);
    $results.append($nope);
    console.log("no");
  } else {
    console.log("yes");
    return $input;
  }
});

$input.keypress(function (event) {
  // var keycode = event.keyCode ? event.keyCode : event.which;
  if (event.which == "13") {
    // alert("works");
    $button.click();
  }
});

//clock///////////////////////////////////////////////////////////////
function currentTime() {
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  // let session = "AM";

  // if (hh == 0) {
  //   hh = 12;
  // }
  if (hh > 12) {
    // session = "PM";
  }

  hh = hh < 10 ? "0" + hh : hh;
  mm = mm < 10 ? "0" + mm : mm;
  ss = ss < 10 ? "0" + ss : ss;

  let time = hh + ":" + mm + ":" + ss + " "; //+ session

  document.getElementById("clock").innerText = time;
  let t = setTimeout(function () {
    currentTime();
  }, 1000);
}
currentTime();

var inputs = document.getElementsByTagName("input");
for (var i = 0; i < inputs.length; i++) {
  inputs[i].value = inputs[i].getAttribute("data-placeholder");
  inputs[i].addEventListener("focus", function () {
    if (this.value == this.getAttribute("data-placeholder")) {
      this.value = "";
    }
  });
  inputs[i].addEventListener("blur", function () {
    if (this.value == "") {
      this.value = this.getAttribute("data-placeholder");
    }
  });
}

// $clock.text
// $clock.innerHtml
// document.getElementById("clock").innerText
