function loadIMG(url, id) {
    return new Promise(function (resolve, reject) {
            let element = document.getElementById(id);
            element.setAttribute("src", url);
            element.setAttribute("alt", url);
            element.setAttribute("onclick", 'changeImage("'+url+'")');
            element.onload = function () {
                resolve(url);
            };
            element.onerror = function () {
                reject(url);
            };
        }
    );
}

function changeImage(src) {
    _img.src = src;
}

function loadGallery() {
    Promise.all([
        loadIMG('img1.jpg', 'img1'),
        loadIMG('img2.jpg', 'img2'),
        loadIMG('img3.jpg', 'img3'),
        loadIMG('img4.jpg', 'img4'),
        loadIMG('img5.jpg', 'img5'),
        loadIMG('img6.jpg', 'img6'),
        loadIMG('img7.jpg', 'img7'),
        loadIMG('img8.jpg', 'img8'),
        loadIMG('img9.jpg', 'img9'),
        loadIMG('img10.jpg', 'img10'),
        loadIMG('img11.jpg', 'img11'),
        loadIMG('img12.jpg', 'img12'),
    ]).then(function() {
        console.log('Wszystko z równoległej si˛e załadowało!');
    }).catch(function() {
        console.log('Bł ˛ad ładowania galerii rownoległej');
    });


}
