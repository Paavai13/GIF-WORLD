(function () {
  const gifs = [];
  function giphySearch(keyword, section) {
    if (section === 'thumbs') {
      var limit = 12;
    } else {
      var limit = 4;
    }
    return fetch(`http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${GIPHY_KEY}&limit=${limit}`)
      .then(response => response.json());
  }

  function appendImage(img, section) {
    let $div = $('<div class="img-wrapper"></div>');
    $('<div class="inner"></div>').append(img).appendTo($div);
    if (section === 'thumbs') {
      $('#thumbs').append($div)
    } else {
      let $div1 = $('<div id="recommended"></div>').append($div);
      $('#recommended').append($div)
    }
  }

  function showLoader() {
    $('.loader-wrapper').addClass('shown');
  }

  function onImgLoad(img) {
    return new Promise((resolve, reject) => {
      img.onload = resolve;
    });
  }

  (function listenOnFormSubmit() {
    $('#searchForm').submit(async (ev) => {
      ev.preventDefault();

      let $input = $('#searchInput');
      if (gifs[gifs.length - 1] !== $input.val())
        gifs.push($input.val());
      $('#thumbs').html('');
      recommendedSection();
      main($input.val(), 'thumbs');
    });
  })();

  function recommendedSection() {
      if (gifs.length === 0) {
        document.getElementById("recommend").textContent = ' ';
      }
      else if (gifs.length > 1) {
        document.getElementById("recommend").textContent = 'RECOMMENDED GIFS';
        $('#recommended').html('');
        gifs.filter((item, index) => gifs.indexOf(item) !== index);
        if (gifs.length > 3) {
          gifs.shift();
        }
        console.log(gifs);
        gifs.slice().reverse()
          .forEach(function (item) {
            if (item !== gifs[gifs.length - 1])
              main(item, 'recommmended')
          });
      }
  }
  
  recommendedSection();

  async function main(keyword, section) {
    const result = await giphySearch(keyword, section);
    showLoader();
    let promises = [];
    result.data.forEach(gif => {
        let img = new Image();
        img.src = gif.images.original.url;
        promises.push(onImgLoad(img));
        appendImage(img, section);
    });
  }
})();